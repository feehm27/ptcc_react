import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography
} from '@material-ui/core';
import LinkedinIcon from 'src/icons/Linkedin';
import LoginSchema from 'src/schemas/LoginSchema';
import React, { useContext } from 'react';
import { UserContext } from 'src/contexts/UserContext';

const Login = () => {
  const { userLogin } = useContext(UserContext);

  async function signIn(values) {
    userLogin(values.email, values.password);
  }

  return (
    <>
      <Helmet>
        <title>Login | Advoguez</title>
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
              email: '',
              password: ''
            }}
            validationSchema={LoginSchema}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values
            }) => (
              <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 2, mt: 10 }}>
                  <Typography color="primary" variant="h2" textAlign="center">
                    Login
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={errors.email}
                  label="Usuário"
                  margin="normal"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="teste@teste.com.br"
                  type="email"
                  value={values.email}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={errors.password}
                  label="Senha"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Password123"
                  type="password"
                  value={values.password}
                  variant="outlined"
                />

                <Box sx={{ py: 2 }}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    onClick={() => signIn(values)}
                  >
                    Entrar
                  </Button>
                  <Typography color="primary" variant="h4" textAlign="center">
                    ou
                  </Typography>
                  <Button
                    color="primary"
                    fullWidth
                    startIcon={<LinkedinIcon />}
                    onClick={handleSubmit}
                    size="large"
                    variant="contained"
                  >
                    Entrar com Linkedin
                  </Button>
                </Box>
                <Typography color="textSecondary" variant="body1">
                  Não tem cadastro?{' '}
                  <Link component={RouterLink} to="/register" variant="h6">
                    <span>Cadastre-se</span>
                  </Link>
                </Typography>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </>
  );
};

export default Login;
