import {
  Box,
  Button,
  CardActions,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  TextField,
  Typography
} from '@material-ui/core';
import { Formik } from 'formik';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { useContext, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { UserContext } from 'src/contexts/UserContext';
import AdvocateAnswerSchema from 'src/schemas/AdvocateAnswerSchema';
import { API } from 'src/services/api';
import ToastAnimated, { showToast } from '../Toast';

const AdvocateContactShow = () => {
  const navigate = useNavigate();
  const { client, messages } = useLocation().state;
  const { data } = useContext(UserContext);

  const [submitting, setSubmitting] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [messageSelected, setMessageSelected] = useState(false);
  const [messageClicked, setMessageClicked] = useState(null);
  const [reply, setReply] = useState(false);

  const showSuccess = useRef(false);
  const showError = useRef(false);

  /**
   * Envia os dados do advogado
   * @param {*} values
   */
  async function sendMessage(values) {
    console.log(submitting);
    console.log(showAnswer);
    setShowAnswer(false);
    setMessageSelected(false);

    setSubmitting(true);
    const config = {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
      }
    };

    const params = {
      sender_name: messageSelected.recipient_name,
      recipient_name: messageSelected.sender_name,
      recipient_email: data.email,
      subject: messageSelected.subject,
      message: values.answer,
      read: 1,
      client_sent: false,
      advocate_sent: true,
      user_id: messageSelected.user_id
    };

    console.log('params', params);

    await API.post('messages', params, config)
      .then(() => {
        showSuccess.current = true;
      })
      .catch(() => {
        showSuccess.current = false;
        showError.current = true;
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

  return (
    <>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          m: 3
        }}
      >
        <Card sx={{ minWidth: 500 }}>
          <CardHeader title="Lista de mensagens" />
          <Divider />
        </Card>
        <>
          <Formik
            initialValues={{
              answer: ''
            }}
            validationSchema={AdvocateAnswerSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, values, handleBlur, handleChange }) => (
              <form
                autoComplete="off"
                onSubmit={(e) => {
                  e.preventDefault();
                  showSuccess.current = false;
                  showError.current = false;
                  handleSubmit(values, errors);
                }}
              >
                <Grid sx={{ marginTop: 2 }}>
                  <Grid container spacing={3} item xs={12} sm={12}>
                    <Grid container item xs={6} sm={6}>
                      <Card cursor="pointer" sx={{ minWidth: 595 }}>
                        {messages.map((message) => (
                          <>
                            <Divider />
                            <CardContent
                              onClick={() => {
                                setMessageClicked(message);
                                setReply(false);
                                setMessageSelected(true);
                              }}
                            >
                              <Typography
                                style={{
                                  display: 'flex',
                                  alignItems: 'left',
                                  marginBottom: '15px'
                                }}
                                variant="h5"
                                component="div"
                              >
                                <span>{client.name}&nbsp;-&nbsp;</span>
                                <Typography color="text.secondary" variant="h5">
                                  {moment(message.created_at).format(
                                    'DD/MM/YYYY H:s'
                                  )}
                                </Typography>
                              </Typography>
                              <Typography
                                sx={{ fontSize: 14 }}
                                color="text.secondary"
                                gutterBottom
                              >
                                {`Assunto: ${message.subject}`}
                              </Typography>
                              <Typography variant="body2">
                                {`${message.message.substring(0, 10)}...`}{' '}
                              </Typography>
                            </CardContent>
                          </>
                        ))}
                      </Card>
                      <Box
                        sx={{
                          marginTop: 2
                        }}
                      >
                        <Button
                          color="primary"
                          variant="outlined"
                          onClick={() => navigate('/advocate/contacts')}
                        >
                          Voltar
                        </Button>
                      </Box>
                    </Grid>
                    {reply && (
                      <>
                        <Grid container item xs={6} sm={6}>
                          <Box>
                            <Typography variant="body2">
                              {`Para: ${client.name} <${client.email}>`}
                            </Typography>
                            <Divider />
                            <Card sx={{ width: 595 }}>
                              <CardContent>
                                <Grid item md={12} xs={12} spacing={3}>
                                  <TextField
                                    fullWidth
                                    label="Resposta:"
                                    onBlur={(event) => {
                                      handleBlur(event);
                                      showSuccess.current = false;
                                    }}
                                    onChange={(event) => {
                                      console.log('aqui');
                                      handleChange(event);
                                      showSuccess.current = false;
                                    }}
                                    multiline
                                    value={values.answer}
                                    placeholder="Resposta:"
                                    name="answer"
                                    inputProps={{ style: { height: '150px' } }}
                                  />
                                </Grid>
                              </CardContent>
                              <CardActions>
                                <Button
                                  color="primary"
                                  variant="contained"
                                  size="small"
                                >
                                  Enviar
                                </Button>
                                <Button
                                  color="primary"
                                  variant="outlined"
                                  size="small"
                                >
                                  Descartar
                                </Button>
                              </CardActions>
                            </Card>
                          </Box>
                        </Grid>
                        <Grid container item xs={6} sm={6}></Grid>
                      </>
                    )}
                    {messageSelected ? (
                      <Grid container item xs={6} sm={6}>
                        <Box>
                          <Typography variant="h3">
                            {messageClicked.subject}
                          </Typography>
                          <Divider />
                          <Card sx={{ minWidth: 595 }}>
                            <Divider />
                            <CardContent>
                              <Typography variant="h5" component="div">
                                <span>{`${client.name} <${client.email}>`}</span>
                              </Typography>
                              <Typography
                                sx={{ fontSize: 14 }}
                                color="text.secondary"
                                gutterBottom
                              >
                                {`${moment(messageClicked.created_at).format(
                                  'DD/MM/YYYY'
                                )} ás ${moment(
                                  messageClicked.created_at
                                ).format('H:s')}`}
                              </Typography>
                              <Typography variant="body2">
                                {`Para: ${data.email}`}
                              </Typography>
                              <br />
                              <Typography variant="body2">
                                {messageClicked.message}
                              </Typography>
                            </CardContent>
                            <CardActions>
                              <Button
                                color="primary"
                                variant="contained"
                                disabled={reply}
                                size="small"
                                onClick={() => setReply(true)}
                              >
                                Responder
                              </Button>
                              <Button
                                color="error"
                                variant="contained"
                                size="small"
                              >
                                Excluir
                              </Button>
                            </CardActions>
                          </Card>
                        </Box>
                      </Grid>
                    ) : (
                      <Grid container item xs={6} sm={6}>
                        <Container maxWidth="md">
                          <Box sx={{ textAlign: 'center' }}>
                            <img
                              alt="Under development"
                              src="/static/images/message.png"
                              style={{
                                marginTop: 50,
                                display: 'inline-block',
                                maxWidth: '100%',
                                width: 100
                              }}
                            />
                          </Box>
                          <Typography
                            align="center"
                            color="textPrimary"
                            variant="h4"
                          >
                            Selecione um item para ler
                          </Typography>
                          <Typography
                            align="center"
                            color="textPrimary"
                            variant="h5"
                          >
                            Nada foi selecionado
                          </Typography>
                        </Container>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </form>
            )}
          </Formik>
        </>
        {showSuccess.current && (
          <>
            <ToastAnimated />
            {showToast({
              type: 'success',
              message: 'Mensagem enviada com sucesso!'
            })}
          </>
        )}
        {showError.current && (
          <>
            <ToastAnimated />
            {showToast({
              type: 'error',
              message: 'Ocorreu um erro inesperado ao responder a mensagem!'
            })}
          </>
        )}
      </Box>
    </>
  );
};

export default AdvocateContactShow;
