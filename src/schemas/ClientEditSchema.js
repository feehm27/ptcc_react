import * as Yup from 'yup';
import { cpf } from 'cpf-cnpj-validator';

const ClientEditSchema = Yup.object().shape({
  name: Yup.string().required('Campo obrigatório'),
  email: Yup.string()
    .email('Informe um email válido')
    .max(255)
    .required('Campo obrigatório'),
  cpf: Yup.string()
    .required('Campo obrigatório')
    .test('len', 'CPF inválido', (value) => {
      if (value) {
        const cpfUnmask = value.replace(/[^\d]/g, '');
        return cpf.isValid(cpfUnmask);
      }
      return true;
    }),
  rg: Yup.string().required('Campo obrigatório'),
  issuing_organ: Yup.string().required('Campo obrigatório'),
  birthday: Yup.date().nullable().required('Campo obrigatório'),
  nationality: Yup.string().required('Campo obrigatório'),
  gender: Yup.string()
    .required('Campo obrigatório')
    .test('isNull', 'Campo obrigatório', (value) => {
      return value !== '0';
    }),
  civil_status: Yup.string()
    .required('Campo obrigatório')
    .test('isNull', 'Campo obrigatório', (value) => {
      return value !== '0';
    }),
  telephone: Yup.string()
    .nullable()
    .test('len', 'Telefone inválido', (value) => {
      if (value) {
        const lengthValue = value.replace(/[^\d]/g, '').length;
        return lengthValue === 10;
      }
      return true;
    }),
  cellphone: Yup.string()
    .required('Campo obrigatório')
    .test('len', 'Celular inválido', (value) => {
      if (value) {
        const lengthValue = value.replace(/[^\d]/g, '').length;
        return lengthValue === 11;
      }
      return true;
    }),
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
  city: Yup.string().required('Campo obrigatório')
});

export default ClientEditSchema;
