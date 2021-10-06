import * as Yup from 'yup';

const IdentitySchema = Yup.object().shape({
  file: Yup.mixed()
    .test('fileSize', 'Tamanho inválido', (value) => value.size <= 2000)
    .test('fileType', 'Unsupported File Format', (value) => {
      ['image/pdf', 'image/txt', 'image/gif'].includes(value.type);
    })
});

export default IdentitySchema;
