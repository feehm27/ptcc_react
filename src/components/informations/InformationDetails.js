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
import { useContext, useEffect, useState } from 'react';
import ReactInputMask from 'react-input-mask';
import { useNavigate } from 'react-router';
import BanksConstants from 'src/constants/BanksConstants';
import CivilStatusConstants from 'src/constants/CivilStatusConstants';
import { UserContext } from 'src/contexts/UserContext';
import InformationSchema from 'src/schemas/InformationSchema';
import { API } from 'src/services/api';
import ToastAnimated, { showToast } from '../Toast';

const civilStatus = CivilStatusConstants;

const InformationDetails = () => {
  const navigate = useNavigate();
  const { data } = useContext(UserContext);

  const [address, setAddress] = useState([]);
  const [error, setError] = useState(null);
  const [informations, setInformations] = useState([]);
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
      if (informations !== null) {
        values.id = informations.id;
      }

      await API.post('advocates/informations', values, config)
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
          delete errors.cep;
          delete errors.state;
          delete errors.city;
          delete errors.district;
          setLoadingAddress(false);
          setError({ cep: null });
        }
      });
  }

  /**
   * Envia os dados do formulário
   * @param {*} values
   */
  const handleSubmit = (values, errors) => {
    if (address && address.street) {
      delete errors.street;
    }
    if (address && address.district) {
      delete errors.district;
    }
    if (address && address.city) {
      delete errors.city;
    }
    if (address && address.state) {
      delete errors.state;
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
        setInformations(response.data.data);
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
        name: informations ? informations.name : '',
        cpf: informations ? informations.cpf : '',
        nationality: informations ? informations.nationality : '',
        civil_status: informations ? informations.civil_status : '',
        register_oab: informations ? informations.register_oab : '',
        email: informations ? informations.email : '',
        cep: informations ? informations.cep : '',
        street: informations ? informations.street : '',
        number: informations ? informations.number : '',
        complement: informations ? informations.complement : '',
        district: informations ? informations.district : '',
        state: informations ? informations.state : '',
        city: informations ? informations.city : '',
        agency: informations ? informations.agency : '',
        account: informations ? informations.account : '',
        bank: informations ? informations.bank : ''
      }}
      validationSchema={InformationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, handleBlur, handleChange, values, submitForm }) => (
        <form
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            setShowSuccess(false);
            handleSubmit(values, errors);
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
                    error={errors.register_oab}
                    fullWidth
                    helperText={errors.register_oab}
                    label="Número de registro OAB"
                    name="register_oab"
                    onBlur={(event) => {
                      handleBlur(event);
                      setShowSuccess(false);
                    }}
                    onChange={(event) => {
                      handleChange(event);
                      setShowSuccess(false);
                    }}
                    required
                    value={values.register_oab}
                    variant="outlined"
                    inputProps={{ maxLength: 8 }}
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
            <Card>
              <CardHeader
                title="Dados do pagamento"
                subheader="Dados para preenchimento automático de pagamento no contrato"
              />
              <Divider />
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={6} xs={12}>
                    <ReactInputMask
                      mask="9999"
                      value={values.agency}
                      onChange={(event) => {
                        handleChange(event);
                        setShowSuccess(false);
                      }}
                    >
                      {() => (
                        <TextField
                          error={errors.agency}
                          fullWidth
                          helperText={errors.agency}
                          label="Agência (sem dígito verificador)"
                          name="agency"
                          variant="outlined"
                        />
                      )}
                    </ReactInputMask>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <ReactInputMask
                      mask="99999-9"
                      value={values.account}
                      onChange={(event) => {
                        handleChange(event);
                        setShowSuccess(false);
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
                        setShowSuccess(false);
                      }}
                      onChange={(event) => {
                        handleChange(event);
                        setShowSuccess(false);
                      }}
                      select
                      SelectProps={{ native: true }}
                      value={values.bank}
                      variant="outlined"
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
                    disabled={
                      data && !data.isAdmin
                        ? data.checkeds.permissions_checked[1][0].checked === 0
                        : false
                    }
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

export default InformationDetails;
