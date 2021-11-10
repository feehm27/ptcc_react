import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography
} from '@material-ui/core';
import { Formik } from 'formik';
import { useContext, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link as RouterLink } from 'react-router-dom';
import { UserContext } from 'src/contexts/UserContext';
import RegisterSchema from 'src/schemas/RegisterSchema';
import { API } from 'src/services/api';

const Register = () => {
  const [registerErrors, setRegisterErrors] = useState([]);
  const { userLogin, loading } = useContext(UserContext);

  async function register(values) {
    const data = {
      name: values.name,
      email: values.email,
      password: values.password,
      is_advocate: 1,
      is_client: 0
    };

    await API.post('register', data)
      .then((response) => {
        const convertResponse = JSON.parse(response.config.data);
        const { email, password } = convertResponse;
        userLogin(email, password);
      })
      .catch((err) => {
        setRegisterErrors(err.response.data.errors);
      });
  }

  return (
    <>
      <Helmet>
        <title>Cadastre-se | Advoguez</title>
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
              name: '',
              password: '',
              typeProfile: 'advocate'
            }}
            validationSchema={RegisterSchema}
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
                <Box sx={{ mb: 2, mt: 5 }}>
                  <Typography color="primary" variant="h2" textAlign="center">
                    Cadastre-se
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.name && errors.name)}
                  fullWidth
                  helperText={touched.name && errors.name}
                  label="Nome completo"
                  margin="normal"
                  name="name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
                  variant="outlined"
                />
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
                    handleChange(event);
                    setRegisterErrors([]);
                  }}
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
                  type="password"
                  value={values.password}
                  variant="outlined"
                />
                <Box sx={{ py: 2 }}>
                  <Button
                    color="primary"
                    disabled={loading}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    onClick={() => register(values)}
                  >
                    Cadastrar
                  </Button>
                </Box>
                <Typography color="textSecondary" variant="body1">
                  Já possui uma conta?{' '}
                  <Link component={RouterLink} to="/login" variant="h6">
                    Entrar
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

export default Register;
