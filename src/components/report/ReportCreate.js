import DateFnsUtils from '@date-io/date-fns';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Stack,
  TextField
} from '@material-ui/core';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';
import { ptBR } from 'date-fns/locale';
import { Formik } from 'formik';
import moment from 'moment';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import CivilStatusConstants from 'src/constants/CivilStatusConstants';
import ExportFormatsConstants from 'src/constants/ExportFormatsConstants';
import GenderConstants from 'src/constants/GenderConstants';
import PaymentConstants from 'src/constants/PaymentConstants';
import ProcessConstantes from 'src/constants/ProcessConstantes';
import ReportTypesConstants from 'src/constants/ReportTypesConstants';
import ReportSchema from 'src/schemas/ReportSchema';
import { API } from 'src/services/api';
import ToastAnimated, { showToast } from '../Toast';

const ReportCreate = () => {
  const navigate = useNavigate();

  const [reportTypeSelected, setReportTypeSelected] = useState();
  const [birthdayDate, handleBirthdayChange] = useState(null);
  const [registrationDate, handleRegistrationChange] = useState(null);

  const [contractStartDate, handleContractStartChange] = useState(null);
  const [contractEndDate, handleContractEndChange] = useState(null);
  const [contractCancellationDate, handleCancellationChange] = useState(null);

  const [processStartDate, handleProcessStartChange] = useState(null);
  const [processEndDate, handleProcessEndChange] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const showSuccess = useRef(false);
  const showError = useRef(false);

  /**
   * Retorna para a página anterior
   */
  const callTimeOut = () => {
    setTimeout(() => {
      navigate('/reports');
    }, 1500);
  };

  /**
   * Salva o relatório
   * @param {*} values
   * @returns
   */
  async function sendReport(values) {
    const config = {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
      }
    };

    const params = {
      name: values.name,
      export_format: values.export_format,
      type: values.report_type
    };

    return new Promise((resolve, reject) => {
      API.post('advocates/reports', params, config)
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  /**
   * Salva os filtros do relatório com base no tipo
   * @param {} values
   * @returns
   */
  async function sendReportFilters(params, type, reportName) {
    const config = {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
      }
    };

    await API.post(`advocates/reports/${type}`, params, config)
      .then((response) => {
        if (response.data.data.link_report) {
          const req = new XMLHttpRequest();
          req.open('GET', response.data.data.link_report, true);
          req.setRequestHeader('Access-Control-Allow-Origin', '*');
          req.responseType = 'blob';
          req.onload = function teste() {
            const blob = req.response;
            const fileName = `${reportName}-${moment().format(
              'DD-MM-YYYY hh:mm:ss'
            )}`;
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
          };

          req.send();
          showSuccess.current = true;
        }
      })
      .catch((e) => {
        console.error(e);
        showError.current = true;
      });
    setSubmitting(false);
  }

  /**
   * Monta os parametros do relatório
   * @param {*} values
   * @param {*} reportId
   */
  const assembleReport = (values, reportId) => {
    const params = {};

    params.report_id = reportId;

    switch (values.report_type) {
      case 'Clientes': {
        let hasErrorClient = false;

        if (registrationDate !== null) {
          const formatDate = moment(registrationDate).format('YYYY-MM-DD');
          if (formatDate === 'Invalid date') {
            setError({
              registration_date: ['Data inválida']
            });
            hasErrorClient = true;
          }
          params.registration_date = formatDate;
        }

        if (birthdayDate !== null) {
          const formatDate = moment(birthdayDate).format('YYYY-MM-DD');
          if (formatDate === 'Invalid date') {
            setError({
              birthday: ['Data inválida']
            });
            hasErrorClient = true;
          }
          params.birthday = formatDate;
        }

        if (values.gender !== '0') {
          params.gender = values.gender;
        }

        if (values.civil_status !== '0') {
          params.civil_status = values.civil_status;
        }

        if (!hasErrorClient) sendReportFilters(params, 'clients', values.name);

        break;
      }

      case 'Contratos': {
        let hasErrorContract = false;

        if (contractStartDate !== null) {
          const formatDate = moment(contractStartDate).format('YYYY-MM-DD');
          if (formatDate === 'Invalid date') {
            setError({
              contract_start_date: ['Data inválida']
            });
            hasErrorContract = true;
          }
          params.start_date = formatDate;
        }

        if (contractEndDate !== null) {
          const formatDate = moment(contractEndDate).format('YYYY-MM-DD');
          if (formatDate === 'Invalid date') {
            setError({
              contract_end_date: ['Data inválida']
            });
            hasErrorContract = true;
          }
          params.finish_date = formatDate;
        }

        if (contractCancellationDate !== null) {
          const formatDate = moment(contractCancellationDate).format(
            'YYYY-MM-DD'
          );
          if (formatDate === 'Invalid date') {
            setError({
              contract_cancellation_date: ['Data inválida']
            });
            hasErrorContract = true;
          }

          params.canceled_at = formatDate;
        }

        if (values.status !== '0') {
          params.status = values.status;
        }

        if (values.payday !== '0') {
          params.payment_day = values.payday;
        }

        if (!hasErrorContract) {
          sendReportFilters(params, 'contracts', values.name);
        }

        break;
      }

      case 'Processos': {
        let hasErrorProcess = false;

        if (processStartDate !== null) {
          const formatDate = moment(processStartDate).format('YYYY-MM-DD');
          if (formatDate === 'Invalid date') {
            setError({
              process_start_date: ['Data inválida']
            });
            hasErrorProcess = true;
          }
          params.start_date = formatDate;
        }

        if (processEndDate !== null) {
          const formatDate = moment(processEndDate).format('YYYY-MM-DD');
          if (formatDate === 'Invalid date') {
            setError({
              process_end_date: ['Data inválida']
            });
            hasErrorProcess = true;
          }
          params.end_date = formatDate;
        }

        if (values.stage !== '0') {
          params.status = values.stage;
        }

        if (!hasErrorProcess) {
          sendReportFilters(params, 'processes', values.name);
        }

        break;
      }

      default: {
        break;
      }
    }
  };

  const handleSubmit = (values, errors) => {
    setSubmitting(true);

    sendReport(values).then((response) => {
      assembleReport(values, response.data.data.id);
    });

    console.log(errors);
  };

  return (
    <Formik
      initialValues={{
        report_type: '0',
        name: '',
        export_format: 'Paisagem',
        birthday: null,
        registration_date: '',
        gender: '0',
        civil_status: '0',
        contract_start_date: null,
        contract_end_date: null,
        contract_cancellation_date: null,
        status: '0',
        payday: '0',
        process_start_date: null,
        process_end_date: null,
        stage: '0'
      }}
      validationSchema={ReportSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, values, handleChange, handleBlur, submitForm }) => (
        <form
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(values, errors);
          }}
        >
          <Card sx={{ m: 3 }}>
            <CardHeader title="Dados do relatório" />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6} xs={6}>
                  <TextField
                    error={errors.report_type}
                    fullWidth
                    helperText={errors.report_type}
                    label="Selecione o tipo de relatório"
                    name="report_type"
                    onBlur={(event) => {
                      handleBlur(event);
                      showSuccess.current = false;
                      showError.current = false;
                    }}
                    onChange={(event) => {
                      handleChange(event);
                      setReportTypeSelected(event.target.value);
                      showSuccess.current = false;
                      showError.current = false;
                    }}
                    required
                    select
                    SelectProps={{ native: true }}
                    value={values.report_type}
                    variant="outlined"
                  >
                    {ReportTypesConstants.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                </Grid>
                <Grid item md={6} xs={6}>
                  <TextField
                    error={errors.name}
                    fullWidth
                    helperText={errors.name}
                    label="Nome do relatório"
                    name="name"
                    onBlur={(event) => {
                      handleBlur(event);
                      showSuccess.current = false;
                      showError.current = false;
                    }}
                    onChange={(event) => {
                      handleChange(event);
                      showSuccess.current = false;
                      showError.current = false;
                    }}
                    required
                    value={values.name}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={6}>
                  <TextField
                    error={errors.export_format}
                    fullWidth
                    helperText={errors.export_format}
                    label="Formato da exportação"
                    name="export_format"
                    onBlur={(event) => {
                      handleBlur(event);
                      showSuccess.current = false;
                      showError.current = false;
                    }}
                    onChange={(event) => {
                      handleChange(event);
                      showSuccess.current = false;
                      showError.current = false;
                    }}
                    required
                    select
                    SelectProps={{ native: true }}
                    value={values.export_format}
                    variant="outlined"
                  >
                    {ExportFormatsConstants.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          {reportTypeSelected === 'Clientes' && (
            <Card sx={{ m: 3 }}>
              <CardHeader title="Filtros (Opcionais)" />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={6} xs={6}>
                    <MuiPickersUtilsProvider locale={ptBR} utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        fullWidth
                        invalidDateMessage={
                          error && error.birthday ? error.birthday : ''
                        }
                        maxDateMessage="Data de nascimento não pode ser maior que a data atual"
                        disableFuture
                        format="dd/MM/yyyy"
                        label="Data de nascimento"
                        views={['year', 'month', 'date']}
                        value={birthdayDate}
                        onChange={(e) => {
                          handleBirthdayChange(e);
                          const date = moment(e);
                          if (date.isValid()) {
                            errors.birthday = '';
                            setError({ birthday: '' });
                          } else {
                            setError({
                              birthday: ['Data inválida']
                            });
                          }
                          showSuccess.current = false;
                          showError.current = false;
                        }}
                        onBlur={(e) => {
                          showSuccess.current = false;
                          showError.current = false;
                          handleBlur(e);
                        }}
                        name="birthday"
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid item md={6} xs={6}>
                    <MuiPickersUtilsProvider locale={ptBR} utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        fullWidth
                        invalidDateMessage={
                          error && error.registration_date
                            ? error.registration_date
                            : ''
                        }
                        maxDateMessage="Data de cadastro não pode ser maior que a data atual"
                        disableFuture
                        openTo="year"
                        format="dd/MM/yyyy"
                        label="Data de cadastro"
                        views={['year', 'month', 'date']}
                        value={registrationDate}
                        onChange={(e) => {
                          handleRegistrationChange(e);
                          const date = moment(e);
                          if (date.isValid()) {
                            errors.registration_date = '';
                            setError({ registration_date: '' });
                          } else {
                            setError({
                              registration_date: ['Data inválida']
                            });
                          }
                          showSuccess.current = false;
                          showError.current = false;
                        }}
                        onBlur={(e) => {
                          showSuccess.current = false;
                          showError.current = false;
                          handleBlur(e);
                        }}
                        name="registration_date"
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      error={errors.gender}
                      fullWidth
                      helperText={errors.gender}
                      label="Gênero"
                      name="gender"
                      onBlur={(event) => {
                        handleBlur(event);
                        showSuccess.current = false;
                        showError.current = false;
                      }}
                      onChange={(event) => {
                        handleChange(event);
                        showSuccess.current = false;
                        showError.current = false;
                      }}
                      select
                      SelectProps={{ native: true }}
                      value={values.gender}
                      variant="outlined"
                    >
                      {GenderConstants.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      error={errors.civil_status}
                      fullWidth
                      helperText={errors.civil_status}
                      label="Estado Civil"
                      name="civil_status"
                      onBlur={(event) => {
                        handleBlur(event);
                        showSuccess.current = false;
                        showError.current = false;
                      }}
                      onChange={(event) => {
                        handleChange(event);
                        showSuccess.current = false;
                        showError.current = false;
                      }}
                      required
                      select
                      SelectProps={{ native: true }}
                      value={values.civil_status}
                      variant="outlined"
                    >
                      {CivilStatusConstants.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
          {reportTypeSelected === 'Contratos' && (
            <Card sx={{ m: 3 }}>
              <CardHeader title="Filtros (Opcionais)" />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={6} xs={6}>
                    <MuiPickersUtilsProvider locale={ptBR} utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        fullWidth
                        invalidDateMessage={
                          error && error.contract_start_date
                            ? error.contract_start_date
                            : ''
                        }
                        openTo="year"
                        format="dd/MM/yyyy"
                        label="Data de inicio"
                        views={['year', 'month', 'date']}
                        value={contractStartDate}
                        onChange={(e) => {
                          handleContractStartChange(e);
                          const date = moment(e);
                          if (date.isValid()) {
                            errors.contract_start_date = '';
                            setError({ contract_start_date: '' });
                          } else {
                            setError({
                              contract_start_date: ['Data inválida']
                            });
                          }
                          showSuccess.current = false;
                          showError.current = false;
                        }}
                        onBlur={(e) => {
                          showSuccess.current = false;
                          showError.current = false;
                          handleBlur(e);
                        }}
                        name="contract_start_date"
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid item md={6} xs={6}>
                    <MuiPickersUtilsProvider locale={ptBR} utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        fullWidth
                        invalidDateMessage={
                          error && error.contract_start_date
                            ? error.contract_start_date
                            : ''
                        }
                        openTo="year"
                        format="dd/MM/yyyy"
                        label="Data de encerramento"
                        views={['year', 'month', 'date']}
                        value={contractEndDate}
                        onChange={(e) => {
                          handleContractEndChange(e);
                          const date = moment(e);
                          if (date.isValid()) {
                            errors.contract_end_date = '';
                            setError({ contract_end_date: '' });
                          } else {
                            setError({
                              contract_end_date: ['Data inválida']
                            });
                          }
                          showSuccess.current = false;
                          showError.current = false;
                        }}
                        onBlur={(e) => {
                          showSuccess.current = false;
                          showError.current = false;
                          handleBlur(e);
                        }}
                        name="contract_end_date"
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid item md={6} xs={6}>
                    <MuiPickersUtilsProvider locale={ptBR} utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        invalidDateMessage={
                          error && error.contract_cancellation_date
                            ? error.contract_cancellation_date
                            : ''
                        }
                        fullWidth
                        openTo="year"
                        format="dd/MM/yyyy"
                        label="Data de cancelamento"
                        views={['year', 'month', 'date']}
                        value={contractCancellationDate}
                        onChange={(e) => {
                          handleCancellationChange(e);
                          const date = moment(e);
                          if (date.isValid()) {
                            errors.contract_cancellation_date = '';
                            setError({ contract_cancellation_date: '' });
                          } else {
                            setError({
                              contract_cancellation_date: ['Data inválida']
                            });
                          }
                          showSuccess.current = false;
                          showError.current = false;
                        }}
                        onBlur={(e) => {
                          showSuccess.current = false;
                          showError.current = false;
                          handleBlur(e);
                        }}
                        name="contract_cancellation_date"
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      error={errors.status}
                      fullWidth
                      helperText={errors.status}
                      label="Status do contrato"
                      name="status"
                      onBlur={(event) => {
                        handleBlur(event);
                        showSuccess.current = false;
                        showError.current = false;
                      }}
                      onChange={(event) => {
                        handleChange(event);
                        showSuccess.current = false;
                        showError.current = false;
                      }}
                      select
                      SelectProps={{ native: true }}
                      value={values.status}
                      variant="outlined"
                    >
                      <option key="0" value="0">
                        Selecione uma opção
                      </option>
                      <option key="Ativo" value="Ativo">
                        Ativo
                      </option>
                      <option key="Inativo" value="Inativo">
                        Inativo
                      </option>
                      <option key="Cancelado" value="Cancelado">
                        Cancelado
                      </option>
                    </TextField>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      error={errors.payday}
                      fullWidth
                      helperText={errors.payday}
                      label="Dia de pagamento"
                      name="payday"
                      onBlur={(event) => {
                        handleBlur(event);
                        showSuccess.current = false;
                        showError.current = false;
                      }}
                      onChange={(event) => {
                        handleChange(event);
                        showSuccess.current = false;
                        showError.current = false;
                      }}
                      select
                      SelectProps={{ native: true }}
                      value={values.payday}
                      variant="outlined"
                    >
                      {PaymentConstants.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}
          {reportTypeSelected === 'Processos' && (
            <Card sx={{ m: 3 }}>
              <CardHeader title="Filtros (Opcionais)" />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={6} xs={6}>
                    <MuiPickersUtilsProvider locale={ptBR} utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        invalidDateMessage={
                          error && error.process_start_date
                            ? error.process_start_date
                            : ''
                        }
                        fullWidth
                        openTo="year"
                        format="dd/MM/yyyy"
                        label="Data de inicio"
                        views={['year', 'month', 'date']}
                        value={processStartDate}
                        onChange={(e) => {
                          handleProcessStartChange(e);
                          const date = moment(e);
                          if (date.isValid()) {
                            errors.process_start_date = '';
                            setError({ process_start_date: '' });
                          } else {
                            setError({
                              process_start_date: ['Data inválida']
                            });
                          }
                          showSuccess.current = false;
                          showError.current = false;
                        }}
                        onBlur={(e) => {
                          showSuccess.current = false;
                          showError.current = false;
                          handleBlur(e);
                        }}
                        name="process_start_date"
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid item md={6} xs={6}>
                    <MuiPickersUtilsProvider locale={ptBR} utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        invalidDateMessage={
                          error && error.process_end_date
                            ? error.process_end_date
                            : ''
                        }
                        fullWidth
                        openTo="year"
                        format="dd/MM/yyyy"
                        label="Data de encerramento"
                        views={['year', 'month', 'date']}
                        value={processEndDate}
                        onChange={(e) => {
                          handleProcessEndChange(e);
                          const date = moment(e);
                          if (date.isValid()) {
                            errors.process_end_date = '';
                            setError({ process_end_date: '' });
                          } else {
                            setError({
                              process_end_date: ['Data inválida']
                            });
                          }
                          showSuccess.current = false;
                          showError.current = false;
                        }}
                        onBlur={(e) => {
                          showSuccess.current = false;
                          showError.current = false;
                          handleBlur(e);
                        }}
                        name="process_end_date"
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      error={errors.stage}
                      fullWidth
                      helperText={errors.stage}
                      label="Etapa"
                      name="stage"
                      onBlur={(event) => {
                        handleBlur(event);
                        showSuccess.current = false;
                        showError.current = false;
                      }}
                      onChange={(event) => {
                        handleChange(event);
                        showSuccess.current = false;
                        showError.current = false;
                      }}
                      select
                      SelectProps={{ native: true }}
                      value={values.stage}
                      variant="outlined"
                    >
                      {ProcessConstantes.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          {reportTypeSelected !== undefined && reportTypeSelected !== '0' && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                p: 2
              }}
            >
              <Stack direction="row" spacing={2}>
                <Button
                  color="primary"
                  variant="outlined"
                  onClick={() => navigate('/reports')}
                >
                  Voltar
                </Button>
                {submitting ? (
                  <Button color="primary" variant="contained" disabled>
                    Carregando..
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    variant="contained"
                    type="submit"
                    onClick={submitForm}
                  >
                    Salvar e Exportar
                  </Button>
                )}
              </Stack>
            </Box>
          )}
          {showSuccess.current && (
            <>
              <ToastAnimated />
              {showToast({
                type: 'success',
                message: 'Relatório exportado com sucesso!'
              })}
              {callTimeOut()}
            </>
          )}
          {showError.current && (
            <>
              <ToastAnimated />
              {showToast({
                type: 'error',
                message:
                  'Algo de inesperado aconteceu. Tente novamente mais tarde!'
              })}
            </>
          )}
        </form>
      )}
    </Formik>
  );
};

export default ReportCreate;
