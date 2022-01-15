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
  TextField,
  Typography
} from '@material-ui/core';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';
import { ptBR } from 'date-fns/locale';
import { Formik } from 'formik';
import { isEmpty } from 'lodash';
import { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import ProcessConstantes from 'src/constants/ProcessConstantes';
import { API } from 'src/services/api';
import ToastAnimated, { showToast } from '../Toast';

const ProcessCreate = () => {
  const { client } = useLocation().state;
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);

  const showSuccess = useRef(false);
  const showError = useRef(false);

  const [selectedDate, handleDateChange] = useState(null);

  /**
   * Envia os dados do advogado
   * @param {*} values
   */
  async function sendProcess(values) {
    setSubmitting(true);

    const config = {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
      }
    };

    await API.post('advocates/processes', values, config)
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
    if (isEmpty(errors)) sendProcess(values);
  };

  return (
    <>
      <Formik
        initialValues={{
          number: '',
          labor_stick: '',
          petition: '',
          status: '',
          file: '',
          start_date: '',
          observations: ''
        }}
        validationSchema={() => {
          console.log('sem validação');
        }}
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
                    <TextField
                      error={errors.number}
                      fullWidth
                      helperText={errors.number}
                      label="Número do processo"
                      name="number"
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
                      value={values.number}
                      required
                      variant="outlined"
                    />
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
                        invalidDateMessage={errors.start_date}
                        openTo="year"
                        format="dd/MM/yyyy"
                        label="Data de inicio"
                        views={['year', 'month', 'date']}
                        value={selectedDate}
                        disablePast={true}
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
                    <Typography variant="h5">Anexar processo *</Typography>
                    <input
                      accept="image/png, image/jpeg, image/jpg"
                      id="icon-button-file"
                      type="file"
                      onChange={() => {
                        showSuccess.current = false;
                        showError.current = false;
                      }}
                      style={{ marginTop: '15px' }}
                    />
                  </Grid>
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
                        handleChange(event);
                      }}
                      name="observations"
                      required
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <Typography variant="h5">
                      Cliente vinculado: {client.name}
                    </Typography>
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
                    onClick={() => navigate('/contracts')}
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
                  message: 'Processo criado com sucesso!'
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
