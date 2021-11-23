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
import { Link as RouterLink } from 'react-router-dom';
import ToastAnimated, { showToast } from 'src/components/Toast';
import ResetPasswordSchema from 'src/schemas/ResetPasswordSchema';
import { API } from 'src/services/api';

const ResetPassword = () => {
  const [registerErrors, setRegisterErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const showSuccess = useRef(false);

  async function resetPassword(email, errors) {
    if (isEmpty(errors)) {
      setSubmitting(true);
      showSuccess.current = false;

      await API.post('/forgot-password', { email })
        .then((response) => {
          if (response.data.status_code === 400) {
            setRegisterErrors(response.data.errors);
          } else {
            showSuccess.current = true;
          }
        })
        .catch((err) => {
          showSuccess.current = false;
          setRegisterErrors(err.response.data.errors);
        });
      setSubmitting(false);
    }
  }

  return (
    <>
      <Helmet>
        <title>Recuperação de senha</title>
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
              email: ''
            }}
            validationSchema={ResetPasswordSchema}
            onSubmit={resetPassword}
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
                  resetPassword(values.email, errors);
                }}
              >
                <Box sx={{ mb: 2, mt: 10 }}>
                  <Typography color="primary" variant="h2" textAlign="center">
                    Trocar a senha
                  </Typography>
                </Box>
                <Box sx={{ mb: 2, mt: 5 }}>
                  <Typography color="textSecondary" variant="h5">
                    Identifique-se para receber um e-mail com as intruções e o
                    link para criar uma nova senha.
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(
                    (touched.email && errors.email) || registerErrors.email
                  )}
                  fullWidth
                  helperText={
                    (touched.email && errors.email) || registerErrors.email
                  }
                  label="Email"
                  margin="normal"
                  name="email"
                  onBlur={handleBlur}
                  onChange={(event) => {
                    showSuccess.current = false;
                    handleChange(event);
                    setRegisterErrors([]);
                  }}
                  type="email"
                  value={values.email}
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
                      Cancelar
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
                        Receber e-mail
                      </Button>
                    )}
                  </Stack>
                </Box>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
      {showSuccess.current && (
        <>
          <ToastAnimated />
          {showToast({
            type: 'success',
            message: 'E-mail enviado com sucesso!'
          })}
        </>
      )}
    </>
  );
};

export default ResetPassword;
