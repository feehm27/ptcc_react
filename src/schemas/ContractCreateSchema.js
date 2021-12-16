import * as Yup from 'yup';
import { cpf } from 'cpf-cnpj-validator';

const ContractCreateSchema = Yup.object().shape({
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
  advocate_register_oab: Yup.string().required('Campo obrigatório'),
  advocate_email: Yup.string()
    .email('Informe um email válido')
    .max(255)
    .required('Campo obrigatório')
});

export default ContractCreateSchema;
