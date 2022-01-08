import * as Yup from 'yup';

const ContractSchema = Yup.object().shape({
  payment_day: Yup.string()
    .required('Campo obrigatório')
    .test('isNull', 'Campo obrigatório', (value) => {
      return value !== '0';
    }),
  contract_price: Yup.string().required('Campo obrigatório'),
  fine_price: Yup.string().required('Campo obrigatório'),
  agency: Yup.string().required('Campo obrigatório'),
  account: Yup.string().required('Campo obrigatório'),
  bank: Yup.string()
    .required('Campo obrigatório')
    .test('isNull', 'Campo obrigatório', (value) => {
      return value !== '0';
    })
});

export default ContractSchema;
