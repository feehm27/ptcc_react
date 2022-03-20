import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Stack,
  TextField
} from '@material-ui/core';
import { Formik } from 'formik';
import { isEmpty } from 'lodash';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from 'src/contexts/UserContext';
import UserSchema from 'src/schemas/UserSchema';
import { API } from 'src/services/api';
import ToastAnimated, { showToast } from '../Toast';

const UserCreate = () => {
  const navigate = useNavigate();
  const { data } = useContext(UserContext);
  const [error, setError] = useState(null);
  const [clients, setClients] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const showSuccess = useRef(false);

  /**
   * Envia os dados do advogado
   * @param {*} values
   */
  async function sendUser(values) {
    setSubmitting(true);
    showSuccess.current = false;

    const treatedValues = {
      name: values.name,
      email: values.email,
      password: values.password,
      is_advocate: values.profile === '1' ? 1 : 0,
      is_client: values.profile === '2' ? 1 : 0,
      advocate_user_id: data.id
    };

    if (values.profile === '2') {
      treatedValues.client_id = values.client;
    }

    await API.post('register', treatedValues)
      .then((response) => {
        if (response.data.status_code === 400) {
          showSuccess.current = false;
        }
        showSuccess.current = true;
      })
      .catch((err) => {
        showSuccess.current = false;
        setError(err.response.data.errors);
      });
    setSubmitting(false);
  }

  /**
   * Envia os dados do formulário
   * @param {*} values
   */
  const handleSubmit = (values, errors) => {
    if (isEmpty(errors)) sendUser(values);
  };

  /**
   * Obtém as informações do advogado
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
    getClients();
  }, []);

  return (
    <div style={{ marginLeft: '14px', marginTop: '14px' }}>
      <Formik
        initialValues={{
          name: '',
          email: '',
          password: '',
          profile: '0',
          client: '0'
        }}
        validationSchema={UserSchema}
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
                          setError([]);
                          showSuccess.current = false;
                        }}
                        required
                        value={values.email}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        error={errors.password}
                        fullWidth
                        helperText={errors.password}
                        label="Senha"
                        margin="normal"
                        name="password"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="password"
                        value={values.password}
                        variant="outlined"
                        required
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        error={errors.confirm_password}
                        fullWidth
                        helperText={errors.confirm_password}
                        label="Confirmar senha"
                        margin="normal"
                        name="confirm_password"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        type="password"
                        value={values.confirm_password}
                        variant="outlined"
                        required
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        error={errors.profile}
                        fullWidth
                        helperText={errors.profile}
                        label="Vincular perfil do usuário"
                        name="profile"
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
                      onClick={submitForm}
                      disabled={
                        data && !data.isAdmin
                          ? data.checkeds.permissions_checked[10][0].checked ===
                            0
                          : false
                      }
                    >
                      Salvar
                    </Button>
                  )}
                </Stack>
              </Box>
            </Card>
            {showSuccess.current && (
              <>
                <ToastAnimated />
                {showToast({
                  type: 'success',
                  message: 'Usuário criado com sucesso!'
                })}
              </>
            )}
          </form>
        )}
      </Formik>
    </div>
  );
};

export default UserCreate;
