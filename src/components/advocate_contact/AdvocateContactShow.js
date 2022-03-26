import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography
} from '@material-ui/core';
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import { Formik } from 'formik';
import { filter, first } from 'lodash';
import moment from 'moment';
import { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import AdvocateAnswerSchema from 'src/schemas/AdvocateAnswerSchema';
import { API } from 'src/services/api';
import ToastAnimated, { showToast } from '../Toast';

const AdvocateContactShow = () => {
  const navigate = useNavigate();
  const { client } = useLocation().state;

  const [newClient, setNewClient] = useState(client);
  const [rows, setRows] = useState(client.messages);
  const [submitting, setSubmitting] = useState(false);
  const [submittingDelete, setSubmittingDelete] = useState(false);

  const [messageSelected, setMessageSelected] = useState(false);
  const [messageClicked, setMessageClicked] = useState(null);
  const [reply, setReply] = useState(false);

  const [clickedCard, setClickedCard] = useState([]);
  const [changeColorCard, setChangeColorCard] = useState(
    Array(client.messages.length).fill(false)
  );

  const [selectedMessageId, setSelectedMessageId] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const showDeleteSuccess = useRef(false);
  const showDeleteError = useRef(false);

  const showSuccess = useRef(false);
  const showError = useRef(false);

  /**
   * Atualiza a página depois de um tempo
   */
  const callTimeOut = () => {
    setTimeout(() => navigate('/advocate/contacts'), 500);
  };

  const handleClose = () => {
    setShowDeleteModal(false);
  };

  /**
   * Obtém as informações das mensagens
   */
  async function getMessages() {
    showSuccess.current = false;

    const config = {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
      }
    };
    await API.get(`advocates/messages/received`, config)
      .then((response) => {
        const responseMessage = response.data.data;

        const foundCard = first(
          filter(responseMessage, function filterMessage(row) {
            return row.id === client.id;
          })
        );

        if (foundCard === undefined) {
          return (
            <>
              <ToastAnimated />
              {showToast({
                type: 'success',
                message: 'Mensagem deletada com sucesso!'
              })}
              {callTimeOut()}
            </>
          );
        } else {
          setRows(foundCard.messages);
          setNewClient(foundCard);
          setMessageSelected(true);
          setMessageClicked(messageClicked);
        }

        return null;
      })
      .catch((err) => console.error(err));
  }

  /**
   * Envia os dados do advogado
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
      response_advocate: true,
      response_client: false
    };

    await API.post('advocates/messages/answers', params, config)
      .then(() => {
        showSuccess.current = true;
      })
      .catch(() => {
        showError.current = true;
        showSuccess.current = false;
      });
    setSubmitting(false);
  }

  /**
   * Envia os dados do advogado
   * @param {*} values
   */
  async function deleteMessageReceived() {
    showDeleteSuccess.current = false;
    setSubmittingDelete(true);

    const token = window.localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    const values = {
      id: selectedMessageId,
      client_id: newClient.id
    };

    await API.post(`advocates/messages/received/destroy`, values, config)
      .then(() => {
        showDeleteSuccess.current = true;
      })
      .catch((err) => {
        showDeleteSuccess.current = false;
        showDeleteError.current = true;
        console.log(err);
      });
    setSubmittingDelete(false);
  }

  const getMarginTop = () => {
    if (reply) {
      if (messageClicked.answers.length === 0) {
        return '0px';
      } else {
        return '12px';
      }
    }
    return '0px';
  };

  /**
   * Envia os dados do formulário
   * @param {*} values
   */
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

  /**
   *  Atualiza a tela com as mensagens
   */
  const callSubmit = () => {
    setTimeout(() => {
      showSuccess.current = false;
      setReply(false);
      getMessages();
    }, 1000);
  };

  /**
   * Atualiza a tela com as mensagens
   */
  const callSubmitDelete = () => {
    setTimeout(() => {
      showDeleteSuccess.current = false;
      getMessages();
    }, 1000);
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
        <>
          <Formik
            initialValues={{
              answer: ''
            }}
            validationSchema={AdvocateAnswerSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, values, handleBlur, handleChange }) => (
              <form autoComplete="off">
                <Stack direction="row" spacing={2}>
                  <Button
                    color="primary"
                    variant="outlined"
                    onClick={() => navigate('/advocate/contacts')}
                  >
                    Voltar
                  </Button>
                </Stack>
                <Grid sx={{ marginTop: 2 }}>
                  <Grid container spacing={3} item xs={12} sm={12}>
                    <Grid container item xs={6} sm={6}>
                      <Card cursor="pointer" sx={{ minWidth: 595 }}>
                        <CardHeader title="Mensagens Recebidas" />
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
                                showDeleteSuccess.current = false;
                                showDeleteError.current = false;
                                showError.current = false;
                                showSuccess.current = false;
                                changeColor(indexMessage);
                                setClickedCard(
                                  Array(message.answers.length).fill(false)
                                );
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
                                <span>{newClient.name}&nbsp;-&nbsp;</span>
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
                              <CardActions
                                style={{
                                  justifyContent: 'flex-end'
                                }}
                              >
                                {submittingDelete ? (
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
                                    onClick={() => {
                                      showDeleteSuccess.current = false;
                                      showDeleteError.current = false;
                                      showError.current = false;
                                      showSuccess.current = false;
                                      setSelectedMessageId(message.id);
                                      setShowDeleteModal(true);
                                    }}
                                    color="error"
                                    variant="contained"
                                    size="small"
                                  >
                                    Excluir
                                  </Button>
                                )}
                              </CardActions>
                            </CardContent>
                          </>
                        ))}
                      </Card>
                    </Grid>
                    <Grid container item xs={6} sm={6} style={{}}>
                      {reply && (
                        <>
                          <Grid container item xs={6} sm={6}>
                            <Box>
                              <Typography variant="body2">
                                {`Para: ${newClient.name} <${newClient.email}>`}
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
                                      inputProps={{
                                        style: { height: '150px' }
                                      }}
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
                                      onClick={(e) => {
                                        showDeleteSuccess.current = false;
                                        showDeleteError.current = false;
                                        showError.current = false;
                                        showSuccess.current = false;
                                        e.preventDefault();
                                        handleSubmit(values);
                                      }}
                                    >
                                      Enviar
                                    </Button>
                                  )}
                                  <Button
                                    color="primary"
                                    variant="outlined"
                                    size="small"
                                    onClick={() => {
                                      showDeleteSuccess.current = false;
                                      showDeleteError.current = false;
                                      showError.current = false;
                                      showSuccess.current = false;
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
                        <Grid item xs={3} sm={3}>
                          <Box>
                            <Card
                              sx={{
                                minWidth: 595,
                                marginTop: getMarginTop()
                              }}
                            >
                              <CardHeader
                                style={{ cursor: 'pointer', color: 'primary' }}
                                title={messageClicked.subject}
                              />
                              <Divider />
                              <CardContent>
                                <Typography variant="h5" component="div">
                                  <span>{`${newClient.name} <${newClient.email}>`}</span>
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
                                <Typography variant="body2" color="primary">
                                  {`De: ${newClient.email}`}
                                </Typography>
                                <Typography variant="body2">
                                  Para: Você
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
                                <Button
                                  color="primary"
                                  variant="contained"
                                  disabled={reply}
                                  size="small"
                                  onClick={() => {
                                    showDeleteSuccess.current = false;
                                    showDeleteError.current = false;
                                    showError.current = false;
                                    showSuccess.current = false;
                                    setReply(true);
                                  }}
                                >
                                  Responder
                                </Button>
                              </CardActions>
                            </Card>
                          </Box>
                          {messageClicked.answers.length > 0 &&
                            messageClicked.answers.map((answer, index) => (
                              <Box>
                                <Card
                                  sx={{
                                    minWidth: 595,
                                    marginTop: '12px'
                                  }}
                                >
                                  <CardHeader
                                    onClick={() => {
                                      showDeleteSuccess.current = false;
                                      showDeleteError.current = false;
                                      showError.current = false;
                                      showSuccess.current = false;
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
                                    style={{ cursor: 'pointer' }}
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
                                                showDeleteSuccess.current = false;
                                                showDeleteError.current = false;
                                                showError.current = false;
                                                showSuccess.current = false;
                                                setClickedCard({
                                                  ...clickedCard,
                                                  [index]: false
                                                });
                                              }}
                                            />
                                          ) : (
                                            <KeyboardArrowDown
                                              onClick={() => {
                                                showDeleteSuccess.current = false;
                                                showDeleteError.current = false;
                                                showError.current = false;
                                                showSuccess.current = false;
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
                                    <Typography variant="body2">
                                      {`${
                                        answer.response_advocate
                                          ? `De: Você`
                                          : `De: ${newClient.email} - Cliente`
                                      }`}
                                    </Typography>
                                    <Typography variant="body2" color="primary">
                                      {`${
                                        answer.response_advocate
                                          ? `Para: ${newClient.email}`
                                          : `De: ${newClient.email}`
                                      }`}
                                    </Typography>
                                    <br />
                                    <Typography variant="body2">
                                      <b>Mensagem:</b>
                                    </Typography>
                                    <Typography variant="body2">
                                      {answer.answer}
                                    </Typography>
                                  </CardContent>
                                  <CardActions>
                                    {answer.response_client === true && (
                                      <Button
                                        color="primary"
                                        variant="contained"
                                        disabled={reply}
                                        size="small"
                                        hidden={answer.response_advocate}
                                        onClick={() => {
                                          showDeleteSuccess.current = false;
                                          showDeleteError.current = false;
                                          showError.current = false;
                                          showSuccess.current = false;
                                          setReply(true);
                                        }}
                                      >
                                        Responder
                                      </Button>
                                    )}
                                  </CardActions>
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
                                src="https://advoguez-images.s3.sa-east-1.amazonaws.com/message.png"
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
        </>
        {showDeleteModal && (
          <div>
            <Dialog
              open={showDeleteModal}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                <Typography color="primary" variant="h5" textAlign="center">
                  Confirmar exclusão?
                </Typography>
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Todas as mensagens incluindo as respostas serão deletadas,
                  essa ação é irreversivel. Tem certeza que deseja excluir ?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    showDeleteSuccess.current = false;
                    showDeleteError.current = false;
                    showError.current = false;
                    showSuccess.current = false;
                    handleClose();
                    deleteMessageReceived();
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
      </Box>
      {showSuccess.current && (
        <>
          <ToastAnimated />
          {showToast({
            type: 'success',
            message: 'Mensagem respondida com sucesso!'
          })}
          {callSubmit()}
        </>
      )}
      {showDeleteSuccess.current && (
        <>
          <ToastAnimated />
          {showToast({
            type: 'success',
            message: 'Mensagem deletada com sucesso!'
          })}
          {callSubmitDelete()}
        </>
      )}
      {showDeleteError.current && (
        <>
          <ToastAnimated />
          {showToast({
            type: 'error',
            message: 'Ocorreu um erro inesperado ao deletar a mensagem!'
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
  );
};

export default AdvocateContactShow;
