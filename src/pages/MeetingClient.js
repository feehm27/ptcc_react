import {
  Box,
  Button,
  Card,
  CardContent,
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
import { useContext, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router';
import MeetingClientManagement from 'src/components/meeting/MeetingClientManagement';
import MeetingListToolbar from 'src/components/meeting/MeetingListToolbar';
import { UserContext } from 'src/contexts/UserContext';
import { API } from 'src/services/api';
import ToastAnimated, { showToast } from 'src/components/Toast';

const MeetingClient = () => {
  const { data } = useContext(UserContext);
  const navigate = useNavigate();

  const [schedule, setSchedule] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [submittingCancel, setSubmittingCancel] = useState(false);

  const showSuccess = useRef(false);
  const showError = useRef(false);

  /**
   * Fecha o modal depois de um tempo
   */
  const callTimeOut = () => {
    setTimeout(() => setShowModal(false), 1500);
  };

  /**
   * Obtém as informações das mensagens
   */
  async function checkSchedule() {
    const config = {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
      }
    };
    await API.get(`clients/schedules/check?client_id=${data.client.id}`, config)
      .then((response) => {
        if (response.data.data !== null) {
          setSchedule(response.data.data);
          setShowModal(true);
        }
      })
      .catch((err) => console.error(err));
  }

  /**
   * Obtém as informações das mensagens
   */
  async function cancelMeeting() {
    setSubmittingCancel(true);
    showSuccess.current = false;
    showError.current = false;

    const config = {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
      }
    };

    const params = {
      date: schedule.date,
      horarys: JSON.parse(schedule.horarys),
      client_id: data.client.id,
      advocate_user_id: schedule.advocate_user_id
    };

    await API.post(`clients/schedules/cancel`, params, config)
      .then(() => {
        showSuccess.current = true;
        setShowModal(false);
      })
      .catch(() => {
        showError.current = true;
      });

    setSubmittingCancel(false);
  }

  const handleSubmit = () => {
    cancelMeeting();
  };
  /**
   * Use Effect
   */
  useEffect(() => {
    checkSchedule();
  }, []);

  return (
    <div style={{ marginLeft: '14px', marginTop: '14px' }}>
      <Helmet>
        <title>Advoguez</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        {showModal ? (
          <div>
            <Dialog
              fullWidth
              open={showModal}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                <Typography color="primary" variant="h5" textAlign="center">
                  Reunião Agendada Existente
                </Typography>
              </DialogTitle>
              <DialogContent>
                <Formik initialValues={{}} onSubmit={handleSubmit}>
                  {({ submitForm }) => (
                    <form
                      autoComplete="off"
                      onSubmit={(e) => {
                        e.preventDefault();
                        showSuccess.current = false;
                        showError.current = false;
                        handleSubmit();
                      }}
                    >
                      <Card>
                        <Divider />
                        <CardContent>
                          <DialogContentText id="alert-dialog-description">
                            Você já possui uma reunião agendada. Para agendar
                            uma nova reunião é necessário cancelar a reunião
                            abaixo.
                          </DialogContentText>
                          <Grid container spacing={12}>
                            <Grid item md={12} xs={12}>
                              <span
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <TextField
                                  variant="outlined"
                                  defaultValue={`${schedule.new_date} ás ${schedule.hours}`}
                                  disabled={true}
                                />

                                <Typography
                                  color="textPrimary"
                                  variant="h3"
                                  style={{
                                    marginLeft: '6px'
                                  }}
                                >
                                  {`com ${schedule.advocate.name}`}
                                </Typography>
                              </span>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                      <DialogActions sx={{ ml: 1 }}>
                        {submittingCancel ? (
                          <Button color="primary" variant="contained" disabled>
                            Carregando..
                          </Button>
                        ) : (
                          <Button
                            onClick={submitForm}
                            variant="contained"
                            color="error"
                          >
                            Cancelar Reunião
                          </Button>
                        )}
                        <Button
                          type="submit"
                          onClick={() => navigate('/dashboard/client')}
                          autoFocuscolor="primary"
                          variant="contained"
                        >
                          Manter Reunião
                        </Button>
                      </DialogActions>
                      {showSuccess.current && (
                        <>
                          <ToastAnimated />
                          {showToast({
                            type: 'success',
                            message: 'Reunião cancelada com sucesso!'
                          })}
                          {callTimeOut()}
                        </>
                      )}
                      {showError.current && (
                        <>
                          <ToastAnimated />
                          {showToast({
                            type: 'error',
                            message:
                              'Ocorreu um erro inesperado ao cancelar a reunião! Tente novamente mais tarde.'
                          })}
                        </>
                      )}
                    </form>
                  )}
                </Formik>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <Container maxWidth="lg">
            <MeetingListToolbar />
            <MeetingClientManagement />
          </Container>
        )}
      </Box>
    </div>
  );
};

export default MeetingClient;
