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
import { UserContext } from 'src/contexts/UserContext';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';

const Dashboard = () => {
  const { data } = useContext(UserContext);
  const navigate = useNavigate();

  const checkPermissionDashboard = () => {
    let isAllowed = true;

    if (data && !data.isAdmin) {
      if (
        data.checkeds.menus_checked[0].checked === 0 ||
        data.checkeds.permissions_checked[0][0].checked === 0
      ) {
        isAllowed = false;
      }
    }
    return isAllowed;
  };

  useEffect(() => {
    console.log('aqui dentro');
    const isAllowed = checkPermissionDashboard();

    if (!isAllowed) {
      navigate('/not-allowed');
    }
  });

  return (
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
};

export default Dashboard;
