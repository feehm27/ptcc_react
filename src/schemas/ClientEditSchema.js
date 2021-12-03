import * as Yup from 'yup';
import { cpf } from 'cpf-cnpj-validator';

const ClientEditSchema = Yup.object().shape({
  name: Yup.string()
    .max(200, 'Máximo 200 caracteres')
    .required('Campo obrigatório'),
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
  rg: Yup.string()
    .max(10, 'Máximo 10 caracteres')
    .required('Campo obrigatório'),
  issuing_organ: Yup.string()
    .max(50, 'Máximo 50 caracteres')
    .required('Campo obrigatório'),
  birthday: Yup.date()
    .nullable()
    .transform((curr, orig) => (orig === '' ? null : curr))
    .required('Campo obrigatório'),
  nationality: Yup.string()
    .max(200, 'Máximo 200 caracteres')
    .required('Campo obrigatório'),
  gender: Yup.string()
    .max(50, 'Máximo 50 caracteres')
    .required('Campo obrigatório')
    .test('isNull', 'Campo obrigatório', (value) => {
      return value !== '0';
    }),
  civil_status: Yup.string()
    .max(50, 'Máximo 50 caracteres')
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
  street: Yup.string()
    .max(200, 'Máximo 200 caracteres')
    .required('Campo obrigatório'),
  number: Yup.string().required('Campo obrigatório'),
  complement: Yup.string().nullable(),
  district: Yup.string().required('Campo obrigatório'),
  state: Yup.string()
    .max(200, 'Máximo 200 caracteres')
    .required('Campo obrigatório'),
  city: Yup.string()
    .max(200, 'Máximo 200 caracteres')
    .required('Campo obrigatório')
});

export default ClientEditSchema;
