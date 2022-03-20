import * as Yup from 'yup';

const ClientAnswerSchema = Yup.object().shape({
  answer: Yup.string().required('Campo obrigatório')
});

export default ClientAnswerSchema;
