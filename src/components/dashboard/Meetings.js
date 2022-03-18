import { Avatar, Card, CardContent, Grid, Typography } from '@material-ui/core';
import ScheduleIcon from '@material-ui/icons/Schedule';
import { orange } from '@material-ui/core/colors';

const Meetings = (props) => (
  <Card {...props}>
    <CardContent>
      <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
        <Grid item>
          <Typography color="textSecondary" gutterBottom variant="h6">
            Reuniões agendadas hoje
          </Typography>
          <Typography color="textPrimary" variant="h3">
            {props.meetingsCount}
          </Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: orange[600],
              height: 56,
              width: 56
            }}
          >
            <ScheduleIcon />
          </Avatar>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

export default Meetings;
