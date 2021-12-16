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
  Skeleton,
  TextField,
  Typography,
  Stack,
  Link
} from '@material-ui/core';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';
import { ptBR } from 'date-fns/locale';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import ReactInputMask from 'react-input-mask';
import { useLocation, useNavigate } from 'react-router';
import BanksConstants from 'src/constants/BanksConstants';
import CivilStatusConstants from 'src/constants/CivilStatusConstants';
import ContractCreateSchema from 'src/schemas/ContractCreateSchema';
import { API } from 'src/services/api';

const ContractCreate = () => {
  const { client } = useLocation().state;
  const navigate = useNavigate();

  const [address, setAddress] = useState([]);
  const [error, setError] = useState(null);
  const [advocateFound, setAdvocateFound] = useState([]);
  const [checked, setChecked] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedStartDate, handleStartDateChange] = useState(null);
  const [selectedEndDate, handleEndDateChange] = useState(null);

  const civilStatus = CivilStatusConstants;

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

  const handleChangeChecked = (event) => {
    setChecked(event.target.checked);
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

  const formatAddressClient = () => {
    if (client) {
      return `${client.street}, ${client.number}, ${client.district} - ${client.city} - ${client.state}`;
    }
    return ' ';
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

      <Formik
        initialValues={{
          advocate_name: '',
          advocate_email: '',
          advocate_cpf: '',
          advocate_register_oab: '',
          advocate_nationality: '',
          advocate_civil_status: '0'
        }}
        validationSchema={ContractCreateSchema}
        onSubmit={() => {
          console.log('submit');
        }}
      >
        {({ errors, values, handleBlur, handleChange }) => (
          <form
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
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
            {showModal && (
              <div>
                <Grid container spacing={12}>
                  <Dialog
                    fullWidth
                    open={showModal}
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
                              handleBlur(event);
                            }}
                            onChange={(event) => {
                              handleChange(event);
                            }}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item md={6} xs={12}>
                          <TextField
                            error={errors.advocate_email}
                            helperText={errors.advocate_email}
                            fullWidth
                            label="Email"
                            name="advocate_email"
                            value={values.advocate_email}
                            variant="outlined"
                            onBlur={(event) => {
                              handleBlur(event);
                            }}
                            onChange={(event) => {
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
                              handleChange(event);
                            }}
                          >
                            {() => (
                              <TextField
                                error={errors.advocate_cpf}
                                helperText={errors.advocate_cpf}
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
                              handleBlur(event);
                            }}
                            onChange={(event) => {
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
                              handleBlur(event);
                            }}
                            onChange={(event) => {
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
                              handleBlur(event);
                            }}
                            onChange={(event) => {
                              handleChange(event);
                            }}
                            required
                            select
                            SelectProps={{ native: true }}
                            value={values.advocate_civil_status}
                            variant="outlined"
                          >
                            {civilStatus.map((option) => (
                              <option key={option.value} value={option.value}>
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
                              handleChange(event);
                              const unmask = event.target.value.replace(
                                /[^\d]/g,
                                ''
                              );
                              if (unmask.length === 8) {
                                getAddressByZipCode(unmask, errors);
                                setShowModal(true);
                              }
                            }}
                          >
                            {() => (
                              <TextField
                                error={
                                  errors.cep ||
                                  (error && error.cep ? error.cep[0] : '')
                                }
                                fullWidth
                                helperText={
                                  errors.cep ||
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
                                  handleBlur(event);
                                }}
                                onChange={(event) => {
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
                                  handleBlur(event);
                                }}
                                onChange={(event) => {
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
                                  handleBlur(event);
                                }}
                                onChange={(event) => {
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
                                  handleBlur(event);
                                }}
                                onChange={(event) => {
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
                                  handleBlur(event);
                                }}
                                onChange={(event) => {
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
                                  handleBlur(event);
                                }}
                                onChange={(event) => {
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
                                mask="99999999-9"
                                value={values.account}
                                onChange={(event) => {
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
                                  handleBlur(event);
                                }}
                                onChange={(event) => {
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
                      <Button
                        onClick={() => {
                          navigate('/contracts');
                        }}
                        color="primary"
                      >
                        Voltar
                      </Button>
                      <Button
                        type="submit"
                        autoFocuscolor="primary"
                        variant="contained"
                      >
                        Cadastrar
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Grid>
              </div>
            )}
          </form>
        )}
      </Formik>

      <Formik
        initialValues={{
          day_payment: 0,
          value_contract: '',
          value_penalty_contract: '',
          agency: '',
          account: '',
          bank: ''
        }}
        validationSchema={ContractCreateSchema}
        onSubmit={() => {
          console.log('submit');
        }}
      >
        {({ errors, values, handleBlur, handleChange }) => (
          <form
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault();
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
                        error={
                          errors.start_date ||
                          (error && error.start_date ? error.start_date[0] : '')
                        }
                        fullWidth
                        helperText={
                          errors.start_date ||
                          (error && error.start_date ? error.start_date[0] : '')
                        }
                        disableFuture
                        openTo="year"
                        format="dd/MM/yyyy"
                        label="Data de inicio"
                        views={['year', 'month', 'date']}
                        value={selectedStartDate}
                        onChange={(e) => {
                          handleStartDateChange(e);
                          if (e !== 'Invalid Date') {
                            errors.start_date = '';
                            setError({ start_date: '' });
                          }
                        }}
                        onBlur={(e) => {
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
                        error={
                          errors.finish_date ||
                          (error && error.finish_date
                            ? error.finish_date[0]
                            : '')
                        }
                        fullWidth
                        helperText={
                          errors.finish_date ||
                          (error && error.finish_date
                            ? error.finish_date[0]
                            : '')
                        }
                        disableFuture
                        openTo="year"
                        format="dd/MM/yyyy"
                        label="Data de fim"
                        views={['year', 'month', 'date']}
                        value={selectedEndDate}
                        onChange={(e) => {
                          handleEndDateChange(e);
                          if (e !== 'Invalid Date') {
                            errors.finish_date = '';
                            setError({ finish_date: '' });
                          }
                        }}
                        onBlur={(e) => {
                          handleBlur(e);
                        }}
                        name="finish_date"
                        required
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      error={errors.day_payment}
                      fullWidth
                      helperText={errors.day_payment}
                      label="Dia do pagamento"
                      name="day_payment"
                      onBlur={(event) => {
                        handleBlur(event);
                      }}
                      onChange={(event) => {
                        handleChange(event);
                      }}
                      number
                      value={values.day_payment}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      error={errors.value_contract}
                      fullWidth
                      helperText={errors.value_contract}
                      label="Valor do contrato"
                      name="value_contract"
                      onBlur={(event) => {
                        handleBlur(event);
                      }}
                      onChange={(event) => {
                        handleChange(event);
                      }}
                      value={values.value_contract}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      error={errors.value_penalty_contract}
                      fullWidth
                      helperText={errors.value_penalty_contract}
                      label="Valor da multa"
                      name="value_penalty_contract"
                      onBlur={(event) => {
                        handleBlur(event);
                      }}
                      onChange={(event) => {
                        handleChange(event);
                      }}
                      value={values.value_penalty_contract}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item md={12} xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checked}
                          color="primary"
                          onChange={(e) => {
                            handleChangeChecked(e);
                          }}
                        />
                      }
                      label="Utilizar meus dados de pagamento cadastrados"
                    />
                  </Grid>

                  {checked && advocateFound === null && (
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
                        checked && advocateFound
                          ? advocateFound.agency
                          : values.agency
                      }
                      onChange={(event) => {
                        handleChange(event);
                      }}
                      disabled={checked && advocateFound}
                    >
                      {() => (
                        <TextField
                          error={errors.agency}
                          fullWidth
                          helperText={errors.agency}
                          label="Agência (sem dígito verificador)"
                          name="agency"
                          variant="outlined"
                          disabled={checked && advocateFound}
                          required
                        />
                      )}
                    </ReactInputMask>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <ReactInputMask
                      mask="99999999-9"
                      value={
                        checked && advocateFound
                          ? advocateFound.account
                          : values.account
                      }
                      disabled={checked && advocateFound}
                      onChange={(event) => {
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
                          disabled={checked && advocateFound}
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
                        handleBlur(event);
                      }}
                      onChange={(event) => {
                        handleChange(event);
                      }}
                      select
                      SelectProps={{ native: true }}
                      value={
                        checked && advocateFound
                          ? advocateFound.bank
                          : values.bank
                      }
                      variant="outlined"
                      required
                      disabled={checked && advocateFound}
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
                  <Button
                    color="primary"
                    variant="contained"
                    type="submit"
                    onClick={() => console.log('teste')}
                  >
                    Salvar
                  </Button>
                </Stack>
              </Box>
            </Card>
          </form>
        )}
      </Formik>
    </>
  );
};

export default ContractCreate;
