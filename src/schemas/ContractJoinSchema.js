import * as Yup from 'yup';

const ContractJoinSchema = Yup.object().shape({
  clients: Yup.string()
    .required('Campo obrigatório')
    .test('isNull', 'Campo obrigatório', (value) => {
      return value !== 0;
    })
});

export default ContractJoinSchema;
