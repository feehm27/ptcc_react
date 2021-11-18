import { Avatar, Card, CardContent, Grid, Typography } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import EventIcon from '@material-ui/icons/EventOutlined';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';
import { ptBR } from 'date-fns/locale';
import DateFnsUtils from '@date-io/date-fns';

const ScheduledMettingClient = (props) => (
  <Card sx={{ height: '100%' }} {...props}>
    <CardContent>
      <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
        <Grid item>
          <Typography color="textSecondary" gutterBottom variant="h6">
            Reunião Agendada
          </Typography>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <MuiPickersUtilsProvider locale={ptBR} utils={DateFnsUtils}>
              <KeyboardDatePicker
                initialFocusedDate="22/07/2021 21:00"
                format="dd/MM/yyyy H:ii"
                disabled={true}
              />
            </MuiPickersUtilsProvider>
            <Typography
              color="textPrimary"
              variant="h3"
              style={{
                marginLeft: '6px'
              }}
            >
              com João Carlos Almeida
            </Typography>
          </span>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: red[600],
              height: 56,
              width: 56
            }}
          >
            <EventIcon />
          </Avatar>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

export default ScheduledMettingClient;
