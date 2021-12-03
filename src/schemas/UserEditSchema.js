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
    }),
  client: Yup.string().test(
    'required',
    'Campo obrigatório',
    function selectedClient(value) {
      return value !== '0' || Yup.ref('profile') === 2;
    }
  )
});

export default UserEditScheam;
