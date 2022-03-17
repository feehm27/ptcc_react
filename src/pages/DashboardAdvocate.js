import { Container, Grid, Skeleton } from '@material-ui/core';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Clients from 'src/components/dashboard//Clients';
import ActiveContracts from 'src/components/dashboard/ActiveContracts';
import AnnualProfit from 'src/components/dashboard/AnnualProfit';
import ClientsByYear from 'src/components/dashboard/ClientsByYear';
import ContractsByMonth from 'src/components/dashboard/ContractsByMonth';
import Meetings from 'src/components/dashboard/Meetings';
import MeetingsPerWeek from 'src/components/dashboard/MeetingsPerWeek';
import ProcessesByStatus from 'src/components/dashboard/ProcessesByStatus';
import { UserContext } from 'src/contexts/UserContext';
import { API } from 'src/services/api';

const DashboardAdvocate = () => {
  const { data } = useContext(UserContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [loadingCountClients, setLoadingCountClients] = useState(true);
  const [loadingCountContracts, setLoadingCountContracts] = useState(true);
  const [loadingCountMeetings, setLoadingCountMeetings] = useState(true);
  const [loadingProcesses, setLoadingProcesses] = useState(true);
  const [loadingContracts, setLoadingContracts] = useState(true);
  const [loadingClients, setLoadingClients] = useState(true);
  const [loadingAnnualProfit, setLoadingAnnualProfit] = useState(true);

  const [clientsCount, setClientsCount] = useState(0);
  const [contractsCount, setContractsCount] = useState(0);
  const [meetingsCount, setMeetingsCount] = useState(0);
  const [processes, setProcesses] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [clients, setClients] = useState([]);
  const [annualProfit, setAnnualProfit] = useState([]);

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
   * Obtém a contagem de reuniões
   */
  async function getMeetingsCount() {
    setLoadingCountMeetings(true);
    const config = {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
      }
    };

    await API.get('/advocates/dashboard/count/meetings', config).then(
      (response) => {
        setMeetingsCount(response.data.data);
      }
    );
    setLoadingCountMeetings(false);
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

  /**
   * Obtém os contratos ativos e encerrados
   */
  async function getContracts() {
    setLoadingContracts(true);

    const config = {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
      }
    };

    await API.get('/advocates/dashboard/contracts', config).then((response) => {
      setContracts(response.data.data);
    });
    setLoadingContracts(false);
  }

  /**
   * Obtém os clientes por ano
   */
  async function getClients() {
    setLoadingClients(true);

    const config = {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
      }
    };

    await API.get('/advocates/dashboard/clients', config).then((response) => {
      setClients(response.data.data);
    });
    setLoadingClients(false);
  }

  /**
   * Obtém os clientes por ano
   */
  async function getAnnualProfit() {
    setLoadingAnnualProfit(true);

    const config = {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
      }
    };

    await API.get('/advocates/dashboard/profit', config).then((response) => {
      setAnnualProfit(response.data.data);
    });
    setLoadingAnnualProfit(false);
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

    setLoading(true);

    getProcessesByStatus();
    getMeetingsCount();
    getClientsCount();
    getContractsCount();
    getContracts();
    getClients();
    getAnnualProfit();

    setLoading(false);
    if (!isAllowed) {
      navigate('/not-allowed');
    }
  }, []);

  return loading ? (
    <Skeleton
      sx={{ bgcolor: 'grey.900' }}
      variant="rectangular"
      width={210}
      height={118}
    />
  ) : (
    <Container maxWidth={false}>
      <Grid container spacing={3}>
        {loadingCountMeetings ? (
          <Grid item lg={4} sm={4} xl={3} xs={12}>
            <Skeleton />
            <Skeleton animation="wave" />
            <Skeleton animation={false} />
            <Skeleton />
            <Skeleton />
          </Grid>
        ) : (
          <Grid item lg={4} sm={4} xl={3} xs={12}>
            <Meetings meetingsCount={meetingsCount} />
          </Grid>
        )}
        {loadingCountClients ? (
          <Grid item lg={4} sm={4} xl={3} xs={12}>
            <Skeleton />
            <Skeleton animation="wave" />
            <Skeleton animation={false} />
            <Skeleton />
            <Skeleton />
          </Grid>
        ) : (
          <Grid item lg={4} sm={4} xl={3} xs={12}>
            <Clients clientsCount={clientsCount} />
          </Grid>
        )}
        {loadingCountContracts ? (
          <Grid item lg={4} sm={4} xl={3} xs={12}>
            <Skeleton />
            <Skeleton animation="wave" />
            <Skeleton animation={false} />
            <Skeleton />
            <Skeleton />
          </Grid>
        ) : (
          <Grid item lg={4} sm={4} xl={3} xs={12}>
            <ActiveContracts contractsCount={contractsCount} />
          </Grid>
        )}
        <Grid container spacing={3} sx={{ mt: 2, ml: '0px' }}>
          {loadingProcesses ? (
            <Grid item lg={4} md={4} xl={3} xs={12}>
              <Skeleton
                variant="rectangular"
                animation="wave"
                style={{ height: '100%', width: '100%' }}
              ></Skeleton>
            </Grid>
          ) : (
            <Grid item lg={4} md={4} xl={3} xs={12}>
              <ProcessesByStatus
                sx={{ height: '100%' }}
                processes={processes}
              />
            </Grid>
          )}
          {loadingContracts ? (
            <Grid item lg={4} md={4} xl={3} xs={12}>
              <Skeleton
                variant="rectangular"
                animation="wave"
                style={{ height: '100%', width: '100%' }}
              ></Skeleton>
            </Grid>
          ) : (
            <Grid item lg={4} md={4} xl={3} xs={12}>
              <ContractsByMonth contracts={contracts} />
            </Grid>
          )}
          <Grid item lg={4} md={4} xl={3} xs={12}>
            <MeetingsPerWeek sx={{ height: '100%' }} />
          </Grid>
          {loadingAnnualProfit ? (
            <Grid item lg={8} md={8} xl={6} xs={12}>
              <Skeleton
                variant="rectangular"
                animation="wave"
                style={{ height: '100%', width: '100%' }}
              ></Skeleton>
            </Grid>
          ) : (
            <Grid item lg={8} md={8} xl={6} xs={12}>
              <AnnualProfit profit={annualProfit} />
            </Grid>
          )}
          {loadingClients ? (
            <Grid item lg={4} md={4} xl={3} xs={12}>
              <Skeleton
                variant="rectangular"
                animation="wave"
                style={{ height: '100%', width: '100%' }}
              ></Skeleton>
            </Grid>
          ) : (
            <Grid item lg={4} md={4} xl={3} xs={12}>
              <ClientsByYear clients={clients} />
            </Grid>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardAdvocate;
