import DateFnsUtils from '@date-io/date-fns';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
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
import moment from 'moment';
import { useRef, useState } from 'react';
import ReactInputMask from 'react-input-mask';
import { useLocation, useNavigate } from 'react-router';
import BanksConstants from 'src/constants/BanksConstants';
import PaymentConstants from 'src/constants/PaymentConstants';
import ContractSchema from 'src/schemas/ContractSchema';
import { API } from 'src/services/api';
import ToastAnimated, { showToast } from '../Toast';

const ContractEdit = () => {
  const navigate = useNavigate();
  const { contract } = useLocation().state;

  const [error, setError] = useState(null);
  const [showCanceledModal, setShowCanceledModal] = useState(false);
  const [checked, setChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedStartDate, handleStartDateChange] = useState(
    contract.start_date
  );
  const [selectedEndDate, handleEndDateChange] = useState(contract.finish_date);
  const [disabled, setDisabled] = useState(false);

  const showSuccess = useRef(false);
  const showError = useRef(false);

  const showSuccessCancellation = useRef(false);
  const showErrorCancellation = useRef(false);

  const handleChangeChecked = (event, errors) => {
    setChecked(event.target.checked);

    if (event.target.checked) {
      delete errors.agency;
      delete errors.account;
      delete errors.bank;
    }
  };

  const handleClose = () => {
    setShowCanceledModal(false);
  };

  const formatAddressAdvocate = () => {
    return `${contract.advocate.street}, ${contract.advocate.number},${contract.advocate.district} - ${contract.advocate.city} - ${contract.advocate.state}`;
  };

  const formatAddressClient = () => {
    return `${contract.client.street}, ${contract.client.number}, ${contract.client.district} - ${contract.client.city} - ${contract.client.state}`;
  };

  /**
   * Cancela o contrato
   */
  async function canceledContract(contractId) {
    showSuccessCancellation.current = false;
    showErrorCancellation.current = false;

    const config = {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
      }
    };

    await API.put(
      'advocates/contracts/canceled',
      { contract_id: contractId },
      config
    )
      .then(() => {
        showSuccessCancellation.current = true;
        setDisabled(true);
      })
      .catch((err) => {
        showErrorCancellation.current = true;
        console.error(err);
      });
  }

  /**
   * Envia os dados do advogado
   * @param {*} values
   */
  async function updateContract(values) {
    setSubmitting(true);

    const config = {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
      }
    };

    values.start_date = moment(selectedStartDate).format('YYYY-MM-DD');
    values.finish_date = moment(selectedEndDate).format('YYYY-MM-DD');

    await API.put(`advocates/contracts/${contract.id}`, values, config)
      .then(() => {
        showSuccess.current = true;
      })
      .catch((err) => {
        console.error(err);
      });

    setSubmitting(false);
  }

  /**
   * Mascara em reais
   * @param {*} value
   * @returns
   */
  const maskReais = (value) => {
    if (value !== undefined) {
      return (Number(value.replace(/\D/g, '')) / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
    }
    return value;
  };

  /**
   * Envia os dados do formulário
   * @param {*} values
   */
  const handleSubmit = (values, errors) => {
    if (values.start_date !== 'Invalid Date') {
      delete errors.start_date;
    }
    if (values.end_date !== 'Invalid Date') {
      delete errors.end_date;
    }
    if (isEmpty(errors)) updateContract(values);
  };

  return (
    <>
      <Card>
        <CardHeader title="Dados do cliente" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Nome completo"
                name="name"
                value={
                  contract.client && contract.client.name
                    ? contract.client.name
                    : ''
                }
                variant="outlined"
                disabled={true}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={
                  contract.client && contract.client.email
                    ? contract.client.email
                    : ''
                }
                variant="outlined"
                disabled={true}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <ReactInputMask
                mask="999.999.999-99"
                value={
                  contract.client && contract.client.cpf
                    ? contract.client.cpf
                    : ''
                }
                disabled={true}
              >
                {() => (
                  <TextField
                    label="CPF"
                    name="cpf"
                    fullWidth
                    variant="outlined"
                    maxLength="14"
                    disabled={true}
                  />
                )}
              </ReactInputMask>
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="RG"
                name="rg"
                value={
                  contract.client && contract.client.rg
                    ? contract.client.rg
                    : ''
                }
                variant="outlined"
                disabled={true}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <MuiPickersUtilsProvider locale={ptBR} utils={DateFnsUtils}>
                <KeyboardDatePicker
                  fullWidth
                  disableFuture
                  format="dd/MM/yyyy"
                  label="Data de nascimento"
                  views={['year', 'month', 'date']}
                  value={
                    contract.client && contract.client.birthday
                      ? contract.client.birthday
                      : ''
                  }
                  defaultValue={undefined}
                  name="birthday"
                  disabled={true}
                />
              </MuiPickersUtilsProvider>
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Nacionalidade"
                name="nationality"
                value={
                  contract.client && contract.client.nationality
                    ? contract.client.nationality
                    : ''
                }
                variant="outlined"
                disabled={true}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Gênero"
                name="gender"
                value={
                  contract.client && contract.client.gender
                    ? contract.client.gender
                    : ''
                }
                disabled={true}
              ></TextField>
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Estado Civil"
                name="civil_status"
                value={
                  contract.client && contract.client.civil_status
                    ? contract.client.civil_status
                    : ''
                }
                disabled={true}
              ></TextField>
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Endereço"
                name="address"
                value={formatAddressClient()}
                disabled={true}
              ></TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardHeader title="Dados do advogado" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <TextField
                label="Nome completo"
                fullWidth
                name="advocate_name"
                value={
                  contract.advocate && contract.advocate.name
                    ? contract.advocate.name
                    : ''
                }
                variant="outlined"
                disabled={true}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="advocate_email"
                value={
                  contract.advocate && contract.advocate.email
                    ? contract.advocate.email
                    : ''
                }
                variant="outlined"
                disabled={true}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <ReactInputMask
                mask="999.999.999-99"
                vavalue={
                  contract.advocate && contract.advocate.cpf
                    ? contract.advocate.cpf
                    : ''
                }
                disabled={true}
              >
                {() => (
                  <TextField
                    label="CPF"
                    name="advocate_cpf"
                    fullWidth
                    variant="outlined"
                    maxLength="14"
                    disabled={true}
                  />
                )}
              </ReactInputMask>
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Número da OAB"
                name="advocate_register_oab"
                value={
                  contract.advocate && contract.advocate.register_oab
                    ? contract.advocate.regiter_oab
                    : ''
                }
                variant="outlined"
                disabled={true}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Nacionalidade"
                name="advocate_nationality"
                value={
                  contract.advocate && contract.advocate.nationality
                    ? contract.advocate.nationality
                    : ''
                }
                variant="outlined"
                disabled={true}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Estado Civil"
                name="advocate_civil_status"
                value={
                  contract.advocate && contract.advocate.civil_status
                    ? contract.advocate.civil_status
                    : ''
                }
                disabled={true}
              ></TextField>
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Endereço"
                name="advocate_address"
                value={formatAddressAdvocate()}
                disabled={true}
              ></TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Formik
        initialValues={{
          payment_day: contract.payment_day || 0,
          contract_price: maskReais(contract.contract_price) || '',
          fine_price: maskReais(contract.fine_price) || '',
          agency: contract.agency || '',
          account: contract.account || '',
          bank: contract.bank || '',
          start_date: '',
          finish_date: ''
        }}
        validationSchema={ContractSchema}
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
              <CardHeader title="Dados do contrato" />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={6} xs={12}>
                    <MuiPickersUtilsProvider locale={ptBR} utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        fullWidth
                        invalidDateMessage={
                          error && error.start_date ? error.start_date : ''
                        }
                        openTo="year"
                        disabled={disabled || contract.canceled_at !== null}
                        format="dd/MM/yyyy"
                        label="Data de inicio"
                        views={['year', 'month', 'date']}
                        value={selectedStartDate}
                        disablePast={true}
                        minDateMessage="Data não pode ser menor que a data atual"
                        inputVariant="outlined"
                        onChange={(e) => {
                          showSuccess.current = false;
                          showError.current = false;
                          handleStartDateChange(e);
                          const validateDate = moment(e);
                          if (validateDate.isValid()) {
                            errors.start_date = '';
                            setError({ start_date: '' });
                          } else {
                            setError({
                              start_date: ['Data inválida']
                            });
                          }
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
                        invalidDateMessage={
                          error && error.finish_date ? error.finish_date : ''
                        }
                        openTo="year"
                        format="dd/MM/yyyy"
                        disabled={disabled || contract.canceled_at !== null}
                        label="Data de fim"
                        views={['year', 'month', 'date']}
                        inputVariant="outlined"
                        minDateMessage="Data não pode ser menor que a data de inicio"
                        minDate={selectedStartDate}
                        variant="dialog"
                        value={selectedEndDate}
                        disablePast={true}
                        onChange={(e) => {
                          showSuccess.current = false;
                          showError.current = false;
                          handleEndDateChange(e);
                          const validateDate = moment(e);
                          if (validateDate.isValid()) {
                            errors.start_date = '';
                            setError({ finish_date: '' });
                          } else {
                            setError({
                              finish_date: ['Data inválida']
                            });
                          }
                        }}
                        onBlur={(e) => {
                          showSuccess.current = false;
                          showError.current = false;
                          handleBlur(e);
                        }}
                        name="finish_date"
                        required
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      error={errors.payment_day}
                      helperText={errors.payment_day}
                      fullWidth
                      disabled={disabled || contract.canceled_at !== null}
                      label="Dia do pagamento"
                      name="payment_day"
                      onBlur={(event) => {
                        showSuccess.current = false;
                        showError.current = false;
                        handleBlur(event);
                      }}
                      onChange={(event) => {
                        showSuccess.current = false;
                        showError.current = false;
                        handleChange(event);
                      }}
                      required
                      select
                      SelectProps={{ native: true }}
                      value={values.payment_day}
                      variant="outlined"
                    >
                      {PaymentConstants.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      error={errors.contract_price}
                      fullWidth
                      disabled={disabled || contract.canceled_at !== null}
                      helperText={errors.contract_price}
                      label="Valor do contrato"
                      name="contract_price"
                      variant="outlined"
                      value={values.contract_price}
                      inputProps={{ maxLength: 15 }}
                      onBlur={(event) => {
                        const maskValue = maskReais(event.target.value);
                        event.target.value = maskValue;
                        showSuccess.current = false;
                        showError.current = false;
                        handleBlur(event);
                      }}
                      onChange={(event) => {
                        const maskValue = maskReais(event.target.value);
                        event.target.value = maskValue;
                        showSuccess.current = false;
                        showError.current = false;
                        handleChange(event);
                      }}
                      required
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      error={errors.fine_price}
                      fullWidth
                      disabled={disabled || contract.canceled_at !== null}
                      helperText={errors.fine_price}
                      label="Valor da multa"
                      name="fine_price"
                      variant="outlined"
                      required
                      inputProps={{ maxLength: 15 }}
                      value={values.fine_price}
                      onBlur={(event) => {
                        const maskValue = maskReais(event.target.value);
                        event.target.value = maskValue;
                        showSuccess.current = false;
                        showError.current = false;
                        handleBlur(event);
                      }}
                      onChange={(event) => {
                        const maskValue = maskReais(event.target.value);
                        event.target.value = maskValue;
                        showSuccess.current = false;
                        showError.current = false;
                        handleChange(event);
                      }}
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checked}
                          color="primary"
                          disabled={disabled || contract.canceled_at !== null}
                          onChange={(e) => {
                            showSuccess.current = false;
                            showError.current = false;
                            handleChangeChecked(e, errors);
                          }}
                        />
                      }
                      label="Utilizar meus dados de pagamento cadastrados"
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <ReactInputMask
                      mask="9999"
                      value={
                        checked &&
                        contract.advocate &&
                        contract.advocate.agency !== null
                          ? contract.advocate.agency
                          : values.agency
                      }
                      onChange={(event) => {
                        showSuccess.current = false;
                        showError.current = false;

                        handleChange(event);
                      }}
                      disabled={
                        (checked &&
                          contract.advocate &&
                          contract.advocate.agency !== null) ||
                        disabled ||
                        contract.canceled_at !== null
                      }
                    >
                      {() => (
                        <TextField
                          error={errors.agency}
                          fullWidth
                          helperText={errors.agency}
                          label="Agência (sem dígito verificador)"
                          name="agency"
                          variant="outlined"
                          disabled={
                            (checked &&
                              contract.advocate &&
                              contract.advocate.agency !== null) ||
                            disabled ||
                            contract.canceled_at !== null
                          }
                          required
                        />
                      )}
                    </ReactInputMask>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <ReactInputMask
                      mask="99999-9"
                      value={
                        checked &&
                        contract.advocate &&
                        contract.advocate.account !== null
                          ? contract.advocate.account
                          : values.account
                      }
                      disabled={
                        (checked &&
                          contract.advocate &&
                          contract.advocate.account !== null) ||
                        disabled ||
                        contract.canceled_at !== null
                      }
                      onChange={(event) => {
                        showSuccess.current = false;
                        showError.current = false;

                        handleChange(event);
                      }}
                    >
                      {() => (
                        <TextField
                          error={errors.account}
                          fullWidth
                          helperText={errors.account}
                          label="Conta"
                          name="account"
                          variant="outlined"
                          disabled={
                            (checked &&
                              contract.advocate &&
                              contract.advocate.account !== null) ||
                            disabled ||
                            contract.canceled_at !== null
                          }
                          required
                        />
                      )}
                    </ReactInputMask>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      error={errors.bank}
                      fullWidth
                      helperText={errors.bank}
                      label="Banco"
                      name="bank"
                      onBlur={(event) => {
                        showSuccess.current = false;
                        showError.current = false;
                        handleBlur(event);
                      }}
                      onChange={(event) => {
                        showSuccess.current = false;
                        showError.current = false;
                        handleChange(event);
                      }}
                      select
                      SelectProps={{ native: true }}
                      value={
                        checked &&
                        contract.advocate &&
                        contract.advocate.bank !== null
                          ? contract.advocate.bank
                          : values.bank
                      }
                      variant="outlined"
                      required
                      disabled={
                        (checked &&
                          contract.advocate &&
                          contract.advocate.bank !== null) ||
                        disabled ||
                        contract.canceled_at !== null
                      }
                    >
                      {BanksConstants.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              </CardContent>
              <Divider />
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
                      disabled={disabled || contract.canceled_at !== null}
                      onClick={submitForm}
                    >
                      Salvar Alterações
                    </Button>
                  )}
                  <Button
                    color="error"
                    variant="contained"
                    disabled={disabled || contract.canceled_at !== null}
                    onClick={() => {
                      setShowCanceledModal(true);
                    }}
                  >
                    Cancelar Contrato
                  </Button>
                </Stack>
              </Box>
            </Card>
            {showCanceledModal && (
              <div>
                <Dialog
                  open={showCanceledModal}
                  onClose={handleClose}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">
                    <Typography color="primary" variant="h5" textAlign="center">
                      Confirmar cancelamento?
                    </Typography>
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      {`Tem certeza que deseja cancelar o contrato vinculado ao
                      cliente ${contract.client.name}? Essa ação é irreversível.`}
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose} color="primary">
                      Cancelar
                    </Button>
                    <Button
                      onClick={() => {
                        handleClose();
                        canceledContract(contract.id);
                      }}
                      autoFocuscolor="primary"
                      variant="contained"
                    >
                      Confirmar
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            )}
            {showSuccess.current && (
              <>
                <ToastAnimated />
                {showToast({
                  type: 'success',
                  message: 'Contrato alterado com sucesso!'
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
            {showSuccessCancellation.current && (
              <>
                <ToastAnimated />
                {showToast({
                  type: 'success',
                  message: 'Contrato cancelado com sucesso!'
                })}
              </>
            )}
            {showErrorCancellation.current && (
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

export default ContractEdit;
