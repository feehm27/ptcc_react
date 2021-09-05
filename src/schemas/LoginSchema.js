import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Informe um email válido')
    .max(255)
    .required('Campo obrigatório'),
  password: Yup.string()
    .min(8, 'Informe no mínimo 8 caracteres')
    .max(255)
    .required('Campo obrigatório')
});

export default LoginSchema;
