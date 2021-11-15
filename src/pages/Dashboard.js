import { Box, Container, Grid } from '@material-ui/core';
import { Helmet } from 'react-helmet';
import Clients from 'src/components/dashboard//Clients';
import ActiveContracts from 'src/components/dashboard/ActiveContracts';
import AnnualProfit from 'src/components/dashboard/AnnualProfit';
import ClientsByYear from 'src/components/dashboard/ClientsByYear';
import ContractsByMonth from 'src/components/dashboard/ContractsByMonth';
import Meetings from 'src/components/dashboard/Meetings';
import MeetingsPerWeek from 'src/components/dashboard/MeetingsPerWeek';
import ProcessesByStatus from 'src/components/dashboard/ProcessesByStatus';

const Dashboard = () => (
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
          <Grid item lg={4} sm={6} xl={3} xs={12}>
            <Meetings />
          </Grid>
          <Grid item lg={4} sm={6} xl={3} xs={12}>
            <Clients />
          </Grid>

          <Grid item lg={4} sm={6} xl={3} xs={12}>
            <ActiveContracts />
          </Grid>
          <Grid item lg={4} md={6} xl={3} xs={12}>
            <ProcessesByStatus sx={{ height: '100%' }} />
          </Grid>
          <Grid item lg={4} md={6} xl={3} xs={12}>
            <ContractsByMonth />
          </Grid>

          <Grid item lg={4} md={6} xl={3} xs={12}>
            <MeetingsPerWeek sx={{ height: '100%' }} />
          </Grid>
          <Grid item lg={8} md={12} xl={9} xs={12}>
            <AnnualProfit />
          </Grid>
          <Grid item lg={4} md={6} xl={3} xs={12}>
            <ClientsByYear />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
);

export default Dashboard;
