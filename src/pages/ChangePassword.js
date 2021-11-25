import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography
} from '@material-ui/core';
import { Formik } from 'formik';
import { isEmpty } from 'lodash';
import { useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router';
import { Link as RouterLink, useParams } from 'react-router-dom';
import ToastAnimated, { showToast } from 'src/components/Toast';
import ChangePasswordSchema from 'src/schemas/ChangePasswordSchema';
import { API } from 'src/services/api';

const ChangePassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const showSuccess = useRef(false);

  const [registerError, setRegisterErrors] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function checkUser(password, errors) {
    if (isEmpty(errors)) {
      setSubmitting(true);

      showSuccess.current = false;

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      await API.get('/user', config)
        .then(() => {
          return API.put('/user/change/password', { password }, config)
            .then((response) => {
              if (response.data.status_code === 400) {
                setRegisterErrors(response.data.data);
              } else {
                showSuccess.current = true;
                setRegisterErrors('');
              }
            })
            .catch(() => {
              setRegisterErrors('Um erro inesperado aconteceu.');
            });
        })
        .catch(() => {
          showSuccess.current = false;
          setRegisterErrors(
            'Link expirado ou usuário inválido. Não é possivel realizar a recuperação de senha.'
          );
        });
      setSubmitting(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>Alteração de senha</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'center'
        }}
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              password: '',
              confirm_password: ''
            }}
            validationSchema={ChangePasswordSchema}
            onSubmit={checkUser}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              submitForm,
              touched,
              values
            }) => (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  showSuccess.current = false;
                  checkUser(values.password, errors);
                }}
              >
                <Box sx={{ mb: 2, mt: 10 }}>
                  <Typography color="primary" variant="h2" textAlign="center">
                    Alteração de senha
                  </Typography>
                </Box>
                <Box sx={{ mb: 2, mt: 5 }}>
                  <Typography color="textSecondary" variant="h5">
                    Informe uma nova senha recuperar seu cadastro.
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(
                    (touched.password && errors.password) || registerError
                  )}
                  fullWidth
                  helperText={
                    (touched.password && errors.password) || registerError
                  }
                  label="Nova senha"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    showSuccess.current = false;
                  }}
                  type="password"
                  value={values.password}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(
                    touched.confirm_password && errors.confirm_password
                  )}
                  fullWidth
                  helperText={
                    touched.confirm_password && errors.confirm_password
                  }
                  label="Confirmar nova senha"
                  margin="normal"
                  name="confirm_password"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    showSuccess.current = false;
                  }}
                  type="password"
                  value={values.confirm_password}
                  variant="outlined"
                />
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
                      component={RouterLink}
                      to="/login"
                      variant="outlined"
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
                        type="submit"
                        variant="contained"
                        onClick={submitForm}
                      >
                        Enviar
                      </Button>
                    )}
                  </Stack>
                </Box>
                {showSuccess.current && (
                  <>
                    <ToastAnimated />
                    {showToast({
                      type: 'success',
                      message: 'Senha alterada com sucesso!'
                    })}
                    {setTimeout(() => navigate('/login'), 1500)}
                  </>
                )}
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </>
  );
};

export default ChangePassword;
