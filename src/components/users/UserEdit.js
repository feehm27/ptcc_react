import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Stack,
  TextField
} from '@material-ui/core';
import { Formik } from 'formik';
import { isEmpty } from 'lodash';
import { useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import UserEditScheam from 'src/schemas/UserEditSchema';
import { API } from 'src/services/api';
import { UserContext } from 'src/contexts/UserContext';
import ToastAnimated, { showToast } from '../Toast';

const UserEdit = () => {
  const navigate = useNavigate();
  const { data } = useContext(UserContext);
  const { user, show } = useLocation().state;
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [clients, setClients] = useState([]);
  const [checked, setChecked] = useState(false);
  const [token, setToken] = useState();

  const showSuccess = useRef(false);

  /**
   * Envia os dados do advogado
   * @param {*} values
   */
  async function updateUser(values) {
    setSubmitting(true);
    showSuccess.current = false;

    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    const treatedValues = {
      name: values.name,
      email: values.email,
      is_advocate: values.profile === '1' ? 1 : 0,
      is_client: values.profile === '2' ? 1 : 0,
      client_id: values.profile === '2' ? values.client : undefined
    };

    await API.put(`advocates/users/${user.id}`, treatedValues, config)
      .then(() => {
        showSuccess.current = true;
      })
      .catch((err) => {
        setError(err.response.data.errors);
        showSuccess.current = false;
      });

    setSubmitting(false);
  }

  const handleChangeChecked = (event) => {
    setChecked(event.target.checked);
  };

  /**
   * Envia os dados do formulário
   * @param {*} values
   */
  const handleSubmit = (values, errors) => {
    if (isEmpty(errors)) updateUser(values);
  };

  const checkedPermission = () => {
    if (data && !data.isAdmin) {
      return data.checkeds.permissions_checked[10][0].checked === 0 || show;
    } else {
      return false || show;
    }
  };

  /**
   * Obtém os clientes associados ao advocado
   */
  async function getClients() {
    const tokenUser = window.localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${tokenUser}` }
    };
    await API.get('advocates/clients', config)
      .then((response) => {
        setClients(response.data.data);
      })
      .catch((err) => console.error(err));
  }

  /**
   * Use Effect
   */
  useEffect(() => {
    setToken(window.localStorage.getItem('token'));
    getClients();
  }, []);

  return (
    <div style={{ marginLeft: '14px', marginTop: '14px' }}>
      <Formik
        initialValues={{
          name: user.name || '',
          email: user.email || '',
          password: user.password || '',
          profile: user.is_advocate ? '1' : '2',
          confirm_password: user.password || '',
          client:
            user.client_user && user.client_user[0]
              ? user.client_user[0].client_id
              : '0'
        }}
        validationSchema={UserEditScheam}
        onSubmit={handleSubmit}
      >
        {({ errors, handleBlur, handleChange, values, submitForm }) => (
          <form
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault();
              showSuccess.current = false;
              handleSubmit(values, errors);
            }}
          >
            <>
              <Card>
                <Card>
                  <CardHeader title="Dados do usuário" />
                  <Divider />
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid item md={6} xs={12}>
                        <TextField
                          error={errors.name}
                          fullWidth
                          helperText={errors.name}
                          label="Nome do usuário"
                          name="name"
                          onBlur={(event) => {
                            handleBlur(event);
                            showSuccess.current = false;
                          }}
                          onChange={(event) => {
                            handleChange(event);
                            showSuccess.current = false;
                          }}
                          value={values.name}
                          required
                          variant="outlined"
                          disabled={show}
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <TextField
                          error={
                            errors.email ||
                            (error && error.email ? error.email[0] : '')
                          }
                          fullWidth
                          helperText={
                            errors.email ||
                            (error && error.email ? error.email[0] : '')
                          }
                          label="Email"
                          name="email"
                          onBlur={(event) => {
                            handleBlur(event);
                            showSuccess.current = false;
                          }}
                          onChange={(event) => {
                            handleChange(event);
                            showSuccess.current = false;
                          }}
                          required
                          value={values.email}
                          variant="outlined"
                          disabled={show}
                        />
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={checked}
                              color="primary"
                              disabled={show}
                              onChange={(e) => {
                                handleChangeChecked(e);
                                showSuccess.current = false;
                              }}
                            />
                          }
                          label="Alterar perfil do usuário?"
                        />
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <TextField
                          disabled={!checked || show}
                          error={errors.profile}
                          fullWidth
                          helperText={errors.profile}
                          name="profile"
                          onBlur={(event) => {
                            handleBlur(event);
                            showSuccess.current = false;
                          }}
                          onChange={(event) => {
                            handleChange(event);
                            values.client = '0';
                            showSuccess.current = false;
                          }}
                          required
                          select
                          SelectProps={{ native: true }}
                          value={values.profile}
                          variant="outlined"
                        >
                          <option key="1" value="1">
                            Advogado
                          </option>
                          <option key="2" value="2">
                            Cliente
                          </option>
                        </TextField>
                      </Grid>
                      {values.profile === '2' && (
                        <Grid item md={6} xs={12}>
                          <TextField
                            disabled={!checked || show}
                            error={errors.client}
                            fullWidth
                            helperText={errors.client}
                            label="Selecionar cliente"
                            name="client"
                            onBlur={(event) => {
                              handleBlur(event);
                              showSuccess.current = false;
                            }}
                            onChange={(event) => {
                              handleChange(event);
                              showSuccess.current = false;
                            }}
                            select
                            SelectProps={{ native: true }}
                            value={values.client}
                            variant="outlined"
                            required
                          >
                            <option key="0" value="0">
                              Selecione um cliente
                            </option>
                            {clients.map((client) => (
                              <option key={client.id} value={client.id}>
                                {client.name}
                              </option>
                            ))}
                          </TextField>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Card>
                <Divider />
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    p: 2
                  }}
                >
                  <Stack direction="row" spacing={2}>
                    <Button
                      color="primary"
                      variant="outlined"
                      onClick={() => navigate('/users')}
                    >
                      Voltar
                    </Button>
                    {submitting ? (
                      <Button color="primary" variant="contained" disabled>
                        Carregando..
                      </Button>
                    ) : (
                      <Button
                        color="primary"
                        variant="contained"
                        type="submit"
                        disabled={checkedPermission()}
                        onClick={submitForm}
                      >
                        Salvar
                      </Button>
                    )}
                  </Stack>
                </Box>
              </Card>
            </>
            {showSuccess.current && (
              <>
                <ToastAnimated />
                {showToast({
                  type: 'success',
                  message: 'Usuário alterado com sucesso!'
                })}
              </>
            )}
          </form>
        )}
      </Formik>
    </div>
  );
};

export default UserEdit;
