import { Box, Container, Grid } from '@material-ui/core';
import { Helmet } from 'react-helmet';
import ContractEndDateClient from 'src/components/dashboard/ContractEndDateClient';
import ScheduledMettingClient from 'src/components/dashboard/ScheduledMettingClient';
import ProcessStatusClient from 'src/components/dashboard/ProcessStatusClient';

const DashboardClient = () => (
  <>
    <Helmet>
      <title>Advoguez</title>
    </Helmet>
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '50%',
        py: 3
      }}
    >
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item lg={6} sm={6} xl={3} xs={12}>
            <ProcessStatusClient />
          </Grid>
          <Grid item lg={6} sm={6} xl={3} xs={12}>
            <ContractEndDateClient />
          </Grid>
          <Grid item lg={12} md={12} xl={12} xs={12}>
            <ScheduledMettingClient sx={{ height: '100%' }} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
);

export default DashboardClient;
