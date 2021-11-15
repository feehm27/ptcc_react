import { Avatar, Card, CardContent, Grid, Typography } from '@material-ui/core';
import MoneyIcon from '@material-ui/icons/Money';
import { green } from '@material-ui/core/colors';

const ActiveContracts = (props) => (
  <Card {...props}>
    <CardContent>
      <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
        <Grid item>
          <Typography color="textSecondary" gutterBottom variant="h6">
            Contratos ativos
          </Typography>
          <Typography color="textPrimary" variant="h3">
            5
          </Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: green[600],
              height: 56,
              width: 56
            }}
          >
            <MoneyIcon />
          </Avatar>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

export default ActiveContracts;
