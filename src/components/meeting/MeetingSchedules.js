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
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import SchedulesConstants from 'src/constants/SchedulesConstants';

const MettingSchedules = () => {
  const navigate = useNavigate();

  const { day, typeDay, datas } = useLocation().state;
  const [schedules, setSchedules] = useState(SchedulesConstants);
  const [submitting, setSubmitting] = useState(false);
  const [checkedsList, setCheckedsList] = useState(Array(28).fill(false));
  const [loading, setLoading] = useState(true);

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

    switch (typeDay) {
      case 1:
        setCheckedsList(Array(28).fill(false));
        break;

      /**
       * INCLUIR TRATATIVA PARA EXIBIR OS HORÁRIOS DISPONIVEIS E COM AGENDAMENTO
       */
      case 2:
        SchedulesConstants.map((schedule, index) => {
          newHours.some((item) => {
            if (schedule.value === item.value) {
              schedule.value = item.value;
              schedule.client_name = item.client_name;
              schedule.type_of_day = 2;
              checkedsList[index] = true;
            }
          });
        });

        setSchedules(SchedulesConstants);
        setCheckedsList(checkedsList);
        break;

      case 3:
        setSchedules(newHours);
        setCheckedsList(Array(newHours.length).fill(true));
        break;

      default:
        setCheckedsList(Array(28).fill(false));
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

  const handleChangeChecked = (event, index) => {
    checkedsList[index] = event.target.checked;
    setCheckedsList(checkedsList);
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
        return `Dia ${day} - Selecione os horários que deseja cancelar reunião ou remover disponibilidade`;
      case 3:
        return `Dia ${day} - Selecione os horários que deseja remover disponibilidade`;
      default:
        return `Dia ${day} - Horários`;
    }
  };

  const handleSubmit = () => {
    setSubmitting(false);
    console.log('teste');
  };

  /**
   * Use Effect
   */
  useEffect(() => {
    getSchedules();
  }, []);

  return (
    <Formik initialValues={{}} onSubmit={handleSubmit}>
      {({ submitForm }) => (
        <form
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
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
                  columns: `${schedules.length > 3 ? '6 auto' : '3 auto'}`,
                  marginRight: '10px'
                }}
              >
                {schedules.map((schedule, index) => (
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
                            checked={checkedsList[index]}
                            color="primary"
                            onChange={(e) => {
                              handleChangeChecked(e, index);
                            }}
                          ></Checkbox>
                          {schedule.client_name === undefined
                            ? schedule.value
                            : `${schedule.value} - ${schedule.client_name}`}
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
                onClick={() => navigate('/meetings')}
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
        </form>
      )}
    </Formik>
  );
};

export default MettingSchedules;
