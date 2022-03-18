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

const MettingSchedules = () => {
  const navigate = useNavigate();

  const { day, typeDay, datas } = useLocation().state;
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
    setTimeout(() => navigate('/meetings'), 1500);
  };

  const mountHours = () => {
    const newHours = [];

    datas.map((data) => {
      const hoursArray = JSON.parse(data.horarys);

      hoursArray.hours.forEach((hour) => {
        newHours.push({
          value: hour,
          client_name: data.client ? data.client.client_name : undefined
        });
      });
    });

    const hours = orderBy(newHours, ['value'], ['asc']);

    switch (typeDay) {
      /**
       * Dia disponível
       */
      case 1:
        setSchedules(SchedulesConstants);
        break;

      /**
       * Dia com agendamento
       */
      /**
       */
      case 2:
        setSchedules(hours);
        break;

      /**
       * Dia disponivel
       */
      case 3:
        setSchedules(hours);
        break;

      default:
        setCheckedsList(SchedulesConstants);
        break;
    }
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
   * Use Effect
   */
  useEffect(() => {}, []);

  const getTitle = () => {
    switch (typeDay) {
      case 1:
        return `Dia ${day} - Selecione os horários disponíveis para agendamento`;
      case 2:
        return `Dia ${day} - Selecione os horários que deseja cancelar reunião`;
      case 3:
        return `Dia ${day} - Selecione os horários que deseja remover disponibilidade`;
      default:
        return `Dia ${day} - Horários`;
    }
  };

  /**
   * Salva a configuração dos horários
   * @param {*} values
   */
  async function sendHours(params) {
    showSuccess.current = false;
    showError.current = false;
    showSuccessCancel.current = false;

    const token = window.localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    await API.post(`advocates/schedules`, params, config)
      .then(() => {
        if (params.is_cancel !== undefined) {
          showSuccessCancel.current = true;
        } else {
          showSuccess.current = true;
        }
      })
      .catch((err) => {
        console.log(err);
        showError.current = true;
      });
    setSubmitting(false);
  }

  /**
   * Cancela os dias de agendamento
   */
  const cancelSchedule = () => {
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
        time_type: 2,
        is_cancel: 1
      };

      sendHours(params);
    }
  };

  /**
   * Remove os dias disponíveis selecionados
   */
  const removeAvailableTime = () => {
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
        time_type: 1,
        is_removed: 1
      };

      sendHours(params);
    }
  };

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
        time_type: 1
      };

      sendHours(params);
    }
  };

  const handleSubmit = () => {
    switch (typeDay) {
      case 1:
        sendTimesToSchedule();
        break;
      case 2:
        cancelSchedule();
        break;
      case 3:
        removeAvailableTime();
        break;
      default:
        break;
    }
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
              <CardHeader title={getTitle()} />
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
                    navigate('/meetings');
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
            {showSuccessCancel.current && (
              <>
                <ToastAnimated />
                {showToast({
                  type: 'success',
                  message:
                    'Reuniões canceladas com sucesso! Seus clientes serão avisados por email!'
                })}
                {callTimeOut()}
              </>
            )}
            {showSuccess.current && (
              <>
                <ToastAnimated />
                {showToast({
                  type: 'success',
                  message: 'Horários cadastrados com sucesso!'
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

export default MettingSchedules;
