import {
  Avatar,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography
} from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import EventIcon from '@material-ui/icons/EventOutlined';

const ScheduledMettingClient = (props) => (
  <Card sx={{ height: '100%' }} {...props}>
    <CardContent>
      <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
        {props.meeting === null ? (
          <Grid item>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="h4"
              textAlign="center"
              style={{ marginTop: '20px' }}
            >
              Você não possui reunião agendada.
            </Typography>
          </Grid>
        ) : (
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
              <TextField
                variant="outlined"
                fullWidth
                defaultValue={`${props.meeting.date} ás ${props.meeting.hours}`}
                disabled={true}
              />

              <Typography
                color="textPrimary"
                variant="h3"
                style={{
                  marginLeft: '6px'
                }}
              >
                {`com ${props.meeting.advocate.name}`}
              </Typography>
            </span>
          </Grid>
        )}
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
