import * as Yup from 'yup';

const ClientJoinSchema = Yup.object().shape({
  clients: Yup.string()
    .required('Campo obrigatório')
    .test('isNull', 'Campo obrigatório', (value) => {
      return value !== 0;
    })
});

export default ClientJoinSchema;
