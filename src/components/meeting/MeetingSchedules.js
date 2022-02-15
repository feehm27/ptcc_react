import {
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  Skeleton,
  Typography
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import SchedulesConstants from 'src/constants/SchedulesConstants';

const MettingSchedules = () => {
  const { day, typeDay, datas } = useLocation().state;
  const [schedules, setSchedules] = useState(SchedulesConstants);
  const [checkedsList, setCheckedsList] = useState([]);
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
        setSchedules(newHours);
        setCheckedsList(Array(newHours.length).fill(true));

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
    checkedsList.map((checked, checkedIndex) => {
      if (checkedIndex === index) checked = event.target.checked;
    });

    checkedsList[index] = event.target.checked;
    setCheckedsList[checkedsList];
  };

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

  /**
   * Use Effect
   */
  useEffect(() => {
    getSchedules();
  }, []);

  return (
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
  );
};

export default MettingSchedules;
