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
import { Formik } from 'formik';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import ReactInputMask from 'react-input-mask';
import { useNavigate } from 'react-router';
import InformationSchema from 'src/schemas/InformationSchema';
import { API } from 'src/services/api';
import ToastAnimated, { showToast } from '../Toast';

const civilStatus = [
  {
    value: '0',
    label: 'Selecione uma opção'
  },
  {
    value: '1',
    label: 'Solteiro(a)'
  },
  {
    value: '2',
    label: 'Casado(a)'
  },
  {
    value: '3',
    label: 'Separado(a)'
  },
  {
    value: '4',
    label: 'Divorciado(a)'
  },
  {
    value: '5',
    label: 'Viúvo(a)'
  }
];

const gender = [
  {
    value: '0',
    label: 'Selecione uma opção'
  },
  {
    value: '1',
    label: 'Feminino'
  },
  {
    value: '2',
    label: 'Masculino'
  },
  {
    value: '3',
    label: 'Não declarado'
  }
];

const ClientManagement = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState([]);
  const [error, setError] = useState(null);
  const [client, setClient] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [token, setToken] = useState();

  /**
   * Envia os dados do advogado
   * @param {*} values
   */
  async function sendInformations(values) {
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
      if (client !== null) {
        values.id = client.id;
      }

      await API.post('advocates/informations', values, config)
        .then((response) => {
          console.log(response);
        })
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
    if (isEmpty(errors)) sendInformations(values);
  };

  /**
   * Obtém as informações do advogado
   * @param {*} tokenUser
   */
  async function getInformations(tokenUser) {
    setLoading(true);
    const config = {
      headers: { Authorization: `Bearer ${tokenUser}` }
    };
    await API.get('advocates/informations', config)
      .then((response) => {
        setClient(response.data.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }

  /**
   * Use Effect
   */
  useEffect(() => {
    const tokenStorage = window.localStorage.getItem('token');
    setToken(tokenStorage);
    getInformations(tokenStorage);
  }, []);

  return loading ? (
    <Skeleton variant="rectangular" animation="wave" width="100%" height="100%">
      <div style={{ paddingTop: '57%' }} />
    </Skeleton>
  ) : (
    <Formik
      initialValues={{
        name: client ? client.name : '',
        email: client ? client.email : '',
        cpf: client ? client.cpf : '',
        rg: client ? client.rg : '',
        issuing_organ: client ? client.issuing_organ : '',
        nationality: client ? client.nationality : '',
        date_birth: client ? client.date_birth : '',
        gender: client ? client.gender : '',
        civil_status: client ? client.civil_status : '',
        telephone: client ? client.telephone : '',
        cellphone: client ? client.cellphone : '',
        cep: client ? client.cep : '',
        street: client ? client.street : '',
        number: client ? client.number : '',
        complement: client ? client.complement : '',
        district: client ? client.district : '',
        state: client ? client.state : '',
        city: client ? client.city : '',
        name_user: client ? client.name_user : '',
        email_user: client ? client.email_user : '',
        password: client ? client.password : '',
        confirm_password: client ? client.confirm_password : ''
      }}
      validationSchema={InformationSchema}
      onSubmit={handleSubmit}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        values,
        submitForm,
        setFieldError
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
                  <TextField
                    error={errors.telephone}
                    fullWidth
                    helperText={errors.telephone}
                    label="Telefone Fixo"
                    name="telephone"
                    onBlur={(event) => {
                      handleBlur(event);
                      setShowSuccess(false);
                    }}
                    onChange={(event) => {
                      handleChange(event);
                      setShowSuccess(false);
                    }}
                    value={values.telephone}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <TextField
                    error={errors.cellphone}
                    fullWidth
                    helperText={errors.cellphone}
                    label="Telefone Celular"
                    name="cellphone"
                    onBlur={(event) => {
                      handleBlur(event);
                      setShowSuccess(false);
                    }}
                    onChange={(event) => {
                      handleChange(event);
                      setShowSuccess(false);
                    }}
                    required
                    value={values.cellphone}
                    variant="outlined"
                  />
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
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </CardContent>
            <Card>
              <CardHeader
                title="Usuário de acesso"
                subheader="Geração do usuário para acesso do cliente"
              />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={6} xs={12}>
                    <TextField
                      error={errors.name_user}
                      fullWidth
                      helperText={errors.name_user}
                      label="Nome do usuário"
                      name="name_user"
                      onBlur={(event) => {
                        handleBlur(event);
                        setShowSuccess(false);
                      }}
                      onChange={(event) => {
                        handleChange(event);
                        setShowSuccess(false);
                      }}
                      value={values.name_user}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      error={
                        errors.email_user ||
                        (error && error.email_user ? error.email_user[0] : '')
                      }
                      fullWidth
                      helperText={
                        errors.email ||
                        (error && error.email_user ? error.email_user[0] : '')
                      }
                      label="Email"
                      name="email_user"
                      onBlur={(event) => {
                        handleBlur(event);
                        setShowSuccess(false);
                      }}
                      onChange={(event) => {
                        handleChange(event);
                        setShowSuccess(false);
                      }}
                      required
                      value={values.email_user}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      error={errors.password}
                      fullWidth
                      helperText={errors.password}
                      label="Senha"
                      margin="normal"
                      name="password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="password"
                      value={values.password}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <TextField
                      error={errors.confirm_password}
                      fullWidth
                      helperText={errors.confirm_password}
                      label="Confirmar senha"
                      margin="normal"
                      name="confirm_password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="confirm_password"
                      value={values.confirm_password}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
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
                  onClick={() => navigate('/dashboard')}
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
                message: 'Dados alterados com sucesso!'
              })}
            </>
          )}
        </form>
      )}
    </Formik>
  );
};

export default ClientManagement;
