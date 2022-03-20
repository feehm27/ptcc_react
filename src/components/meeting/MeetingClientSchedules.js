import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  Skeleton,
  Stack,
  Typography
} from '@material-ui/core';
import { Formik } from 'formik';
import { findIndex, orderBy } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import SchedulesConstants from 'src/constants/SchedulesConstants';
import { API } from 'src/services/api';
import ToastAnimated, { showToast } from '../Toast';

const MeetingClientSchedules = () => {
  const navigate = useNavigate();

  const { day, datas, client } = useLocation().state;
  const [schedules, setSchedules] = useState(SchedulesConstants);
  const [submitting, setSubmitting] = useState(false);
  const [checkedsList, setCheckedsList] = useState(SchedulesConstants);
  const [loading, setLoading] = useState(true);

  const showSuccess = useRef(false);
  const showSuccessCancel = useRef(false);
  const showError = useRef(false);

  /**
   * Atualiza a página depois de um tempo
   */
  const callTimeOut = () => {
    setTimeout(() => navigate('/meetings/clients'), 1500);
  };

  const mountHours = () => {
    const newHours = [];

    datas.map((data) => {
      const hoursArray = JSON.parse(data.horarys);

      hoursArray.hours.forEach((hour) => {
        newHours.push({
          value: hour
        });
      });
    });

    const hours = orderBy(newHours, ['value'], ['asc']);
    setSchedules(hours);
  };

  /**
   * Obtém os horários com base no tipo de dia clicado
   */
  const getSchedules = () => {
    setLoading(true);
    mountHours();
    setLoading(false);
  };

  /**
   * Salva a configuração dos horários
   * @param {*} values
   */
  async function sendHours(params) {
    showSuccess.current = false;
    showError.current = false;

    const token = window.localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    await API.post(`clients/schedules`, params, config)
      .then(() => {
        showSuccess.current = true;
      })
      .catch((err) => {
        console.log(err);
        showError.current = true;
      });
    setSubmitting(false);
  }

  /**
   * Monta os parametros dos dias disponíveis
   */
  const sendTimesToSchedule = () => {
    setSubmitting(true);
    const hours = [];

    SchedulesConstants.map((schedule, index) => {
      if (checkedsList[index].value === schedule.value) {
        if (checkedsList[index].checked === true) hours.push(schedule.value);
      }
    });

    if (hours.length > 0) {
      const [newDay, month, year] = day.split('/');
      const formatDate = `${year}-${month}-${newDay}`;

      const params = {
        date: formatDate,
        horarys: { hours },
        time_type: 3,
        advocate_user_id: client.advocate_user_id,
        client_id: client.id
      };

      sendHours(params);
    }
  };

  const handleSubmit = () => {
    sendTimesToSchedule();
  };

  const getChecked = (schedule) => {
    const checkedsListArray = Object.values(checkedsList);
    const index = findIndex(checkedsListArray, { value: schedule.value });
    return checkedsListArray[index].checked;
  };

  const setChecked = (schedule, e) => {
    const index = findIndex(Object.values(checkedsList), {
      value: schedule.value
    });

    Object.values(checkedsList)[index].checked = e.target.checked;

    Object.values(checkedsList).map((checked) => {
      if (checked.value !== schedule.value) {
        checked.checked = false;
      }
    });
    setCheckedsList(Object.values(checkedsList));
  };
  /**
   * Use Effect
   */
  useEffect(() => {
    SchedulesConstants.map((schedule) => {
      schedule.checked = false;
    });
    getSchedules();
  }, []);

  return (
    <div style={{ marginLeft: '14px', marginTop: '14px' }}>
      <Formik initialValues={{}} onSubmit={handleSubmit}>
        {({ submitForm }) => (
          <form
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault();
              showSuccess.current = false;
              showError.current = false;
              showSuccessCancel.current = false;
              handleSubmit();
            }}
          >
            <Card>
              <CardHeader
                title={`Dia ${day} - Selecione um horário para agendamento`}
              />
              <Divider />
              {loading ? (
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  width="210"
                  height="118"
                >
                  <div style={{ paddingTop: '57%' }} />
                </Skeleton>
              ) : (
                <CardContent
                  style={{
                    columns: `${schedules.length > 5 ? '6 auto' : 'auto'}`,
                    marginRight: '10px'
                  }}
                >
                  {schedules.map((schedule) => (
                    <List
                      sx={{
                        width: '100%',
                        bgcolor: 'background.paper',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <ListItem>
                        <ListItemAvatar>
                          <Typography
                            style={{
                              ml: '10px'
                            }}
                          >
                            <Checkbox
                              checked={getChecked(schedule)}
                              color="primary"
                              onChange={(e) => {
                                setChecked(schedule, e);
                              }}
                            ></Checkbox>
                            {schedule.client_name !== undefined
                              ? `${schedule.value} - ${schedule.client_name}`
                              : schedule.value}
                          </Typography>
                        </ListItemAvatar>
                      </ListItem>
                      <Divider />
                    </List>
                  ))}
                </CardContent>
              )}
            </Card>
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
                  onClick={() => {
                    navigate('/meetings/clients');
                    setCheckedsList(SchedulesConstants);
                  }}
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
                    onClick={submitForm}
                    type="submit"
                  >
                    Salvar alterações
                  </Button>
                )}
              </Stack>
            </Box>
            {showSuccess.current && (
              <>
                <ToastAnimated />
                {showToast({
                  type: 'success',
                  message: 'Horário agendado com sucesso!'
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
                    'Algo de inesperado aconteceu! Tente novamente mais tarde'
                })}
              </>
            )}
          </form>
        )}
      </Formik>
    </div>
  );
};

export default MeetingClientSchedules;
