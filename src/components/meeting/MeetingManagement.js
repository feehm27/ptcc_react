import DateFnsUtils from '@date-io/date-fns';
import {
  Button,
  Card,
  CardContent,
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
import {
  LocalizationProvider,
  PickersDay,
  pickersDayClasses,
  StaticDatePicker
} from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { addDays, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Formik } from 'formik';
import { filter, first } from 'lodash';
import moment from 'moment';
import { useState } from 'react';
import { Circle as CircleIcon } from 'react-feather';
import { useNavigate } from 'react-router';

import ScheduleSchema from 'src/schemas/ScheduleSchema';
import { API } from 'src/services/api';

const MeetingManagement = () => {
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
          ...matchedStyles,
          [`&&.${pickersDayClasses.selected}`]: {
            backgroundColor: 'green'
          }
        }}
      />
    );
  };

  const mountDays = (listDates) => {
    const newHighlightedDays = [];

    Object.keys(listDates).forEach((day) => {
      newHighlightedDays.push({
        date: addDays(new Date(day.split('$')[0]), 1),
        styles: {
          backgroundColor: day.split('%')[1]
        }
      });
    });
    setHighlightedDays(newHighlightedDays);
  };

  const checkShowCalendar = () => {
    if (submitting) return <div></div>;

    return (
      <>
        <LocalizationProvider locale={ptBR} dateAdapter={AdapterDateFns}>
          <StaticDatePicker
            displayStaticWrapperAs="desktop"
            label="Week picker"
            openTo="day"
            value={selectedMonth}
            onChange={(e) => {
              let typeDay = 1;
              let datas = [];

              const foundKey = first(
                filter(Object.keys(days), function getTypeDay(date) {
                  return date.split('$')[0] === moment(e).format('YYYY-MM-DD');
                })
              );

              if (foundKey) {
                typeDay = Number(foundKey.split('$')[1].split('%')[0]);
                datas = Object.values(days[foundKey]);
              }

              navigate('/meetings/schedules', {
                state: {
                  day: moment(e).format('DD/MM/YYYY'),
                  typeDay,
                  datas
                }
              });
            }}
            renderDay={renderWeekPickerDay}
            renderInput={(params) => <TextField {...params} />}
            disablePast={true}
            inputFormat="'Week of' MMM d"
          />
        </LocalizationProvider>
        <div style={{ marginLeft: '10px', marginTop: '15px' }}>
          <FormControlLabel
            label="Horários com agendamento"
            defaultChecked
            control={
              <CircleIcon
                style={{
                  cursor: 'initial',
                  marginRight: '2px',
                  fill: '#EE96AA',
                  stroke: '#EE96AA'
                }}
              ></CircleIcon>
            }
          />
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
          <FormControlLabel
            style={{ marginLeft: '5px' }}
            label="Horários neutros"
            control={
              <CircleIcon
                style={{
                  cursor: 'initial',
                  marginRight: '2px',
                  fill: 'white'
                }}
              ></CircleIcon>
            }
          />
        </div>
      </>
    );
  };

  /**
   * Obtém os menus e as permissões do usuário
   * * @param {*} token
   */
  async function searchSchedules() {
    setLoading(true);

    const config = {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
      }
    };

    const date = moment(selectedMonth).format('YYYY-MM');

    await API.get(`advocates/schedules?date=${date}`, config)
      .then((response) => {
        setDays(response.data.data);
        mountDays(response.data.data);
      })
      .catch((err) => console.error(err));

    setLoading(false);
    setSubmitting(false);
  }

  /**
   * Envia os dados do formulário
   * @param {*} values
   */
  const handleSubmit = (errors) => {
    console.log(errors);
    searchSchedules();
  };

  return (
    <Formik
      initialValues={{
        research_month: moment().format('MM/yyyy')
      }}
      onSubmit={handleSubmit}
      validationSchema={ScheduleSchema}
    >
      {({ handleBlur, submitForm, errors }) => (
        <form
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(errors);
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
                      invalidDateMessage="Data inválida"
                      openTo="month"
                      format="MM/yyyy"
                      label="Selecione um mês/ano"
                      minDateMessage="Mês inválido. Informe um mês maior que o mês atual"
                      views={['month', 'year']}
                      value={selectedMonth}
                      inputVariant="outlined"
                      disablePast={true}
                      onChange={(e) => {
                        handleMonthChange(e);
                      }}
                      onBlur={(e) => {
                        handleBlur(e);
                      }}
                      name="research_month"
                      required
                    />
                  </MuiPickersUtilsProvider>
                  {loading ? (
                    <Button color="primary" variant="contained" disabled>
                      Carregando..
                    </Button>
                  ) : (
                    <Button
                      style={{
                        marginTop: '10px',
                        marginLeft: '10px'
                      }}
                      color="primary"
                      variant="contained"
                      type="submit"
                      onClick={submitForm}
                    >
                      Pesquisar
                    </Button>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
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
            checkShowCalendar()
          )}
        </form>
      )}
    </Formik>
  );
};

export default MeetingManagement;
