import * as Yup from 'yup';
import { cpf } from 'cpf-cnpj-validator';

const ContractAdvocateSchema = Yup.object().shape({
  advocate_name: Yup.string().required('Campo obrigatório'),
  advocate_cpf: Yup.string()
    .required('Campo obrigatório')
    .test('len', 'CPF inválido', (value) => {
      if (value) {
        const cpfUnmask = value.replace(/[^\d]/g, '');
        return cpf.isValid(cpfUnmask);
      }
      return true;
    }),
  advocate_nationality: Yup.string().required('Campo obrigatório'),
  advocate_civil_status: Yup.string()
    .required('Campo obrigatório')
    .test('isNull', 'Campo obrigatório', (value) => {
      return value !== '0';
    }),
  advocate_register_oab: Yup.string()
    .required('Campo obrigatório')
    .max(8, 'Máximo de 8 caracteres'),
  advocate_email: Yup.string()
    .email('Informe um email válido')
    .max(255)
    .required('Campo obrigatório'),
  advocate_cep: Yup.string()
    .required('Campo obrigatório')
    .test('len', 'CEP inválido', (value) => {
      if (value) {
        const lengthValue = value.replace(/[^\d]/g, '').length;
        return lengthValue === 8;
      }
      return true;
    }),
  advocate_street: Yup.string().required('Campo obrigatório'),
  advocate_number: Yup.string().required('Campo obrigatório'),
  advocate_complement: Yup.string().nullable(),
  advocate_district: Yup.string().required('Campo obrigatório'),
  advocate_state: Yup.string().required('Campo obrigatório'),
  advocate_city: Yup.string().required('Campo obrigatório'),
  advocate_agency: Yup.string()
    .nullable()
    .test('len', 'Informe no mínimo 4 caracteres', (value) => {
      if (value) {
        const lengthValue = value.replace(/[^\d]/g, '').length;
        return lengthValue === 4 || lengthValue === 0;
      }
      return true;
    }),
  advocate_account: Yup.string()
    .nullable()
    .test('len', 'Informe no mínimo 9 caracteres', (value) => {
      if (value) {
        const lengthValue = value.replace(/[^\d]/g, '').length;
        return lengthValue === 9 || lengthValue === 0;
      }
      return true;
    }),
  advocate_bank: Yup.string().nullable()
});

export default ContractAdvocateSchema;
