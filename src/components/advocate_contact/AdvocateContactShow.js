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
  TextField,
  Typography
} from '@material-ui/core';
import { Formik } from 'formik';
import { filter, first } from 'lodash';
import moment from 'moment';
import { useContext, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { UserContext } from 'src/contexts/UserContext';
import AdvocateAnswerSchema from 'src/schemas/AdvocateAnswerSchema';
import { API } from 'src/services/api';
import ToastAnimated, { showToast } from '../Toast';

const AdvocateContactShow = () => {
  const navigate = useNavigate();
  const { client } = useLocation().state;
  const { data } = useContext(UserContext);

  const [newClient, setNewClient] = useState(client);
  const [rows, setRows] = useState(client.messages);
  const [submitting, setSubmitting] = useState(false);
  const [submittingDelete, setSubmittingDelete] = useState(false);

  const [messageSelected, setMessageSelected] = useState(false);
  const [messageClicked, setMessageClicked] = useState(null);
  const [reply, setReply] = useState(false);

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
  async function getMessages() {
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
          setNewClient(foundCard);
          setRows(foundCard.messages);
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
      message_received_id: messageClicked.id
    };

    await API.post('advocates/messages/answers', params, config)
      .then(() => {
        showSuccess.current = true;
        getMessages();
      })
      .catch(() => {
        showSuccess.current = false;
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
        getMessages();
        showSuccessDelete.current = true;
      })
      .catch((err) => {
        console.log(err);
        showErrorDelete.current = true;
      });
    setSubmittingDelete(false);
  }

  /**
   * Envia os dados do formulário
   * @param {*} values
   */
  const handleSubmit = (values) => {
    sendAnswer(values);
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
                <Grid sx={{ marginTop: 2 }}>
                  <Grid container spacing={3} item xs={12} sm={12}>
                    <Grid container item xs={6} sm={6}>
                      <Card cursor="pointer" sx={{ minWidth: 595 }}>
                        {rows.map((message) => (
                          <>
                            <Divider />
                            <CardContent
                              onClick={() => {
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
                      <Grid
                        container
                        item
                        xs={6}
                        sm={6}
                        style={{ marginTop: `${reply ? '-280px' : '0px'}` }}
                      >
                        {messageClicked.answers.length > 0 &&
                          messageClicked.answers.map((answer) => (
                            <Box>
                              <Typography variant="h3">
                                {`RES: ${messageClicked.subject}`}
                              </Typography>
                              <Divider />
                              <Card sx={{ minWidth: 595 }}>
                                <Divider />
                                <CardContent>
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
                                    {`Para: ${data.email}`}
                                  </Typography>
                                  <br />
                                  <Typography variant="body2">
                                    {answer.answer}
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
                          ))}
                        <Box>
                          <Typography variant="h3">
                            {messageClicked.subject}
                          </Typography>
                          <Divider />
                          <Card sx={{ minWidth: 595 }}>
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
