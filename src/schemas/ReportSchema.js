import * as Yup from 'yup';

const ReportSchema = Yup.object().shape({
  name: Yup.string()
    .max(200, 'Máximo 200 caracteres')
    .required('Campo obrigatório'),
  report_type: Yup.string()
    .max(50, 'Máximo 50 caracteres')
    .required('Campo obrigatório')
    .test('isNull', 'Campo obrigatório', (value) => {
      return value !== '0';
    }),
  birthday: Yup.date('Data inválida').nullable()
});

export default ReportSchema;
