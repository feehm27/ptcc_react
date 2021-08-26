import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Informe um email válido')
    .max(255)
    .required('Campo obrigatório'),
  password: Yup.string().max(255).required('Campo obrigatório')
});

export default LoginSchema;
