import * as Yup from 'yup';

const ResetPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Informe um email válido')
    .max(255)
    .required('Campo obrigatório')
});

export default ResetPasswordSchema;
