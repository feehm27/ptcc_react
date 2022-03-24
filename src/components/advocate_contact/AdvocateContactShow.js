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
import { useRef, useState } from 'react';
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

  const showSuccess = useRef(false);
  const showError = useRef(false);

  const showSuccessDelete = useRef(false);
  const showErrorDelete = useRef(false);

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
  async function getMessages(isDelete) {
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

          if (isDelete) {
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
          }
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
        getMessages();
      })
      .catch(() => {
        showError.current = true;
      });
    setSubmitting(false);
  }

  /**
   * Envia os dados do advogado
   * @param {*} values
   */
  async function deleteMessageReceived() {
    setSubmittingDelete(true);
    showSuccessDelete.current = false;

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
        getMessages(true);
      })
      .catch((err) => {
        console.log(err);
        showErrorDelete.current = true;
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
            {({ errors, values, handleBlur, handleChange, submitForm }) => (
              <form
                autoComplete="off"
                onSubmit={(e) => {
                  e.preventDefault();
                  showSuccess.current = false;
                  showError.current = false;
                  showSuccessDelete.current = false;
                  showErrorDelete.current = false;
                  handleSubmit(values);
                }}
              >
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
                                changeColor(indexMessage);
                                setClickedCard(
                                  Array(message.answers.length).fill(false)
                                );
                                setMessageClicked(message);
                                setReply(false);
                                setMessageSelected(true);
                                showSuccessDelete.current = false;
                                showErrorDelete.current = false;
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
                                      showError.current = false;
                                      showSuccess.current = false;
                                      showSuccessDelete.current = false;
                                      showErrorDelete.current = false;
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
                                        showSuccess.current = false;
                                        showError.current = false;
                                        showSuccessDelete.current = false;
                                        showErrorDelete.current = false;
                                      }}
                                      onChange={(event) => {
                                        handleChange(event);
                                        showSuccess.current = false;
                                        showError.current = false;
                                        showSuccessDelete.current = false;
                                        showErrorDelete.current = false;
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
                                      setReply(false);
                                      showSuccess.current = false;
                                      showError.current = false;
                                      showSuccessDelete.current = false;
                                      showErrorDelete.current = false;
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
                                    setReply(true);
                                    showSuccess.current = false;
                                    showError.current = false;
                                    showSuccessDelete.current = false;
                                    showErrorDelete.current = false;
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
                                          setReply(true);
                                          showSuccess.current = false;
                                          showError.current = false;
                                          showSuccessDelete.current = false;
                                          showErrorDelete.current = false;
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
        {showSuccessDelete.current && (
          <>
            <ToastAnimated />
            {showToast({
              type: 'success',
              message: 'Mensagem deletada com sucesso!'
            })}
          </>
        )}
        {showErrorDelete.current && (
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
      </Box>
    </>
  );
};

export default AdvocateContactShow;
