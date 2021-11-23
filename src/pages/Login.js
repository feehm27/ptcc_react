import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography
} from '@material-ui/core';
import Facebook from '@material-ui/icons/Facebook';
import { Formik } from 'formik';
import { isEmpty } from 'lodash';
import React, { useContext } from 'react';
import ReactFacebookLogin from 'react-facebook-login';
import { Helmet } from 'react-helmet';
import { Link as RouterLink } from 'react-router-dom';
import { UserContext } from 'src/contexts/UserContext';
import LoginSchema from 'src/schemas/LoginSchema';
import styled from 'styled-components';

const Login = () => {
  const { userLogin, error, loading, userFacebook, loadingFacebook } =
    useContext(UserContext);

  /**
   * Loga o usuário
   * @param {*} values
   * @param {*} errors
   */
  const handleSubmit = (values, errors) => {
    if (isEmpty(errors)) userLogin(values.email, values.password);
  };

  const signInWithFacebook = () => {
    console.log('clicado');
  };

  const BtnFacebook = styled.a`
    .metro{
      width: 100%;
      padding: 8px 22px;
    },
    .kep-login-facebook.metro{
      border-radius: 3px;
    }
  }`;

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
            onSubmit={handleSubmit}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              touched,
              values,
              submitForm
            }) => (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(values, errors);
                }}
              >
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
                      size="medium"
                      type="submit"
                      variant="contained"
                    >
                      Carregando...
                    </Button>
                  ) : (
                    <Button
                      style={{
                        fontFamily: 'Helvetica,sans-serif',
                        fontWeight: '700',
                        backgroundColor: '#4c69ba',
                        fontSize: '14px',
                        padding: '8px 22px'
                      }}
                      fullWidth
                      color="primary"
                      variant="contained"
                      type="submit"
                      onClick={submitForm}
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
                      size="medium"
                      type="submit"
                      variant="contained"
                    >
                      Carregando...
                    </Button>
                  ) : (
                    <BtnFacebook>
                      <ReactFacebookLogin
                        justifyContent="center"
                        appId="392768758992552"
                        autoLoad={false}
                        fields="name,email"
                        onClick={signInWithFacebook}
                        callback={responseFacebook}
                        textButton={
                          <span
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '14px'
                            }}
                          >
                            <Facebook></Facebook>
                            Entrar com Facebook
                          </span>
                        }
                      ></ReactFacebookLogin>
                    </BtnFacebook>
                  )}
                </Box>
                <Typography color="textSecondary" variant="body1">
                  Não tem cadastro?{' '}
                  <Link component={RouterLink} to="/register" variant="h6">
                    <span>Cadastre-se</span>
                  </Link>
                </Typography>
                <Typography color="textSecondary" variant="body1">
                  Esqueceu sua senha ?{' '}
                  <Link
                    component={RouterLink}
                    to="/reset-password"
                    variant="h6"
                  >
                    <span>Recuperar senha</span>
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
