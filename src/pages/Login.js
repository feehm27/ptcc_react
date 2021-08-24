import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Checkbox,
  Container,
  Link,
  TextField,
  Typography
} from '@material-ui/core';
import axios from 'axios';

async function sendLogin() {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/teste');
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

const Login = () => {
  const navigate = useNavigate();

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
          justifyContent: 'center',
          width: '100%',
          position: 'relative',
          border: '60px solid #5664d2'
        }}
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              email: '',
              password: ''
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email('Informe um email válido')
                .max(255)
                .required('Campo obrigatório'),
              password: Yup.string().max(255).required('Campo obrigatório')
            })}
            onSubmit={() => {
              sendLogin();
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
                <Box sx={{ mb: 3 }}>
                  <Typography color="primary" variant="h2" textAlign="center">
                    Login
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
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
                <Typography color="textSecondary" variant="body1">
                  <Checkbox onChange={handleChange} name="checkedB" />
                  Mantenha-me conectado
                </Typography>

                <Box sx={{ py: 2 }}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Entrar
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
