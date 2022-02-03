import DateFnsUtils from '@date-io/date-fns';
import {
  Button,
  Card,
  CardContent,
  Divider,
  FormControlLabel,
  Grid,
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
import moment from 'moment';
import { useState } from 'react';
import { Circle as CircleIcon } from 'react-feather';

const MeetingManagement = () => {
  const [selectedMonth, handleMonthChange] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState();

  const highlightedDays = [
    {
      date: new Date(),
      styles: { color: 'red' }
    },
    {
      date: addDays(new Date(), 6),
      styles: {
        backgroundColor: '#EE96AA'
      }
    },
    {
      date: addDays(new Date(), 9),
      styles: {
        backgroundColor: '#EE96AA'
      }
    },
    {
      date: addDays(new Date(), 12),
      styles: {
        backgroundColor: 'yellow'
      }
    }
  ];

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

  /**
   * Envia os dados do formulário
   * @param {*} values
   */
  const handleSubmit = () => {
    setValue(selectedMonth);
    setShowCalendar(true);
    setSubmitting(false);
  };

  return (
    <Formik
      initialValues={{
        research_month: moment().format('MM/yyyy')
      }}
      onSubmit={handleSubmit}
    >
      {({ handleBlur, submitForm }) => (
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
                      invalidDateMessage="Data inválida"
                      openTo="month"
                      format="MM/yyyy"
                      label="Selecione um mês/ano"
                      minDateMessage="Informe uma data maior que a data atual"
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
                  {submitting ? (
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
          {showCalendar && (
            <>
              <LocalizationProvider locale={ptBR} dateAdapter={AdapterDateFns}>
                <StaticDatePicker
                  displayStaticWrapperAs="desktop"
                  label="Week picker"
                  openTo="day"
                  value={value}
                  onChange={(newValue) => {
                    setValue(newValue);
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
          )}
        </form>
      )}
    </Formik>
  );
};

export default MeetingManagement;
