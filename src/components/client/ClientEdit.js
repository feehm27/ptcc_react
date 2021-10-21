import DateFnsUtils from '@date-io/date-fns';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Skeleton,
  Stack,
  TextField
} from '@material-ui/core';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';
import { ptBR } from 'date-fns/locale';
import { Formik } from 'formik';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import ReactInputMask from 'react-input-mask';
import { useLocation, useNavigate } from 'react-router';
import CivilStatusConstants from 'src/constants/CivilStatusConstants';
import GenderConstants from 'src/constants/GenderConstants';
import ClientEditSchema from 'src/schemas/ClientEditSchema';
import { API } from 'src/services/api';
import ToastAnimated, { showToast } from '../Toast';

const civilStatus = CivilStatusConstants;
const gender = GenderConstants;

const ClientEdit = () => {
  const navigate = useNavigate();
  const { client } = useLocation().state;
  const [address, setAddress] = useState([]);
  const [error, setError] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [selectedDate, handleDateChange] = useState(client.birthday);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [token, setToken] = useState();

  /**
   * Envia os dados do advogado
   * @param {*} values
   */
  async function updatedClient(values) {
    setSubmitting(true);
    setShowSuccess(false);

    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    if (values) {
      if (address && address.street) {
        values.street = address.street;
      }
      if (address && address.district) {
        values.district = address.district;
      }
      if (address && address.city) {
        values.city = address.city;
      }
      if (address && address.state) {
        values.state = address.state;
      }

      values.birthday = moment(selectedDate).format('YYYY-MM-DD');

      await API.put(`advocates/clients/${client.id}`, values, config)
        .then(() => {})
        .catch((err) => {
          setError(err.response.data.errors);
          setShowSuccess(false);
        })
        .finally(() => {
          setSubmitting(false);
          setShowSuccess(true);
        });
    }
  }

  /**
   * Obtém o endereço pelo cep digitado
   * @param {*} cep
   */
  async function getAddressByZipCode(cep, errors) {
    setLoadingAddress(true);
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then((res) => res.json())
      .then((data) => {
        if (data.erro) {
          setError({
            cep: ['CEP não encontrado. Preencha o endereço manualmente.']
          });
          setLoadingAddress(false);
          setAddress([]);
        } else {
          setAddress({
            state: data.uf,
            city: data.localidade,
            district: data.bairro,
            street: data.logradouro
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
   * Envia os dados do formulário
   * @param {*} values
   */
  const handleSubmit = (values, errors, setFieldError) => {
    if (address && address.street) {
      delete errors.street;
      setFieldError('street', null);
    }
    if (address && address.district) {
      delete errors.district;
      setFieldError('district', null);
    }
    if (address && address.city) {
      delete errors.city;
      setFieldError('city', null);
    }
    if (address && address.state) {
      delete errors.state;
      setFieldError('state', null);
    }

    if (isEmpty(errors)) updatedClient(values);
  };

  /**
   * Use Effect
   */
  useEffect(() => {
    setToken(window.localStorage.getItem('token'));
  }, []);

  return (
    <Formik
      initialValues={{
        name: client.name || '',
        email: client.email || '',
        cpf: client.cpf || '',
        rg: client.rg || '',
        issuing_organ: client.issuing_organ || '',
        nationality: client.nationality || '',
        birthday: client.birthday || '',
        gender: client.gender || '',
        civil_status: client.civil_status || '',
        telephone: client.telephone || '',
        cellphone: client.cellphone || '',
        cep: client.cep || '',
        street: client.street || '',
        number: client.number || '',
        complement: client.complement || null,
        district: client.district || '',
        state: client.state || '',
        city: client.city || ''
      }}
      validationSchema={ClientEditSchema}
      onSubmit={handleSubmit}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        values,
        submitForm,
        setFieldError,
        touched
      }) => (
        <form
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            setShowSuccess(false);
            handleSubmit(values, errors, setFieldError);
          }}
        >
          <Card>
            <CardHeader title="Dados básicos" />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={errors.name}
                    fullWidth
                    helperText={errors.name}
                    label="Nome completo"
                    name="name"
                    onBlur={(event) => {
                      handleBlur(event);
                      setShowSuccess(false);
                    }}
                    onChange={(event) => {
                      handleChange(event);
                      setShowSuccess(false);
                    }}
                    value={values.name}
                    required
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={
                      errors.email ||
                      (error && error.email ? error.email[0] : '')
                    }
                    fullWidth
                    helperText={
                      errors.email ||
                      (error && error.email ? error.email[0] : '')
                    }
                    label="Email"
                    name="email"
                    onBlur={(event) => {
                      handleBlur(event);
                      setShowSuccess(false);
                    }}
                    onChange={(event) => {
                      handleChange(event);
                      setShowSuccess(false);
                    }}
                    required
                    value={values.email}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <ReactInputMask
                    mask="999.999.999-99"
                    value={values.cpf}
                    onChange={(event) => {
                      if (error && error.cpf) {
                        error.cpf = null;
                      }
                      handleChange(event);
                      setShowSuccess(false);
                    }}
                  >
                    {() => (
                      <TextField
                        error={
                          errors.cpf || (error && error.cpf ? error.cpf[0] : '')
                        }
                        fullWidth
                        helperText={
                          errors.cpf || (error && error.cpf ? error.cpf[0] : '')
                        }
                        label="CPF"
                        name="cpf"
                        required
                        variant="outlined"
                        maxLength="14"
                      />
                    )}
                  </ReactInputMask>
                </Grid>
                <Grid item md={3} xs={12}>
                  <TextField
                    error={errors.rg}
                    fullWidth
                    helperText={errors.rg}
                    label="RG"
                    name="rg"
                    onBlur={(event) => {
                      handleBlur(event);
                      setShowSuccess(false);
                    }}
                    onChange={(event) => {
                      handleChange(event);
                      setShowSuccess(false);
                    }}
                    required
                    value={values.rg}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={3} xs={12}>
                  <TextField
                    error={errors.issuing_organ}
                    fullWidth
                    helperText={errors.issuing_organ}
                    label="Orgão Emissor"
                    name="issuing_organ"
                    onBlur={(event) => {
                      handleBlur(event);
                      setShowSuccess(false);
                    }}
                    onChange={(event) => {
                      handleChange(event);
                      setShowSuccess(false);
                    }}
                    required
                    value={values.issuing_organ}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <MuiPickersUtilsProvider locale={ptBR} utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      error={Boolean(touched.birthday && errors.birthday)}
                      disableFuture
                      helperText={touched.birthday && errors.birthday}
                      openTo="year"
                      format="dd/MM/yyyy"
                      label="Data de nascimento"
                      views={['year', 'month', 'date']}
                      value={selectedDate}
                      onChange={(e) => {
                        handleDateChange(e);
                        setShowSuccess(false);
                      }}
                      onBlur={(e) => {
                        setShowSuccess(false);
                        handleBlur(e);
                      }}
                      name="birthday"
                      required
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={errors.nationality}
                    fullWidth
                    helperText={errors.nationality}
                    label="Nacionalidade"
                    name="nationality"
                    onBlur={(event) => {
                      handleBlur(event);
                      setShowSuccess(false);
                    }}
                    onChange={(event) => {
                      handleChange(event);
                      setShowSuccess(false);
                    }}
                    required
                    value={values.nationality}
                    variant="outlined"
                  />
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
                      setShowSuccess(false);
                    }}
                    onChange={(event) => {
                      handleChange(event);
                      setShowSuccess(false);
                    }}
                    required
                    select
                    SelectProps={{ native: true }}
                    value={values.gender}
                    variant="outlined"
                  >
                    {gender.map((option) => (
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
                      setShowSuccess(false);
                    }}
                    onChange={(event) => {
                      handleChange(event);
                      setShowSuccess(false);
                    }}
                    required
                    select
                    SelectProps={{ native: true }}
                    value={values.civil_status}
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
                    mask="(99) 99999-9999"
                    value={values.cellphone}
                    onChange={(event) => {
                      handleChange(event);
                      setShowSuccess(false);
                    }}
                  >
                    {() => (
                      <TextField
                        error={errors.cellphone}
                        fullWidth
                        helperText={errors.cellphone}
                        label="Telefone Celular"
                        name="cellphone"
                        required
                        variant="outlined"
                      />
                    )}
                  </ReactInputMask>
                </Grid>
                <Grid item md={6} xs={12}>
                  <ReactInputMask
                    mask="(99) 9999-9999"
                    value={values.telephone}
                    onChange={(event) => {
                      handleChange(event);
                      setShowSuccess(false);
                    }}
                  >
                    {() => (
                      <TextField
                        error={errors.telephone}
                        fullWidth
                        helperText={errors.telephone}
                        label="Telefone Fixo"
                        name="telephone"
                        variant="outlined"
                      />
                    )}
                  </ReactInputMask>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Card>
            <CardHeader title="Dados do endereço" />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <ReactInputMask
                    mask="99.999-999"
                    value={values.cep}
                    onChange={(event) => {
                      handleChange(event);
                      const unmask = event.target.value.replace(/[^\d]/g, '');
                      if (unmask.length === 8) {
                        getAddressByZipCode(unmask, errors);
                      }
                      setShowSuccess(false);
                    }}
                  >
                    {() => (
                      <TextField
                        error={
                          errors.cep || (error && error.cep ? error.cep[0] : '')
                        }
                        fullWidth
                        helperText={
                          errors.cep || (error && error.cep ? error.cep[0] : '')
                        }
                        label="CEP"
                        name="cep"
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
                        error={errors.street}
                        fullWidth
                        helperText={errors.street}
                        label="Rua"
                        name="street"
                        onBlur={(event) => {
                          handleBlur(event);
                          setShowSuccess(false);
                        }}
                        onChange={(event) => {
                          handleChange(event);
                          address.street = null;
                          setShowSuccess(false);
                        }}
                        value={address.street ? address.street : values.street}
                        variant="outlined"
                        required
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        error={errors.number}
                        fullWidth
                        helperText={errors.number}
                        label="Número"
                        name="number"
                        onBlur={(event) => {
                          handleBlur(event);
                          setShowSuccess(false);
                        }}
                        onChange={(event) => {
                          handleChange(event);
                          setShowSuccess(false);
                        }}
                        value={values.number}
                        variant="outlined"
                        required
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        error={errors.district}
                        fullWidth
                        helperText={errors.district}
                        label="Bairro"
                        name="district"
                        onBlur={(event) => {
                          handleBlur(event);
                          setShowSuccess(false);
                        }}
                        onChange={(event) => {
                          address.district = null;
                          handleChange(event);
                          setShowSuccess(false);
                        }}
                        value={
                          address.district ? address.district : values.district
                        }
                        variant="outlined"
                        required
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        error={errors.complement}
                        fullWidth
                        helperText={errors.complement}
                        label="Complemento"
                        name="complement"
                        onBlur={(event) => {
                          handleBlur(event);
                          setShowSuccess(false);
                        }}
                        onChange={(event) => {
                          handleChange(event);
                          setShowSuccess(false);
                        }}
                        value={values.complement}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        error={errors.state}
                        fullWidth
                        helperText={errors.state}
                        label="Estado"
                        name="state"
                        onBlur={(event) => {
                          handleBlur(event);
                          setShowSuccess(false);
                        }}
                        onChange={(event) => {
                          address.state = null;
                          handleChange(event);
                          setShowSuccess(false);
                        }}
                        value={address.state ? address.state : values.state}
                        variant="outlined"
                        required
                      />
                    </Grid>
                    <Grid item md={6} xs={12}>
                      <TextField
                        error={errors.city}
                        fullWidth
                        helperText={errors.city}
                        label="Cidade"
                        name="city"
                        onBlur={(event) => {
                          handleBlur(event);
                          setShowSuccess(false);
                        }}
                        onChange={(event) => {
                          address.city = null;
                          handleChange(event);
                          setShowSuccess(false);
                        }}
                        value={address.city ? address.city : values.city}
                        variant="outlined"
                        required
                      />
                    </Grid>
                  </>
                )}
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
                  onClick={() => navigate('/clients')}
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
          {showSuccess && (
            <>
              <ToastAnimated />
              {showToast({
                type: 'success',
                message: 'Cliente atualizado com sucesso!'
              })}
            </>
          )}
        </form>
      )}
    </Formik>
  );
};

export default ClientEdit;
