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
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import UserEditScheam from 'src/schemas/UserEditSchema';
import { API } from 'src/services/api';
import { UserContext } from 'src/contexts/UserContext';
import ToastAnimated, { showToast } from '../Toast';

const UserEdit = () => {
  const navigate = useNavigate();
  const { data } = useContext(UserContext);
  const { user } = useLocation().state;
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [checked, setChecked] = useState(false);
  const [token, setToken] = useState();

  /**
   * Envia os dados do advogado
   * @param {*} values
   */
  async function updateUser(values) {
    setSubmitting(true);
    setShowSuccess(false);

    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    const treatedValues = {
      name: values.name,
      email: values.email,
      is_advocate: values.profile === '1' ? 1 : 0,
      is_client: values.profile === '2' ? 1 : 0
    };

    await API.put(`advocates/users/${user.id}`, treatedValues, config)
      .then(() => {})
      .catch((err) => {
        setError(err.response.data.errors);
        setShowSuccess(false);
      })
      .finally(() => {
        setSubmitting(false);
        setShowSuccess(true);
      });
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

  /**
   * Use Effect
   */
  useEffect(() => {
    setToken(window.localStorage.getItem('token'));
  }, []);

  return (
    <Formik
      initialValues={{
        name: user.name || '',
        email: user.email || '',
        password: user.password || '',
        profile: user.is_advocate ? '1' : '2',
        confirm_password: user.password || ''
      }}
      validationSchema={UserEditScheam}
      onSubmit={handleSubmit}
    >
      {({ errors, handleBlur, handleChange, values, submitForm }) => (
        <form
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            setShowSuccess(false);
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
                          setShowSuccess(false);
                        }}
                        onChange={(event) => {
                          handleChange(event);
                          setShowSuccess(false);
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
                          setShowSuccess(false);
                        }}
                        onChange={(event) => {
                          handleChange(event);
                          setShowSuccess(false);
                        }}
                        required
                        value={values.email}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={12} xs={12}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={checked}
                            color="primary"
                            onChange={(e) => {
                              handleChangeChecked(e);
                              setShowSuccess(false);
                            }}
                          />
                        }
                        label="Alterar perfil do usuário?"
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        disabled={!checked}
                        error={errors.profile}
                        fullWidth
                        helperText={errors.profile}
                        name="profile"
                        onBlur={(event) => {
                          handleBlur(event);
                          setShowSuccess(false);
                        }}
                        onChange={(event) => {
                          handleChange(event);
                          setShowSuccess(false);
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
                      disabled={
                        data &&
                        data.checkeds.permissions_checked[10][0].checked === 0
                      }
                      onClick={submitForm}
                    >
                      Salvar
                    </Button>
                  )}
                </Stack>
              </Box>
            </Card>
          </>
          {showSuccess && (
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
  );
};

export default UserEdit;
