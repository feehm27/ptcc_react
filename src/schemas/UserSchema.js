import * as Yup from 'yup';

const UserSchema = Yup.object().shape({
  name: Yup.string().max(255).required('Campo obrigatório'),
  email: Yup.string()
    .email('Informe um email válido')
    .max(255)
    .required('Campo obrigatório'),
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
    ),
  profile: Yup.string(),
  client: Yup.string().test(
    'required',
    'Campo obrigatório',
    function selectedClient(value) {
      if (this.parent.profile === '2' && value === '0') return false;
      return true;
    }
  )
});

export default UserSchema;
