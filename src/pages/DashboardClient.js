import { Box, Container, Grid, Skeleton } from '@material-ui/core';
import { Helmet } from 'react-helmet';
import ContractEndDateClient from 'src/components/dashboard/ContractEndDateClient';
import ScheduledMettingClient from 'src/components/dashboard/ScheduledMettingClient';
import ProcessStatusClient from 'src/components/dashboard/ProcessStatusClient';
import { useEffect, useState } from 'react';
import { API } from 'src/services/api';

const DashboardClient = () => {
  const [loadingContract, setLoadingContract] = useState(true);
  const [loadingProcess, setLoadingProcess] = useState(true);

  const [process, setProcess] = useState([]);
  const [contract, setContract] = useState([]);

  /**
   * Obtém os dados do contrato do cliente
   */
  async function getContract() {
    setLoadingContract(true);

    const config = {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
      }
    };

    await API.get('/clients/dashboard/contract', config).then((response) => {
      setContract(response.data.data);
    });

    setLoadingContract(false);
  }

  /**
   * Obtém os dados do processo do cliente
   */
  async function getStatusProcess() {
    setLoadingProcess(true);

    const config = {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
      }
    };

    await API.get('/clients/dashboard/process', config).then((response) => {
      setProcess(response.data.data);
    });

    setLoadingProcess(false);
  }

  useEffect(() => {
    getStatusProcess();
    getContract();
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
            {loadingProcess ? (
              <Skeleton
                variant="rectangular"
                animation="wave"
                width="210"
                height="118"
              >
                <div style={{ paddingTop: '57%' }} />
              </Skeleton>
            ) : (
              <Grid item lg={6} sm={6} xl={3} xs={12}>
                <ProcessStatusClient process={process} />
              </Grid>
            )}
            {loadingContract ? (
              <Skeleton
                variant="rectangular"
                animation="wave"
                width="210"
                height="118"
              >
                <div style={{ paddingTop: '57%' }} />
              </Skeleton>
            ) : (
              <Grid item lg={6} sm={6} xl={3} xs={12}>
                <ContractEndDateClient contract={contract} />
              </Grid>
            )}
            <Grid item lg={12} md={12} xl={12} xs={12}>
              <ScheduledMettingClient sx={{ height: '100%' }} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default DashboardClient;
