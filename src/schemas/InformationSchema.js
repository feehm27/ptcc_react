import * as Yup from 'yup';
import { cpf } from 'cpf-cnpj-validator';

const InformationSchema = Yup.object().shape({
  name: Yup.string().required('Campo obrigatório'),
  cpf: Yup.string()
    .required('Campo obrigatório')
    .test('len', 'CPF inválido', (value) => {
      if (value) {
        const cpfUnmask = value.replace(/[^\d]/g, '');
        return cpf.isValid(cpfUnmask);
      }
      return true;
    }),
  nationality: Yup.string().required('Campo obrigatório'),
  civil_status: Yup.string()
    .required('Campo obrigatório')
    .test('isNull', 'Campo obrigatório', (value) => {
      return value !== '0';
    }),
  register_oab: Yup.string().required('Campo obrigatório'),
  email: Yup.string()
    .email('Informe um email válido')
    .max(255)
    .required('Campo obrigatório'),
  cep: Yup.string()
    .required('Campo obrigatório')
    .test('len', 'CEP inválido', (value) => {
      if (value) {
        const lengthValue = value.replace(/[^\d]/g, '').length;
        return lengthValue === 8;
      }
      return true;
    }),
  street: Yup.string().required('Campo obrigatório'),
  number: Yup.string().required('Campo obrigatório'),
  complement: Yup.string().nullable(),
  district: Yup.string().required('Campo obrigatório'),
  state: Yup.string().required('Campo obrigatório'),
  city: Yup.string().required('Campo obrigatório'),
  agency: Yup.string()
    .nullable()
    .test('len', 'Informe no mínimo 4 caracteres', (value) => {
      if (value) {
        const lengthValue = value.replace(/[^\d]/g, '').length;
        return lengthValue === 4 || lengthValue === 0;
      }
      return true;
    }),
  account: Yup.string()
    .nullable()
    .test('len', 'Informe no mínimo 6 caracteres', (value) => {
      if (value) {
        const lengthValue = value.replace(/[^\d]/g, '').length;
        return lengthValue === 6 || lengthValue === 0;
      }
      return true;
    }),
  bank: Yup.string().nullable()
});

export default InformationSchema;
