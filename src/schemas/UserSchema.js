import * as Yup from 'yup';

const UserSchema = Yup.object().shape({
  name: Yup.string().max(255).required('Campo obrigatório'),
  email: Yup.string()
    .email('Informe um email válido')
    .max(255)
    .required('Campo obrigatório'),
  profile: Yup.string()
    .required('Campo obrigatório')
    .test('isNull', 'Campo obrigatório', (value) => {
      return value !== '0';
    }),
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

export default UserSchema;
