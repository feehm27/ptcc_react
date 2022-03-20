import DateFnsUtils from '@date-io/date-fns';
import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  Skeleton,
  TextField
} from '@material-ui/core';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';
import { LocalizationProvider, PickersDay, StaticDatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { addDays, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Formik } from 'formik';
import { filter, first, orderBy } from 'lodash';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import { Circle as CircleIcon } from 'react-feather';
import { useNavigate } from 'react-router';
import { UserContext } from 'src/contexts/UserContext';
import ScheduleSchema from 'src/schemas/ScheduleSchema';
import { API } from 'src/services/api';

const MeetingClientManagement = () => {
  const { data } = useContext(UserContext);
  const navigate = useNavigate();

  const [highlightedDays, setHighlightedDays] = useState();
  const [selectedMonth, handleMonthChange] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(true);
  const [days, setDays] = useState();

  const renderWeekPickerDay = (date, selectedDates, pickersDayProps) => {
    const matchedStyles = highlightedDays.reduce((a, v) => {
      return isSameDay(date, v.date) ? v.styles : a;
    }, {});

    return (
      <PickersDay
        {...pickersDayProps}
        sx={{
          ...matchedStyles
        }}
      />
    );
  };

  const mountDays = (listDates) => {
    const newHighlightedDays = [];

    Object.keys(listDates).forEach((day) => {
      newHighlightedDays.push({
        date: addDays(new Date(day), 1),
        styles: {
          backgroundColor: '#5ab5cb'
        }
      });
    });

    const highlighted = orderBy(newHighlightedDays, ['date'], ['asc']);

    setHighlightedDays(highlighted);
  };

  const checkShowCalendar = () => {
    if (submitting) return <div></div>;

    return (
      <div style={{ marginTop: 1 }}>
        <LocalizationProvider locale={ptBR} dateAdapter={AdapterDateFns}>
          <StaticDatePicker
            displayStaticWrapperAs="desktop"
            label="Week picker"
            openTo="day"
            value={selectedMonth}
            onChange={(e) => {
              let datas = [];

              const foundKey = first(
                filter(Object.keys(days), function getTypeDay(date) {
                  return date === moment(e).format('YYYY-MM-DD');
                })
              );

              if (foundKey) {
                datas = Object.values(days[foundKey]);
              }

              if (datas.length > 0) {
                navigate('/meetings/clients/schedules', {
                  state: {
                    day: moment(e).format('DD/MM/YYYY'),
                    datas,
                    client: data.client
                  }
                });
              }
            }}
            renderDay={renderWeekPickerDay}
            renderInput={(params) => <TextField {...params} />}
            disablePast={true}
            inputFormat="'Week of' MMM d"
          />
        </LocalizationProvider>
        <div style={{ marginLeft: '10px', marginTop: '15px' }}>
          <FormControlLabel
            style={{ marginLeft: '5px' }}
            label="Horários disponíveis"
            control={
              <CircleIcon
                style={{
                  cursor: 'initial',
                  marginRight: '2px',
                  fill: '#5ab5cb',
                  stroke: '#5ab5cb'
                }}
              ></CircleIcon>
            }
          />
        </div>
      </div>
    );
  };

  /**
   * Obtém os menus e as permissões do usuário
   * * @param {*} token
   */
  async function searchSchedules(selectedDate) {
    setLoading(true);

    const config = {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
      }
    };

    const date =
      selectedDate === undefined
        ? moment(selectedMonth).format('YYYY-MM')
        : moment(selectedDate).format('YYYY-MM');

    await API.get(
      `clients/schedules?client_id=${data.client.id}&date=${date}`,
      config
    )
      .then((response) => {
        setDays(response.data.data);
        mountDays(response.data.data);
      })
      .catch((err) => console.error(err));

    setLoading(false);
    setSubmitting(false);
  }

  /**
   * Use Effect
   */
  useEffect(() => {
    searchSchedules();
  }, []);

  return (
    <Formik
      initialValues={{
        research_month: moment().format('MM/yyyy')
      }}
      validationSchema={ScheduleSchema}
    >
      {() => (
        <form
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Card>
            <Divider />
            <CardContent>
              <Grid
                container
                spacing={3}
                sx={{
                  display: 'flex',
                  justifyContent: 'left'
                }}
              >
                <Grid item md={6} xs={6}>
                  <MuiPickersUtilsProvider locale={ptBR} utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      minDate={new Date()}
                      fullWidth
                      invalidDateMessage="Data inválida"
                      openTo="month"
                      format="MM/yyyy"
                      label="Selecione um mês/ano"
                      minDateMessage="O mês informado deve ser maior ou igual ao mês atual"
                      views={['month', 'year']}
                      onKeyPress={(e) => {
                        e.key === 'Enter' && e.preventDefault();
                      }}
                      value={selectedMonth}
                      inputVariant="outlined"
                      disablePast={true}
                      onChange={(e) => {
                        handleMonthChange(e);
                        const selectedDate = moment(e);
                        if (selectedDate.isValid()) {
                          searchSchedules(e);
                        }
                      }}
                      name="research_month"
                      required
                    />
                  </MuiPickersUtilsProvider>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          {loading ? (
            <Box
              sx={{
                backgroundColor: 'background.default',
                minHeight: '100%',
                py: 3
              }}
            >
              <Container maxWidth="lg">
                <Skeleton />
                <Skeleton animation="wave" />
                <Skeleton animation={false} />
                <Skeleton />
                <Skeleton />
              </Container>
            </Box>
          ) : (
            checkShowCalendar()
          )}
        </form>
      )}
    </Formik>
  );
};

export default MeetingClientManagement;
