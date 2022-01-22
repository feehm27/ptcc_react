import * as Yup from 'yup';

const ProcessSchema = Yup.object().shape({
  number: Yup.string()
    .required('Campo obrigatório')
    .test('len', 'Campo inválido', (value) => {
      if (value) {
        const lengthValue = value.replace(/[^\d]/g, '').length;
        return lengthValue === 20;
      }
      return true;
    }),
  labor_stick: Yup.string()
    .max(200, 'Máximo 200 caracteres')
    .required('Campo obrigatório'),
  petition: Yup.string()
    .max(200, 'Máximo 200 caracteres')
    .required('Campo obrigatório'),
  status: Yup.string()
    .required('Campo obrigatório')
    .test('isNull', 'Campo obrigatório', (value) => {
      return value !== '0';
    }),
  file: Yup.mixed()
    .nullable()
    .required('Campo obrigatório')
    .test(
      'upload_file',
      'Tamanho máximo permitido é de 20MB',
      (value) => !value || (value && value.size <= 20000)
    )
    .test(
      'upload_format',
      'Formato do arquivo inválido. Formato válido: PDF',
      (value) => !value || (value && value.type !== 'application/pdf')
    ),
  start_date: Yup.date().nullable().required('Campo obrigatório'),
  end_date: Yup.date().nullable(),
  observations: Yup.string()
});

export default ProcessSchema;
