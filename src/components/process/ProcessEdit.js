import DateFnsUtils from '@date-io/date-fns';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  Stack,
  TextField,
  Tooltip,
  Typography
} from '@material-ui/core';
import { Link } from '@material-ui/icons';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';
import { ptBR } from 'date-fns/locale';
import { Formik } from 'formik';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import ReactInputMask from 'react-input-mask';
import { useLocation, useNavigate } from 'react-router';
import ProcessConstantes from 'src/constants/ProcessConstantes';
import ProcessEditSchema from 'src/schemas/ProcessEditSchema';
import { API } from 'src/services/api';
import ToastAnimated, { showToast } from '../Toast';

const ProcessCreate = () => {
  const { process } = useLocation().state;
  const navigate = useNavigate();

  const [checked, setChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showAttachment, setShowAttachment] = useState(false);

  const showSuccess = useRef(false);
  const showError = useRef(false);

  const [selectedDate, handleDateChange] = useState(null);
  const [selectedEndDate, handleEndDateChange] = useState(null);

  const handleChangeChecked = (event) => {
    setChecked(event.target.checked);
  };
  /**
   * Envia os dados do advogado
   * @param {*} values
   */
  async function updateProcess(values) {
    setSubmitting(true);

    const config = {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
      }
    };

    values.start_date = moment(selectedDate).format('YYYY-MM-DD');
    values.client_id = process.client.id;

    if (selectedEndDate === null) {
      delete values.end_date;
    } else {
      values.end_date = moment(selectedEndDate).format('YYYY-MM-DD');
    }

    const formData = new FormData();

    if (values.file && checked) {
      formData.append('file', values.file);
    }
    delete values.file;

    const newValues = JSON.stringify(values);
    formData.append('values', newValues);

    await API.post(`advocates/processes/${process.id}`, formData, config)
      .then(() => {
        showSuccess.current = true;
      })
      .catch((err) => {
        console.error(err);
        showError.current = true;
      });

    setSubmitting(false);
  }

  /**
   * Envia os dados do formulário
   * @param {*} values
   */
  const handleSubmit = (values, errors) => {
    if (!checked) {
      delete errors.file;
    }
    if (values.start_date !== 'Invalid Date') {
      delete errors.start_date;
    }
    if (values.end_date !== 'Invalid Date') {
      delete errors.end_date;
    }

    console.log('errors', errors);
    console.log('values', values);

    if (isEmpty(errors)) updateProcess(values);
  };

  /**
   * Use Effect
   */
  useEffect(() => {
    const startDate = new Date(process.start_date);
    startDate.setDate(startDate.getDate() + 1);
    handleDateChange(startDate);

    const endDate = new Date(process.end_date);
    endDate.setDate(endDate.getDate() + 1);
    handleEndDateChange(endDate);
  }, []);

  return (
    <>
      <Formik
        initialValues={{
          number: process.number || '',
          labor_stick: process.labor_stick || '',
          petition: process.petition || '',
          status: process.status || '',
          file: process.file || '',
          start_date: '',
          end_date: '',
          observations: process.observations || ''
        }}
        validationSchema={ProcessEditSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, values, handleBlur, handleChange, submitForm }) => (
          <form
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault();
              showSuccess.current = false;
              showError.current = false;
              handleSubmit(values, errors);
            }}
          >
            <Card>
              <CardHeader title="Dados do processo" />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={6} xs={12}>
                    <ReactInputMask
                      mask="9999999-99.9999.9.99.9999"
                      value={values.number}
                      onChange={(event) => {
                        handleChange(event);
                        showSuccess.current = false;
                        showError.current = false;
                      }}
                      disabled
                    >
                      {() => (
                        <TextField
                          error={errors.number}
                          fullWidth
                          helperText={errors.number}
                          label="Número do processo"
                          name="number"
                          required
                          variant="outlined"
                          maxLength="25"
                          disabled
                        />
                      )}
                    </ReactInputMask>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      error={errors.labor_stick}
                      fullWidth
                      helperText={errors.labor_stick}
                      label="Vara Trabalhista"
                      name="labor_stick"
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
                      value={values.labor_stick}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      error={errors.petition}
                      fullWidth
                      helperText={errors.petition}
                      label="Petição/Assunto"
                      name="petition"
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
                      value={values.petition}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      error={errors.status}
                      fullWidth
                      helperText={errors.status}
                      label="Etapa do processo"
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
                      required
                      select
                      SelectProps={{ native: true }}
                      value={values.status}
                      variant="outlined"
                    >
                      {ProcessConstantes.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <MuiPickersUtilsProvider locale={ptBR} utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        fullWidth
                        openTo="year"
                        invalidDateMessage="Data inválida"
                        format="dd/MM/yyyy"
                        label="Data de inicio"
                        views={['year', 'month', 'date']}
                        value={selectedDate}
                        inputVariant="outlined"
                        onChange={(e) => {
                          showSuccess.current = false;
                          showError.current = false;
                          handleDateChange(e);
                        }}
                        onBlur={(e) => {
                          showSuccess.current = false;
                          showError.current = false;
                          handleBlur(e);
                        }}
                        name="start_date"
                        required
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <MuiPickersUtilsProvider locale={ptBR} utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        fullWidth
                        invalidDateMessage="Data inválida"
                        openTo="year"
                        format="dd/MM/yyyy"
                        label="Data de encerramento"
                        minDateMessage="Data não pode ser menor que a data de inicio"
                        views={['year', 'month', 'date']}
                        value={selectedEndDate}
                        inputVariant="outlined"
                        onChange={(e) => {
                          showSuccess.current = false;
                          showError.current = false;
                          handleEndDateChange(e);
                        }}
                        onBlur={(e) => {
                          showSuccess.current = false;
                          showError.current = false;
                          handleBlur(e);
                        }}
                        name="end_date"
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>

                  <Grid item md={6} xs={6}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checked}
                          name="alter_file"
                          color="primary"
                          onChange={(e) => {
                            showSuccess.current = false;
                            showError.current = false;
                            setShowAttachment(!showAttachment);
                            handleChangeChecked(e);
                          }}
                        />
                      }
                      label="Alterar processo anexado"
                    />
                  </Grid>
                  {showAttachment && (
                    <Grid item md={6} xs={6}>
                      <Typography variant="h5">Anexar processo *</Typography>
                      <input
                        required
                        accept="application/pdf"
                        id="icon-button-file"
                        type="file"
                        onChange={(e) => {
                          showSuccess.current = false;
                          showError.current = false;
                          const file = e.target.files[0];
                          values.file = file;
                          handleChange(e);
                        }}
                        style={{ marginTop: '15px' }}
                      />
                      {errors && errors.file && (
                        <Typography
                          variant="h6"
                          style={{
                            marginTop: '15px',
                            fontWeight: 400,
                            fontSize: '0.75rem'
                          }}
                          color="#f44336"
                        >
                          {errors.file}
                        </Typography>
                      )}
                    </Grid>
                  )}

                  <Grid item md={12} xs={12}>
                    <TextField
                      error={errors.observations}
                      fullWidth
                      helperText={errors.observations}
                      label="Observações"
                      rows="6"
                      multiline
                      rowsMax={Infinity}
                      onBlur={(event) => {
                        handleBlur(event);
                      }}
                      onChange={(event) => {
                        showSuccess.current = false;
                        showError.current = false;
                        handleChange(event);
                      }}
                      name="observations"
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Typography variant="h5">
                      Cliente vinculado: {process.client.name}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    md={12}
                    xs={12}
                    style={{
                      display: 'flex',
                      alignItems: 'left',
                      justifyContent: 'left'
                    }}
                  >
                    <Typography variant="h5">
                      Baixar Processo Cadastrado: &nbsp;
                    </Typography>
                    <Tooltip title="Baixar Processo">
                      <a
                        target="webapp-tab"
                        href={process.file}
                        download={process.file}
                        cursor="pointer"
                      >
                        <Link></Link>
                      </a>
                    </Tooltip>
                  </Grid>
                </Grid>
              </CardContent>
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
                    onClick={() => navigate('/processes')}
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
                      Salvar
                    </Button>
                  )}
                </Stack>
              </Box>
            </Card>
            {showSuccess.current && (
              <>
                <ToastAnimated />
                {showToast({
                  type: 'success',
                  message: 'Processo alterado com sucesso!'
                })}
              </>
            )}
            {showError.current && (
              <>
                <ToastAnimated />
                {showToast({
                  type: 'error',
                  message: 'Algo de inesperado aconteceu!'
                })}
              </>
            )}
          </form>
        )}
      </Formik>
    </>
  );
};

export default ProcessCreate;
