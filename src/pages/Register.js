import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
import React from 'react';
import LinkedinIcon from 'src/icons/Linkedin';

const Register = () => {
  const navigate = useNavigate();

  const [selectedProfileType, setSelectedProfileType] =
    React.useState('advocate');

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
              lastName: '',
              password: '',
              typeProfile: 'advocate'
            }}
            validationSchema={RegisterSchema}
            onSubmit={() => {
              navigate('/app/dashboard', { replace: true });
            }}
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
                <Box sx={{ mb: 2 }}>
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
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  label="Email"
                  margin="normal"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
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
                  <Box
                    sx={{ mr: 3 }}
                    error={Boolean(touched.profileType && errors.profileType)}
                    fullWidth
                    helperText={touched.profileType && errors.profileType}
                  >
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
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
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
                    onClick={handleSubmit}
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
