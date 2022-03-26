import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography
} from '@material-ui/core';
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import { Formik } from 'formik';
import moment from 'moment';
import { useContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from 'src/contexts/UserContext';
import ClientAnswerSchema from 'src/schemas/ClientAnswerSchema';
import { API } from 'src/services/api';
import ToastAnimated, { showToast } from '../Toast';

const ClientContactShow = (messages) => {
  const { data } = useContext(UserContext);
  const navigate = useNavigate();

  const [rows, setRows] = useState(messages.messages);
  const [messageSelected, setMessageSelected] = useState(false);
  const [messageClicked, setMessageClicked] = useState(null);
  const [clickedCard, setClickedCard] = useState([]);
  const [changeColorCard, setChangeColorCard] = useState(
    Array(messages.messages.length).fill(false)
  );
  const [submitting, setSubmitting] = useState(false);
  const [reply, setReply] = useState(false);

  const showSuccess = useRef(false);
  const showError = useRef(false);

  /**
   * Obtém as informações das mensagens
   */
  async function getMessages() {
    const config = {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
      }
    };
    await API.get(
      `clients/messages/received?client_id=${data.client.id}`,
      config
    )
      .then((response) => {
        setMessageSelected(true);
        setMessageClicked(messageClicked);
        setRows(response.data.data);
      })
      .catch((err) => console.error(err));
  }

  /* Envia os dados do advogado
   * @param {*} values
   */
  async function sendAnswer(values) {
    showSuccess.current = false;
    setMessageSelected(false);

    setSubmitting(true);
    const config = {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
      }
    };

    const params = {
      answer: values.answer,
      code_message: messageClicked.code_message,
      message_received_id: messageClicked.id,
      advocate_user_id: messageClicked.advocate.id,
      response_client: true,
      response_advocate: false
    };

    await API.post('advocates/messages/answers', params, config)
      .then(() => {
        showSuccess.current = true;
        getMessages();
      })
      .catch((e) => {
        showError.current = true;
        console.log(e);
      });
    setSubmitting(false);
  }

  const handleSubmit = (values) => {
    sendAnswer(values);
  };

  const changeColor = (index) => {
    const newArray = [];
    changeColorCard.map((card, indexCard) => {
      newArray[indexCard] = false;
      if (indexCard === index) {
        newArray[indexCard] = true;
      }
    });
    setChangeColorCard(newArray);
  };

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
        py: 3
      }}
    >
      <>
        <Formik
          initialValues={{
            answer: ''
          }}
          validationSchema={ClientAnswerSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, values, handleBlur, handleChange, submitForm }) => (
            <form
              autoComplete="off"
              onSubmit={(e) => {
                e.preventDefault();
                showSuccess.current = false;
                showError.current = false;
                handleSubmit(values);
              }}
            >
              <Grid>
                <Grid container spacing={3} item xs={12} sm={12}>
                  <Grid container item xs={6} sm={6}>
                    <Card cursor="pointer" sx={{ minWidth: 595 }}>
                      <CardHeader title="Mensagens Enviadas" />
                      <Divider />
                      {rows.map((message, indexMessage) => (
                        <>
                          <Divider />
                          <CardContent
                            style={{
                              backgroundColor: changeColorCard[indexMessage]
                                ? '#f6f6f6'
                                : 'white'
                            }}
                            onClick={() => {
                              changeColor(indexMessage);
                              setClickedCard(
                                Array(message.answers.length).fill(false)
                              );
                              setMessageClicked(message);
                              setReply(false);
                              setMessageSelected(true);
                              showSuccess.current = false;
                              showError.current = false;
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
                              <span>{data.client.name}&nbsp;-&nbsp;</span>
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
                        onClick={() => {
                          showSuccess.current = false;
                          showError.current = false;
                          navigate('/dashboard/client');
                        }}
                      >
                        Voltar
                      </Button>
                    </Box>
                  </Grid>
                  <Grid container item xs={6} sm={6}>
                    {reply && (
                      <>
                        <Grid container item xs={6} sm={6}>
                          <Box>
                            <Typography variant="body2">
                              {`Para: ${messageClicked.advocate.name} <${messageClicked.advocate.email}>`}
                            </Typography>
                            <Divider />
                            <Card sx={{ width: 595 }}>
                              <CardContent>
                                <Grid item md={12} xs={12} spacing={3}>
                                  <TextField
                                    error={errors.answer}
                                    fullWidth
                                    helperText={errors.answer}
                                    label="Resposta:"
                                    onBlur={(event) => {
                                      handleBlur(event);
                                    }}
                                    onChange={(event) => {
                                      handleChange(event);
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
                                {submitting ? (
                                  <Button
                                    color="primary"
                                    variant="contained"
                                    disabled
                                    size="small"
                                  >
                                    Carregando..
                                  </Button>
                                ) : (
                                  <Button
                                    color="primary"
                                    variant="contained"
                                    size="small"
                                    onClick={submitForm}
                                  >
                                    Enviar
                                  </Button>
                                )}
                                <Button
                                  color="primary"
                                  variant="outlined"
                                  size="small"
                                  onClick={() => {
                                    showSuccess.current = false;
                                    showError.current = false;
                                    setReply(false);
                                  }}
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
                      <Grid
                        item
                        xs={3}
                        sm={3}
                        style={{ marginTop: `${reply ? '12px' : '0px'}` }}
                      >
                        <Box>
                          <Card sx={{ minWidth: 595 }}>
                            <CardHeader
                              style={{ cursor: 'pointer', color: 'primary' }}
                              title={messageClicked.subject}
                            />
                            <Divider />
                            <CardContent>
                              <Typography variant="h5" component="div">
                                <span>{`${data.client.name} <${data.client.email}>`}</span>
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
                              <Typography variant="body2">De: Você</Typography>
                              <Typography variant="body2" color="primary">
                                {`Para: ${messageClicked.advocate.email} - Advogado(a)`}
                              </Typography>
                              <br />
                              <Typography variant="body2">
                                <b>Mensagem:</b>
                              </Typography>
                              <Typography variant="body2">
                                {messageClicked.message}
                              </Typography>
                            </CardContent>
                            <CardActions>
                              {messageClicked.response_advocate === true && (
                                <Button
                                  color="primary"
                                  variant="contained"
                                  disabled={reply}
                                  size="small"
                                  onClick={() => {
                                    showSuccess.current = false;
                                    showError.current = false;
                                    setReply(true);
                                  }}
                                >
                                  Responder
                                </Button>
                              )}
                            </CardActions>
                          </Card>
                        </Box>

                        {messageClicked.answers.length > 0 &&
                          messageClicked.answers.map((answer, index) => (
                            <Box>
                              <Card sx={{ minWidth: 595, marginTop: '12px' }}>
                                <CardHeader
                                  onClick={() => {
                                    showSuccess.current = false;
                                    showError.current = false;
                                    clickedCard[index]
                                      ? setClickedCard({
                                          ...clickedCard,
                                          [index]: false
                                        })
                                      : setClickedCard({
                                          ...clickedCard,
                                          [index]: true
                                        });
                                  }}
                                  style={{
                                    cursor: 'pointer',
                                    color: 'primary'
                                  }}
                                  title={`RES: ${
                                    messageClicked.subject
                                  } - ${moment(answer.created_at).format(
                                    'DD/MM/YYYY'
                                  )} ás ${moment(answer.created_at).format(
                                    'H:s'
                                  )}`}
                                  action={
                                    <div>
                                      <IconButton aria-label="settings">
                                        {clickedCard[index] ? (
                                          <KeyboardArrowUp
                                            onClick={() => {
                                              showSuccess.current = false;
                                              showError.current = false;
                                              setClickedCard({
                                                ...clickedCard,
                                                [index]: false
                                              });
                                            }}
                                          />
                                        ) : (
                                          <KeyboardArrowDown
                                            onClick={() => {
                                              showSuccess.current = false;
                                              showError.current = false;
                                              setClickedCard({
                                                ...clickedCard,
                                                [index]: true
                                              });
                                            }}
                                          />
                                        )}
                                      </IconButton>
                                    </div>
                                  }
                                />
                                <CardContent
                                  style={{
                                    paddingTop: '0px',
                                    display: clickedCard[index]
                                      ? 'block'
                                      : 'none'
                                  }}
                                >
                                  <Typography
                                    sx={{ fontSize: 14 }}
                                    color="text.secondary"
                                    gutterBottom
                                  >
                                    {`${moment(answer.created_at).format(
                                      'DD/MM/YYYY'
                                    )} ás ${moment(answer.created_at).format(
                                      'H:s'
                                    )}`}
                                  </Typography>
                                  <Typography variant="body2" color="primary">
                                    {`De: ${messageClicked.advocate.name}<${messageClicked.advocate.email}>`}
                                  </Typography>
                                  <Typography variant="body2">
                                    Para: Você
                                  </Typography>
                                  <br />
                                  <Typography variant="body2">
                                    <b>Mensagem:</b>
                                  </Typography>
                                  <Typography variant="body2">
                                    {answer.answer}
                                  </Typography>

                                  <Button
                                    style={{ marginTop: '24px' }}
                                    color="primary"
                                    variant="contained"
                                    disabled={reply}
                                    size="small"
                                    onClick={() => {
                                      showSuccess.current = false;
                                      showError.current = false;
                                      setReply(true);
                                    }}
                                  >
                                    Responder
                                  </Button>
                                </CardContent>
                              </Card>
                            </Box>
                          ))}
                      </Grid>
                    ) : (
                      <Grid container item xs={6} sm={6}>
                        <Container maxWidth="md">
                          <Box sx={{ textAlign: 'center' }}>
                            <img
                              alt="Under development"
                              src="/static/message.png"
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
              </Grid>
            </form>
          )}
        </Formik>
        {showSuccess.current && (
          <>
            <ToastAnimated />
            {showToast({
              type: 'success',
              message: 'Mensagem respondida com sucesso!'
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
      </>
    </Box>
  );
};

export default ClientContactShow;
