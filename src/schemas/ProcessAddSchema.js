import * as Yup from 'yup';

const ProcessAddSchema = Yup.object().shape({
  modification_date: Yup.date().nullable().required('Campo obrigatório'),
  status_process: Yup.string()
    .required('Campo obrigatório')
    .test('isNull', 'Campo obrigatório', (value) => {
      return value !== '0';
    }),
  modification_description: Yup.string()
    .required('Campo obrigatório')
});

export default ProcessAddSchema;
