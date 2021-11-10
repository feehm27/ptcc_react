import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography
} from '@material-ui/core';
import { Formik } from 'formik';
import { isEmpty } from 'lodash';
import React, { useContext } from 'react';
import ReactFacebookLogin from 'react-facebook-login';
import { Helmet } from 'react-helmet';
import { Link as RouterLink } from 'react-router-dom';
import { UserContext } from 'src/contexts/UserContext';
import Facebook from 'src/icons/Facebook';
import LoginSchema from 'src/schemas/LoginSchema';

const Login = () => {
  const { userLogin, error, loading, userFacebook, loadingFacebook } =
    useContext(UserContext);

  /**
   * Loga o usuário
   * @param {*} email
   * @param {*} password
   * @param {*} errors
   */
  async function signIn(email, password, errors) {
    if (isEmpty(errors)) userLogin(email, password);
  }

  const signInWithFacebook = () => {
    console.log('clicado');
  };

  /**
   * Loga o usuário com o Facebook
   * @param {*} response
   */
  async function responseFacebook(response) {
    const values = {
      name: response.name,
      email: response.email,
      is_advocate: 1,
      is_client: 0,
      facebook_id: response.id
    };
    userFacebook(values);
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
                  error={Boolean(touched.email && errors.email) || error}
                  fullWidth
                  helperText={(touched.email && errors.email) || error}
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
                  helperText={touched.password && errors.password}
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
                  {loading ? (
                    <Button
                      color="primary"
                      disabled
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                    >
                      Carregando...
                    </Button>
                  ) : (
                    <Button
                      color="primary"
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      onClick={() =>
                        signIn(values.email, values.password, errors)
                      }
                    >
                      Entrar
                    </Button>
                  )}
                  <Typography color="primary" variant="h4" textAlign="center">
                    ou
                  </Typography>
                  {loadingFacebook ? (
                    <Button
                      color="primary"
                      disabled
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                    >
                      Carregando...
                    </Button>
                  ) : (
                    <ReactFacebookLogin
                      appId="392768758992552"
                      autoLoad={false}
                      fields="name,email"
                      onClick={signInWithFacebook}
                      callback={responseFacebook}
                      textButton="Entrar com Facebook"
                      icon={<Facebook></Facebook>}
                    >
                      Entrar com Facebook
                    </ReactFacebookLogin>
                  )}
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
