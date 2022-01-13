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
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  Link,
  Skeleton,
  Stack,
  TextField,
  Typography
} from '@material-ui/core';

import moment from 'moment';

import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';
import { ptBR } from 'date-fns/locale';
import { Formik } from 'formik';
import { isEmpty } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import ReactInputMask from 'react-input-mask';
import { useLocation, useNavigate } from 'react-router';
import BanksConstants from 'src/constants/BanksConstants';
import CivilStatusConstants from 'src/constants/CivilStatusConstants';
import PaymentConstants from 'src/constants/PaymentConstants';
import ContractAdvocateSchema from 'src/schemas/ContractAdvocateSchema';
import ContractSchema from 'src/schemas/ContractSchema';
import { API } from 'src/services/api';
import ToastAnimated, { showToast } from '../Toast';

const ContractCreate = () => {
  const { client } = useLocation().state;
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [address, setAddress] = useState([]);
  const [advocateFound, setAdvocateFound] = useState([]);
  const [checked, setChecked] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [selectedStartDate, handleStartDateChange] = useState(null);
  const [selectedEndDate, handleEndDateChange] = useState(null);

  const showSuccessAdvocate = useRef(false);
  const showErrorAdvocate = useRef(false);

  const showSuccessContract = useRef(false);
  const showErrorContract = useRef(false);

  const checkPaymentDetails = (errors) => {
    if (checked && advocateFound === null) {
      return true;
    }

    if (checked && advocateFound !== null) {
      if (
        advocateFound.agency == null &&
        advocateFound.account == null &&
        advocateFound.bank == null
      ) {
        return true;
      }

      delete errors.agency;
      delete errors.account;
      delete errors.bank;
    }

    return false;
  };

  const handleChangeChecked = (event) => {
    setChecked(event.target.checked);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const formatAddressClient = () => {
    if (client) {
      return `${client.street}, ${client.number}, ${client.district} - ${client.city} - ${client.state}`;
    }
    return ' ';
  };

  /**
   * Obtém as informações do advogado
   */
  async function getAdvocate() {
    const config = {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
      }
    };

    await API.get('advocates/informations', config)
      .then((response) => {
        setAdvocateFound(response.data.data);
      })
      .catch((err) => console.error(err));
  }

  /**
   * Obtém o endereço pelo cep digitado
   * @param {*} cep
   */
  async function getAddressByZipCode(cep, errors) {
    setLoadingAddress(true);
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then((res) => res.json())
      .then((response) => {
        if (response.erro) {
          setError({
            cep: ['CEP não encontrado. Preencha o endereço manualmente.']
          });
          setLoadingAddress(false);
          setAddress([]);
        } else {
          setAddress({
            state: response.uf,
            city: response.localidade,
            district: response.bairro,
            street: response.logradouro
          });

          errors.cep = null;
          errors.state = null;
          errors.city = null;
          errors.district = null;
          setLoadingAddress(false);
          setError({ cep: null });
        }
      });
  }

  /**
   * Verifica se
   * @param {} errors
   * @returns
   */
  const notErrors = (errors) => {
    if (isEmpty(errors)) return true;
    if (errors.finish_date === '' || errors.start_date === '') return true;
    return false;
  };

  /**
   * Envia os dados do advogado
   * @param {*} values
   */
  async function sendInformations(values, errors) {
    showSuccessAdvocate.current = false;
    showErrorAdvocate.current = false;

    if (notErrors(errors)) {
      const config = {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem('token')}`
        }
      };

      const data = {
        name: values.advocate_name,
        cpf: values.advocate_cpf,
        nationality: values.advocate_nationality,
        civil_status: values.advocate_civil_status,
        register_oab: values.advocate_register_oab,
        email: values.advocate_email,
        cep: values.advocate_cep,
        city: address && address.city ? address.city : values.advocate_city,
        district:
          address && address.district
            ? address.district
            : values.advocate_district,
        state: address && address.state ? address.state : values.advocate_state,
        street:
          address && address.street ? address.street : values.advocate_street,
        complement: values.advocate_complement,
        number: values.advocate_number,
        agency: values.advocate_agency,
        account: values.advocate_account,
        bank: values.advocate_bank
      };

      await API.post('advocates/informations', data, config)
        .then((response) => {
          showSuccessAdvocate.current = true;
          setAdvocateFound(response.data.data);
        })
        .catch((err) => {
          const allErrors = err.response.data.errors;

          if (allErrors && (allErrors.email || allErrors.cpf)) {
            setError(err.response.data.errors);
          } else {
            setError('');
            showErrorAdvocate.current = true;
          }
        });
    }
  }

  /**
   * Envia os dados do advogado
   * @param {*} values
   */
  async function sendContract(values) {
    setSubmitting(true);

    const config = {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
      }
    };

    values.start_date = moment(selectedStartDate).format('YYYY-MM-DD');
    values.finish_date = moment(selectedEndDate).format('YYYY-MM-DD');
    values.client_id = client.id;
    values.advocate_id = advocateFound.id;

    if (values.account === '') values.account = advocateFound.account;
    if (values.agency === '') values.agency = advocateFound.agency;
    if (values.bank === 0) values.bank = advocateFound.bank;

    await API.post('advocates/contracts', values, config)
      .then(() => {
        showSuccessContract.current = true;
      })
      .catch((err) => {
        const allErrors = err.response.data.errors;
        if (allErrors.email || allErrors.cpf || allErrors.email_user) {
          setError(err.response.data.errors);
        } else {
          setError('');
          showErrorContract.current = true;
        }
        showSuccessContract.current = false;
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
    if (isEmpty(errors)) sendContract(values);
  };

  /**
   * Atualiza a página depois de um tempo
   */
  const callTimeOut = () => {
    setTimeout(() => handleClose(), 1500);
  };

  /**
   * Use Effect
   */
  useEffect(() => {
    getAdvocate();
  }, []);

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
                value={client && client.name ? client.name : ''}
                variant="outlined"
                disabled={true}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={client && client.email ? client.email : ''}
                variant="outlined"
                disabled={true}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <ReactInputMask
                mask="999.999.999-99"
                value={client && client.cpf ? client.cpf : ''}
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
                value={client && client.rg ? client.rg : ''}
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
                  value={client && client.birthday ? client.birthday : ''}
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
                value={client && client.nationality ? client.nationality : ''}
                variant="outlined"
                disabled={true}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Gênero"
                name="gender"
                value={client && client.gender ? client.gender : ''}
                disabled={true}
              ></TextField>
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label="Estado Civil"
                name="civil_status"
                value={client && client.civil_status ? client.civil_status : ''}
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
          {advocateFound === null && (
            <Typography variant="h5" color="text.tertiary">
              Você não possui dados cadastrados para geração do contrato.{' '}
              <Link cursor="pointer" onClick={() => setShowModal(true)}>
                Clique aqui
              </Link>{' '}
              para cadastrar seus dados.
            </Typography>
          )}

          {showModal && (
            <Formik
              initialValues={{
                advocate_name: '',
                advocate_email: '',
                advocate_cpf: '',
                advocate_register_oab: '',
                advocate_nationality: '',
                advocate_civil_status: '',
                advocate_cep: '',
                advocate_street: '',
                advocate_number: '',
                advocate_complement: '',
                advocate_district: '',
                advocate_state: '',
                advocate_city: '',
                advocate_agency: '',
                advocate_account: '',
                advocate_bank: ''
              }}
              validationSchema={ContractAdvocateSchema}
            >
              {({ errors, values, handleBlur, handleChange }) => (
                <form autoComplete="off">
                  <>
                    <div>
                      <Dialog
                        fullWidth
                        open={showModal}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                      >
                        <DialogTitle id="alert-dialog-title">
                          <Typography
                            color="primary"
                            variant="h5"
                            textAlign="center"
                          >
                            Cadastrar meus dados
                          </Typography>
                        </DialogTitle>
                        <DialogContent>
                          <Grid container spacing={3}>
                            <Grid item md={6} xs={12}>
                              <TextField
                                error={errors.advocate_name}
                                helperText={errors.advocate_name}
                                fullWidth
                                label="Nome completo"
                                name="advocate_name"
                                value={values.advocate_name}
                                required
                                onBlur={(event) => {
                                  showSuccessAdvocate.current = false;
                                  showErrorAdvocate.current = false;
                                  handleBlur(event);
                                }}
                                onChange={(event) => {
                                  showSuccessAdvocate.current = false;
                                  showErrorAdvocate.current = false;
                                  handleChange(event);
                                }}
                                variant="outlined"
                              />
                            </Grid>
                            <Grid item md={6} xs={12}>
                              <TextField
                                error={
                                  errors.advocate_email ||
                                  (error && error.email ? error.email[0] : '')
                                }
                                helperText={
                                  errors.advocate_email ||
                                  (error && error.email ? error.email[0] : '')
                                }
                                fullWidth
                                label="Email"
                                name="advocate_email"
                                value={values.advocate_email}
                                variant="outlined"
                                onBlur={(event) => {
                                  showSuccessAdvocate.current = false;
                                  showErrorAdvocate.current = false;
                                  handleBlur(event);
                                }}
                                onChange={(event) => {
                                  showSuccessAdvocate.current = false;
                                  showErrorAdvocate.current = false;
                                  handleChange(event);
                                }}
                                required
                              />
                            </Grid>
                            <Grid item md={6} xs={12}>
                              <ReactInputMask
                                mask="999.999.999-99"
                                value={values.advocate_cpf}
                                onChange={(event) => {
                                  showSuccessAdvocate.current = false;
                                  showErrorAdvocate.current = false;
                                  handleChange(event);
                                }}
                              >
                                {() => (
                                  <TextField
                                    error={
                                      errors.advocate_cpf ||
                                      (error && error.cpf ? error.cpf[0] : '')
                                    }
                                    helperText={
                                      errors.advocate_cpf ||
                                      (error && error.cpf ? error.cpf[0] : '')
                                    }
                                    label="CPF"
                                    name="advocate_cpf"
                                    fullWidth
                                    variant="outlined"
                                    maxLength="14"
                                    required
                                  />
                                )}
                              </ReactInputMask>
                            </Grid>
                            <Grid item md={6} xs={12}>
                              <TextField
                                error={errors.advocate_register_oab}
                                helperText={errors.advocate_register_oab}
                                fullWidth
                                label="Número da OAB"
                                name="advocate_register_oab"
                                value={values.advocate_register_oab}
                                variant="outlined"
                                onBlur={(event) => {
                                  showSuccessAdvocate.current = false;
                                  showErrorAdvocate.current = false;
                                  handleBlur(event);
                                }}
                                onChange={(event) => {
                                  showSuccessAdvocate.current = false;
                                  showErrorAdvocate.current = false;
                                  handleChange(event);
                                }}
                                required
                              />
                            </Grid>

                            <Grid item md={6} xs={12}>
                              <TextField
                                error={errors.advocate_nationality}
                                helperText={errors.advocate_nationality}
                                fullWidth
                                label="Nacionalidade"
                                name="advocate_nationality"
                                value={values.advocate_nationality}
                                variant="outlined"
                                onBlur={(event) => {
                                  showSuccessAdvocate.current = false;
                                  showErrorAdvocate.current = false;
                                  handleBlur(event);
                                }}
                                onChange={(event) => {
                                  showSuccessAdvocate.current = false;
                                  showErrorAdvocate.current = false;
                                  handleChange(event);
                                }}
                                required
                              />
                            </Grid>

                            <Grid item md={6} xs={12}>
                              <TextField
                                error={errors.advocate_civil_status}
                                helperText={errors.advocate_civil_status}
                                fullWidth
                                label="Estado Civil"
                                name="advocate_civil_status"
                                onBlur={(event) => {
                                  showSuccessAdvocate.current = false;
                                  showErrorAdvocate.current = false;
                                  handleBlur(event);
                                }}
                                onChange={(event) => {
                                  showSuccessAdvocate.current = false;
                                  showErrorAdvocate.current = false;
                                  handleChange(event);
                                }}
                                required
                                select
                                SelectProps={{ native: true }}
                                value={values.advocate_civil_status}
                                variant="outlined"
                              >
                                {CivilStatusConstants.map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                              </TextField>
                            </Grid>
                            <Grid item md={6} xs={12}>
                              <ReactInputMask
                                mask="99.999-999"
                                value={values.advocate_cep}
                                onChange={(event) => {
                                  showSuccessAdvocate.current = false;
                                  showErrorAdvocate.current = false;
                                  handleChange(event);
                                  const unmask = event.target.value.replace(
                                    /[^\d]/g,
                                    ''
                                  );
                                  if (unmask.length === 8) {
                                    getAddressByZipCode(unmask, errors);
                                  }
                                }}
                              >
                                {() => (
                                  <TextField
                                    error={
                                      errors.advocate_cep ||
                                      (error && error.cep ? error.cep[0] : '')
                                    }
                                    fullWidth
                                    helperText={
                                      errors.advocate_cep ||
                                      (error && error.cep ? error.cep[0] : '')
                                    }
                                    label="CEP"
                                    name="advocate_cep"
                                    required
                                    variant="outlined"
                                    maxLength="8"
                                  />
                                )}
                              </ReactInputMask>
                            </Grid>

                            {loadingAddress ? (
                              <Skeleton
                                variant="rectangular"
                                animation="wave"
                                width="100%"
                                height="100%"
                              >
                                <div style={{ paddingTop: '57%' }} />
                              </Skeleton>
                            ) : (
                              <>
                                <Grid item md={6} xs={12}>
                                  <TextField
                                    error={errors.advocate_street}
                                    fullWidth
                                    helperText={errors.advocate_street}
                                    label="Rua"
                                    name="advocate_street"
                                    onBlur={(event) => {
                                      showSuccessAdvocate.current = false;
                                      showErrorAdvocate.current = false;
                                      handleBlur(event);
                                    }}
                                    onChange={(event) => {
                                      showSuccessAdvocate.current = false;
                                      showErrorAdvocate.current = false;
                                      handleChange(event);
                                      address.street = null;
                                    }}
                                    value={
                                      address.street
                                        ? address.street
                                        : values.advocate_street
                                    }
                                    variant="outlined"
                                    required
                                  />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                  <TextField
                                    error={errors.advocate_number}
                                    fullWidth
                                    helperText={errors.advocate_number}
                                    label="Número"
                                    name="advocate_number"
                                    onBlur={(event) => {
                                      showSuccessAdvocate.current = false;
                                      showErrorAdvocate.current = false;
                                      handleBlur(event);
                                    }}
                                    onChange={(event) => {
                                      showSuccessAdvocate.current = false;
                                      showErrorAdvocate.current = false;
                                      handleChange(event);
                                    }}
                                    value={values.advocate_number}
                                    variant="outlined"
                                    required
                                  />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                  <TextField
                                    error={errors.advocate_district}
                                    fullWidth
                                    helperText={errors.advocate_district}
                                    label="Bairro"
                                    name="advocate_district"
                                    onBlur={(event) => {
                                      showSuccessAdvocate.current = false;
                                      showErrorAdvocate.current = false;
                                      handleBlur(event);
                                    }}
                                    onChange={(event) => {
                                      showSuccessAdvocate.current = false;
                                      showErrorAdvocate.current = false;
                                      address.district = null;
                                      handleChange(event);
                                    }}
                                    value={
                                      address.district
                                        ? address.district
                                        : values.advocate_district
                                    }
                                    variant="outlined"
                                    required
                                  />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                  <TextField
                                    error={errors.advocate_complement}
                                    fullWidth
                                    helperText={errors.advocate_complement}
                                    label="Complemento"
                                    name="advocate_complement"
                                    onBlur={(event) => {
                                      showSuccessAdvocate.current = false;
                                      showErrorAdvocate.current = false;
                                      handleBlur(event);
                                    }}
                                    onChange={(event) => {
                                      showSuccessAdvocate.current = false;
                                      showErrorAdvocate.current = false;
                                      handleChange(event);
                                    }}
                                    value={values.advocate_complement}
                                    variant="outlined"
                                  />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                  <TextField
                                    error={errors.advocate_state}
                                    fullWidth
                                    helperText={errors.advocate_state}
                                    label="Estado"
                                    name="advocate_state"
                                    onBlur={(event) => {
                                      showSuccessAdvocate.current = false;
                                      showErrorAdvocate.current = false;
                                      handleBlur(event);
                                    }}
                                    onChange={(event) => {
                                      showSuccessAdvocate.current = false;
                                      showErrorAdvocate.current = false;
                                      address.state = null;
                                      handleChange(event);
                                    }}
                                    value={
                                      address.state
                                        ? address.state
                                        : values.advocate_state
                                    }
                                    variant="outlined"
                                    required
                                  />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                  <TextField
                                    error={errors.advocate_city}
                                    fullWidth
                                    helperText={errors.advocate_city}
                                    label="Cidade"
                                    name="advocate_city"
                                    onBlur={(event) => {
                                      showSuccessAdvocate.current = false;
                                      showErrorAdvocate.current = false;
                                      handleBlur(event);
                                    }}
                                    onChange={(event) => {
                                      showSuccessAdvocate.current = false;
                                      showErrorAdvocate.current = false;
                                      address.city = null;
                                      handleChange(event);
                                    }}
                                    value={
                                      address.city
                                        ? address.city
                                        : values.advocate_city
                                    }
                                    variant="outlined"
                                    required
                                  />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                  <ReactInputMask
                                    mask="9999"
                                    value={values.advocate_agency}
                                    onChange={(event) => {
                                      showSuccessAdvocate.current = false;
                                      showErrorAdvocate.current = false;
                                      handleChange(event);
                                    }}
                                  >
                                    {() => (
                                      <TextField
                                        error={errors.advocate_agency}
                                        fullWidth
                                        helperText={errors.agency}
                                        label="Agência (sem dígito verificador)"
                                        name="agency"
                                        variant="outlined"
                                        required
                                      />
                                    )}
                                  </ReactInputMask>
                                </Grid>
                                <Grid item md={6} xs={12}>
                                  <ReactInputMask
                                    mask="99999-9"
                                    value={values.account}
                                    onChange={(event) => {
                                      showSuccessAdvocate.current = false;
                                      showErrorAdvocate.current = false;
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
                                      showSuccessAdvocate.current = false;
                                      showErrorAdvocate.current = false;
                                      handleBlur(event);
                                    }}
                                    onChange={(event) => {
                                      showSuccessAdvocate.current = false;
                                      showErrorAdvocate.current = false;
                                      handleChange(event);
                                    }}
                                    select
                                    SelectProps={{ native: true }}
                                    value={values.bank}
                                    variant="outlined"
                                    required
                                  >
                                    {BanksConstants.map((option) => (
                                      <option
                                        key={option.value}
                                        value={option.value}
                                      >
                                        {option.label}
                                      </option>
                                    ))}
                                  </TextField>
                                </Grid>
                              </>
                            )}
                          </Grid>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleClose} color="primary">
                            Voltar
                          </Button>
                          <Button
                            type="button"
                            autoFocuscolor="primary"
                            variant="contained"
                            onClick={() => {
                              sendInformations(values, errors);
                            }}
                          >
                            Cadastrar
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </div>
                    {showSuccessAdvocate.current && (
                      <>
                        <ToastAnimated />
                        {showToast({
                          type: 'success',
                          message: 'Dados cadastrados com sucesso!'
                        })}
                        {callTimeOut()}
                      </>
                    )}
                    {showErrorAdvocate.current && (
                      <>
                        <ToastAnimated />
                        {showToast({
                          type: 'error',
                          message: 'Algum erro inesperado aconteceu!'
                        })}
                      </>
                    )}
                  </>
                </form>
              )}
            </Formik>
          )}

          {advocateFound !== null && (
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <TextField
                  label="Nome completo"
                  fullWidth
                  name="advocate_name"
                  value={advocateFound.name || ''}
                  variant="outlined"
                  disabled={true}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="advocate_email"
                  value={advocateFound.email || ''}
                  variant="outlined"
                  disabled={true}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <ReactInputMask
                  mask="999.999.999-99"
                  value={advocateFound.cpf || ''}
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
                  value={advocateFound.register_oab || ''}
                  variant="outlined"
                  disabled={true}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Nacionalidade"
                  name="advocate_nationality"
                  value={advocateFound.nationality || ''}
                  variant="outlined"
                  disabled={true}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Estado Civil"
                  name="advocate_civil_status"
                  value={advocateFound.civil_status || ''}
                  disabled={true}
                ></TextField>
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Endereço"
                  name="advocate_address"
                  value={`${advocateFound.street}, ${advocateFound.number}, ${advocateFound.district} - ${advocateFound.city} - ${advocateFound.state}`}
                  disabled={true}
                ></TextField>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>

      <Formik
        initialValues={{
          payment_day: 0,
          contract_price: '',
          fine_price: '',
          agency: '',
          account: '',
          bank: 0,
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
              showSuccessContract.current = false;
              showErrorContract.current = false;
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
                        format="dd/MM/yyyy"
                        label="Data de inicio"
                        views={['year', 'month', 'date']}
                        value={selectedStartDate}
                        disablePast={true}
                        minDateMessage="Data não pode ser menor que a data atual"
                        inputVariant="outlined"
                        onChange={(e) => {
                          showSuccessAdvocate.current = false;
                          showErrorAdvocate.current = false;
                          showSuccessContract.current = false;
                          showErrorContract.current = false;
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
                          showSuccessAdvocate.current = false;
                          showErrorAdvocate.current = false;
                          showSuccessContract.current = false;
                          showErrorContract.current = false;
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
                        label="Data de fim"
                        views={['year', 'month', 'date']}
                        inputVariant="outlined"
                        minDateMessage="Data não pode ser menor que a data de inicio"
                        minDate={selectedStartDate}
                        variant="dialog"
                        value={selectedEndDate}
                        disablePast={true}
                        onChange={(e) => {
                          showSuccessAdvocate.current = false;
                          showErrorAdvocate.current = false;
                          showSuccessContract.current = false;
                          showErrorContract.current = false;
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
                          showSuccessAdvocate.current = false;
                          showErrorAdvocate.current = false;
                          showSuccessContract.current = false;
                          showErrorContract.current = false;
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
                      label="Dia do pagamento"
                      name="payment_day"
                      onBlur={(event) => {
                        showSuccessContract.current = false;
                        showErrorContract.current = false;
                        handleBlur(event);
                      }}
                      onChange={(event) => {
                        showSuccessContract.current = false;
                        showErrorContract.current = false;
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
                      value={values.contract_price}
                      error={errors.contract_price}
                      fullWidth
                      helperText={errors.contract_price}
                      label="Valor do contrato"
                      name="contract_price"
                      variant="outlined"
                      inputProps={{ maxLength: 15 }}
                      onBlur={(event) => {
                        const maskValue = maskReais(event.target.value);
                        event.target.value = maskValue;
                        showSuccessContract.current = false;
                        showErrorContract.current = false;
                        showSuccessAdvocate.current = false;
                        showErrorAdvocate.current = false;
                        handleBlur(event);
                      }}
                      onChange={(event) => {
                        const maskValue = maskReais(event.target.value);
                        event.target.value = maskValue;
                        showSuccessContract.current = false;
                        showErrorContract.current = false;
                        showSuccessAdvocate.current = false;
                        showErrorAdvocate.current = false;
                        handleChange(event);
                      }}
                      required
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      value={values.fine_price}
                      error={errors.fine_price}
                      fullWidth
                      helperText={errors.fine_price}
                      label="Valor da multa"
                      name="fine_price"
                      variant="outlined"
                      inputProps={{ maxLength: 15 }}
                      onBlur={(event) => {
                        const maskValue = maskReais(event.target.value);
                        event.target.value = maskValue;
                        showSuccessContract.current = false;
                        showErrorContract.current = false;
                        showSuccessAdvocate.current = false;
                        showErrorAdvocate.current = false;
                        handleBlur(event);
                      }}
                      onChange={(event) => {
                        const maskValue = maskReais(event.target.value);
                        event.target.value = maskValue;
                        showSuccessContract.current = false;
                        showErrorContract.current = false;
                        showSuccessAdvocate.current = false;
                        showErrorAdvocate.current = false;
                        handleChange(event);
                      }}
                      required
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checked}
                          color="primary"
                          onChange={(e) => {
                            showSuccessAdvocate.current = false;
                            showErrorAdvocate.current = false;
                            showSuccessContract.current = false;
                            showErrorContract.current = false;
                            handleChangeChecked(e);
                          }}
                        />
                      }
                      label="Utilizar meus dados de pagamento cadastrados"
                    />
                  </Grid>
                  {checkPaymentDetails(errors) && (
                    <Grid item md={6} xs={12}>
                      <Typography variant="h5" color="text.tertiary">
                        Você não possui dados cadastrados para pagamento.
                        Informe os campos de pagamento para geração do contrato.
                      </Typography>
                    </Grid>
                  )}
                  <Grid item md={6} xs={12}>
                    <ReactInputMask
                      mask="9999"
                      value={
                        checked &&
                        advocateFound &&
                        advocateFound.agency !== null
                          ? advocateFound.agency
                          : values.agency
                      }
                      onChange={(event) => {
                        showSuccessContract.current = false;
                        showErrorContract.current = false;
                        showSuccessAdvocate.current = false;
                        showErrorAdvocate.current = false;
                        handleChange(event);
                      }}
                      disabled={
                        checked &&
                        advocateFound &&
                        advocateFound.agency !== null
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
                            checked &&
                            advocateFound &&
                            advocateFound.agency !== null
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
                        advocateFound &&
                        advocateFound.account !== null
                          ? advocateFound.account
                          : values.account
                      }
                      disabled={
                        checked &&
                        advocateFound &&
                        advocateFound.account !== null
                      }
                      onChange={(event) => {
                        showSuccessContract.current = false;
                        showErrorContract.current = false;
                        showSuccessAdvocate.current = false;
                        showErrorAdvocate.current = false;
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
                            checked &&
                            advocateFound &&
                            advocateFound.account !== null
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
                        showSuccessContract.current = false;
                        showErrorContract.current = false;
                        showSuccessAdvocate.current = false;
                        showErrorAdvocate.current = false;
                        handleBlur(event);
                      }}
                      onChange={(event) => {
                        showSuccessContract.current = false;
                        showErrorContract.current = false;
                        showSuccessAdvocate.current = false;
                        showErrorAdvocate.current = false;
                        handleChange(event);
                      }}
                      select
                      SelectProps={{ native: true }}
                      value={
                        checked && advocateFound && advocateFound.bank !== null
                          ? advocateFound.bank
                          : values.bank
                      }
                      variant="outlined"
                      required
                      disabled={
                        checked && advocateFound && advocateFound.bank !== null
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
                      onClick={submitForm}
                    >
                      Salvar
                    </Button>
                  )}
                </Stack>
              </Box>
            </Card>
            {showSuccessContract.current && (
              <>
                <ToastAnimated />
                {showToast({
                  type: 'success',
                  message: 'Contrato criado com sucesso!'
                })}
              </>
            )}
            {showErrorContract.current && (
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

export default ContractCreate;
