import { Box, Container, Grid, Skeleton } from '@material-ui/core';
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
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { API } from 'src/services/api';

const Dashboard = () => {
  const { data } = useContext(UserContext);
  const navigate = useNavigate();

  const [loadingCountClients, setLoadingCountClients] = useState(false);
  const [loadingCountContracts, setLoadingCountContracts] = useState(false);
  const [loadingProcesses, setLoadingProcesses] = useState(false);

  const [clientsCount, setClientsCount] = useState(0);
  const [contractsCount, setContractsCount] = useState(0);
  const [processes, setProcesses] = useState([]);

  /**
   * Obtém a contagem de clientes
   */
  async function getClientsCount() {
    setLoadingCountClients(true);
    const config = {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
      }
    };

    await API.get('/advocates/dashboard/count/clients', config).then(
      (response) => {
        setClientsCount(response.data.data);
      }
    );
    setLoadingCountClients(false);
  }

  /**
   * Obtém a contagem de contratos ativos
   */
  async function getContractsCount() {
    setLoadingCountContracts(true);

    const config = {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
      }
    };

    await API.get('/advocates/dashboard/count/contracts', config).then(
      (response) => {
        setContractsCount(response.data.data);
      }
    );
    setLoadingCountContracts(false);
  }

  /**
   * Obtém os processos por status
   */
  async function getProcessesByStatus() {
    setLoadingProcesses(true);

    const config = {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
      }
    };

    await API.get('/advocates/dashboard/processes', config).then((response) => {
      setProcesses(response.data.data);
    });

    setLoadingProcesses(false);
  }

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
    const isAllowed = checkPermissionDashboard();

    getProcessesByStatus();
    getClientsCount();
    getContractsCount();

    if (!isAllowed) {
      navigate('/not-allowed');
    }
  }, []);

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
            <Grid item lg={4} sm={4} xl={3} xs={12}>
              <Meetings />
            </Grid>
            {loadingCountClients ? (
              <Skeleton
                variant="rectangular"
                animation="wave"
                width="210"
                height="118"
              >
                <div style={{ paddingTop: '57%' }} />
              </Skeleton>
            ) : (
              <Grid item lg={4} sm={4} xl={3} xs={12}>
                <Clients clientsCount={clientsCount} />
              </Grid>
            )}
            {loadingCountContracts ? (
              <Skeleton
                variant="rectangular"
                animation="wave"
                width="210"
                height="118"
              >
                <div style={{ paddingTop: '57%' }} />
              </Skeleton>
            ) : (
              <Grid item lg={4} sm={4} xl={3} xs={12}>
                <ActiveContracts contractsCount={contractsCount} />
              </Grid>
            )}
            {loadingProcesses ? (
              <Grid container spacing={3} sx={{ mt: 2, ml: '0px' }}>
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  width="210"
                  height="118"
                >
                  <div style={{ paddingTop: '57%' }} />
                </Skeleton>
              </Grid>
            ) : (
              <Grid container spacing={6} sx={{ mt: 1, paddingLeft: '24px' }}>
                <Grid item lg={6} md={6} xl={6} xs={12}>
                  <ProcessesByStatus
                    sx={{ height: '100%' }}
                    processes={processes}
                  />
                </Grid>
                <Grid item lg={6} md={6} xl={6} xs={12}>
                  <ContractsByMonth />
                </Grid>
                <Grid item lg={6} md={6} xl={6} xs={12}>
                  <MeetingsPerWeek sx={{ height: '100%' }} />
                </Grid>
                <Grid item lg={6} md={6} xl={6} xs={12}>
                  <ClientsByYear />
                </Grid>
              </Grid>
            )}
            <Grid item lg={12} md={12} xl={12} xs={12}>
              <AnnualProfit />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Dashboard;
