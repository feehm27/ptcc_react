import * as Yup from 'yup';

const ScheduleSchema = Yup.object().shape({
  research_month: Yup.date().nullable().required('Campo obrigatório')
});

export default ScheduleSchema;
