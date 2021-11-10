import * as Yup from 'yup';

const UserEditScheam = Yup.object().shape({
  name: Yup.string().max(255).required('Campo obrigatório'),
  email: Yup.string()
    .email('Informe um email válido')
    .max(255)
    .required('Campo obrigatório'),
  profile: Yup.string()
    .required('Campo obrigatório')
    .test('isNull', 'Campo obrigatório', (value) => {
      return value !== '0';
    })
});

export default UserEditScheam;
