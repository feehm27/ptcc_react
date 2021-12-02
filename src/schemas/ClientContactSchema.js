import * as Yup from 'yup';

const ClientContactSchema = Yup.object().shape({
  subject: Yup.string().required('Campo obrigatório'),
  message: Yup.string().required('Campo obrigatório')
});

export default ClientContactSchema;
