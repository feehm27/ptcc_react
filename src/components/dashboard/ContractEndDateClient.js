import { Card, CardContent, Grid, Typography } from '@material-ui/core';

const ContractEndDateClient = (props) => (
  <Card sx={{ height: '100%' }} {...props}>
    <CardContent>
      <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
        <Grid item>
          <Typography color="textSecondary" gutterBottom variant="h6">
            Date de término do contrato
          </Typography>
          <Typography color="textPrimary" variant="h3">
            22/04/2022
          </Typography>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

export default ContractEndDateClient;
