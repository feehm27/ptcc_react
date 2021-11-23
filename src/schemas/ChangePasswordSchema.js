import * as Yup from 'yup';

const ChangePasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Informe no mínimo 8 caracteres')
    .max(255)
    .required('Campo obrigatório'),
  confirm_password: Yup.string()
    .required('Campo obrigatório')
    .test(
      'passwords-match',
      'Senha diferente da informada',
      function confirmPassword(value) {
        return this.parent.password === value;
      }
    )
});

export default ChangePasswordSchema;
