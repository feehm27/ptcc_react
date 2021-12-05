import * as Yup from 'yup';

const AdvocateAnswerSchema = Yup.object().shape({
  answer: Yup.string().required('Campo obrigatório')
});

export default AdvocateAnswerSchema;
