import {
  Box,
  Button,
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
  const { messages } = useLocation().state;
  const { data } = useContext(UserContext);

  const [submitting, setSubmitting] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [messageSelected, setMessageSelected] = useState(false);

  const showSuccess = useRef(false);
  const showError = useRef(false);

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
          display: 'flex',
          justifyContent: 'left',
          p: 2,
          ml: 2
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
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        {messages.map((message) => (
          <>
            <Formik
              initialValues={{
                answer: ''
              }}
              validationSchema={AdvocateAnswerSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, handleBlur, handleChange, values, submitForm }) => (
                <form
                  autoComplete="off"
                  onSubmit={(e) => {
                    e.preventDefault();
                    showSuccess.current = false;
                    showError.current = false;
                    handleSubmit(values, errors);
                  }}
                >
                  <Container>
                    <Card variant="outlined">
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-start'
                        }}
                      >
                        {submitting ? (
                          <Button
                            sx={{ mt: 2, ml: 2 }}
                            color="primary"
                            variant="contained"
                            disabled
                          >
                            Carregando..
                          </Button>
                        ) : (
                          <Button
                            sx={{ mt: 2, ml: 2 }}
                            color="primary"
                            variant="contained"
                            type="submit"
                            onClick={() => {
                              setShowAnswer(true);
                              setMessageSelected(message);
                              submitForm(message);
                            }}
                          >
                            {`${showAnswer ? 'Enviar Resposta' : 'Responder'}`}
                          </Button>
                        )}
                        <Button
                          sx={{ mx: 1, mt: 2, mr: 2 }}
                          color="secondary"
                          variant="outlined"
                          onClick={() => navigate('/advocate/contacts')}
                        >
                          Excluir
                        </Button>
                      </Box>

                      {showAnswer && (
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            p: 3
                          }}
                        >
                          <Grid item md={12} xs={12}>
                            <TextField
                              error={errors.answer}
                              fullWidth
                              helperText={errors.answer}
                              label="Resposta"
                              multiline
                              rowsMax={Infinity}
                              onBlur={(event) => {
                                handleBlur(event);
                              }}
                              onChange={(event) => {
                                handleChange(event);
                              }}
                              placeholder="Resposta:"
                              name="answer"
                              required
                            />
                          </Grid>
                        </Box>
                      )}
                      <CardHeader
                        title={`Enviada no dia ${moment(
                          message.created_at
                        ).format('DD-MM-YYYY')} ás ${moment(
                          message.created_at
                        ).format('hh:mm')}`}
                      />
                      <Divider />
                      <CardContent sx={{ mb: 4 }}>
                        <Grid item md={12} xs={12}>
                          <Typography
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              marginBottom: '15px'
                            }}
                            variant="h5"
                            component="div"
                          >
                            <span>Remetente:&nbsp;</span>
                            <Typography variant="h5" color="text.secondary">
                              {' '}
                              {message.sender_name}
                            </Typography>
                          </Typography>
                        </Grid>
                        <Grid item md={12} xs={12}>
                          <Typography
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              marginBottom: '15px'
                            }}
                            variant="h5"
                            component="div"
                          >
                            <span>Destinatário:&nbsp;</span>
                            <Typography color="text.secondary" variant="h5">
                              {message.recipient_name}
                            </Typography>
                          </Typography>
                        </Grid>
                        <Grid item md={12} xs={12}>
                          <Typography
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              marginBottom: '15px'
                            }}
                            variant="h5"
                            component="div"
                          >
                            <span>Email do destinatário:&nbsp;</span>
                            <Typography color="text.secondary" variant="h5">
                              {message.recipient_email}
                            </Typography>
                          </Typography>
                        </Grid>
                        <Grid item md={12} xs={12}>
                          <Typography
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              marginBottom: '15px'
                            }}
                            variant="h5"
                            component="div"
                          >
                            <span>Assunto:&nbsp;</span>
                            <Typography color="text.secondary" variant="h5">
                              {message.subject}
                            </Typography>
                          </Typography>
                        </Grid>
                        <Grid item md={12} xs={12} spacing={3}>
                          <Typography
                            variant="h5"
                            component="div"
                            style={{
                              marginBottom: '15px'
                            }}
                          >
                            Mensagem:
                          </Typography>
                          <Typography color="text.secondary" variant="h5">
                            {message.message}
                          </Typography>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Container>
                </form>
              )}
            </Formik>
          </>
        ))}
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
