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
import { Formik } from 'formik';
import { isEmpty } from 'lodash';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from 'src/contexts/UserContext';
import ClientContactSchema from 'src/schemas/ClientContactSchema';
import { API } from 'src/services/api';
import ToastAnimated, { showToast } from '../Toast';

const ClientContactCreate = () => {
  const navigate = useNavigate();
  const { data } = useContext(UserContext);

  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  /**
   * Envia os dados do advogado
   * @param {*} values
   */
  async function sendMessage(values) {
    setSubmitting(true);
    const config = {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
      }
    };

    const params = {
      sender_name: values.name,
      subject: values.subject,
      message: values.message,
      read: 0,
      client_sent: true,
      advocate_sent: false,
      user_id: data.id
    };

    await API.post('messages', params, config)
      .then(() => {
        setShowSuccess(true);
      })
      .catch((err) => {
        setShowError(err.response.data.errors);
        setShowSuccess(false);
      });
    setSubmitting(false);
  }

  /**
   * Envia os dados do formulário
   * @param {*} values
   */
  const handleSubmit = (values, errors) => {
    if (isEmpty(errors)) sendMessage(values);
  };

  /**
   * Use Effect
   */
  useEffect(() => {}, []);

  return (
    <Formik
      initialValues={{
        name: data && data.name ? data.name : '',
        email: data && data.email ? data.email : '',
        subject: '',
        message: ''
      }}
      validationSchema={ClientContactSchema}
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
            <CardHeader title="Dados de envio" />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={12} xs={12}>
                  <TextField
                    fullWidth
                    label="Nome completo"
                    name="name"
                    value={values.name}
                    disabled
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={12} xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    disabled
                    value={values.email}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={12} xs={12}>
                  <TextField
                    error={errors.subject}
                    fullWidth
                    helperText={errors.subject}
                    label="Assunto"
                    name="subject"
                    onBlur={(event) => {
                      handleBlur(event);
                      setShowSuccess(false);
                    }}
                    onChange={(event) => {
                      handleChange(event);
                      setShowSuccess(false);
                    }}
                    required
                    value={values.subject}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={12} xs={12}>
                  <TextField
                    error={errors.message}
                    fullWidth
                    helperText={errors.message}
                    label="Mensagem"
                    multiline
                    rowsMax={Infinity}
                    onBlur={(event) => {
                      handleBlur(event);
                      setShowSuccess(false);
                    }}
                    onChange={(event) => {
                      handleChange(event);
                      setShowSuccess(false);
                    }}
                    placeholder="Mensagem:"
                    name="message"
                    required
                  />
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
                  onClick={() => navigate('/contacts')}
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
                    Enviar
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
                message: 'Mensagem enviada com sucesso!'
              })}
            </>
          )}
          {showError && (
            <>
              <ToastAnimated />
              {showToast({
                type: 'error',
                message:
                  'Ocorreu um erro ao enviar a mensagem. Tente novamente.'
              })}
            </>
          )}
        </form>
      )}
    </Formik>
  );
};

export default ClientContactCreate;
