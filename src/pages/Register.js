import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Container,
  FormControlLabel,
  Link,
  Radio,
  TextField,
  Typography
} from '@material-ui/core';
import RegisterSchema from 'src/schemas/RegisterSchema';
import LinkedinIcon from 'src/icons/Linkedin';
import { API_URL } from 'src/services/api';
import { useContext, useState } from 'react';
import { UserContext } from 'src/contexts/UserContext';

const Register = () => {
  const [selectedProfileType, setSelectedProfileType] = useState('advocate');
  const [registerErrors, setRegisterErrors] = useState([]);
  const { userLogin, loading } = useContext(UserContext);

  async function registerWithLinkedin() {
    await API_URL.get('/api/callback')
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async function register(values) {
    const data = {
      name: values.name,
      email: values.email,
      password: values.password,
      is_advocate: selectedProfileType === 'advocate' ? 1 : 0,
      is_client: selectedProfileType === 'client' ? 1 : 0
    };

    await API_URL.post('/api/register', data)
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
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex'
                  }}
                >
                  <Box sx={{ mr: 3 }}>
                    <Typography color="primary" variant="h6">
                      Tipo de perfil:
                    </Typography>
                  </Box>
                  <FormControlLabel
                    control={
                      <Radio
                        checked={selectedProfileType === 'advocate'}
                        onChange={(event) => {
                          setSelectedProfileType(event.target.value);
                        }}
                        color="primary"
                        value="advocate"
                        name="profileType"
                      />
                    }
                    label="Advogado"
                  />
                  <FormControlLabel
                    control={
                      <Radio
                        checked={selectedProfileType === 'client'}
                        onChange={(event) => {
                          setSelectedProfileType(event.target.value);
                        }}
                        color="primary"
                        value="client"
                        name="profileType"
                      />
                    }
                    label="Cliente"
                  />
                </Box>
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
                  <Typography color="primary" variant="h4" textAlign="center">
                    ou
                  </Typography>
                  <Button
                    color="primary"
                    fullWidth
                    startIcon={<LinkedinIcon />}
                    onClick={() => registerWithLinkedin()}
                    size="large"
                    variant="contained"
                  >
                    Cadastrar com Linkedin
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
