import { Card, CardContent, Grid, Typography } from '@material-ui/core';

const ProcessStatusClient = (props) => (
  <Card {...props}>
    <CardContent>
      <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
        <Grid item>
          <Typography color="textSecondary" gutterBottom variant="h6">
            Status do processo
          </Typography>
          <Typography color="green" variant="h3">
            Em andamento
          </Typography>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

export default ProcessStatusClient;
