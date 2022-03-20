import { Box, Container, Skeleton } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import ClientListToolbar from 'src/components/client/ClientListToolbar';
import ClientManagement from 'src/components/client/ClientManagement';
import { API } from 'src/services/api';

const Client = () => {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Obtém as informações do cliente
   */
  async function getClients() {
    setIsLoading(true);
    const tokenUser = window.localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${tokenUser}` }
    };
    await API.get('advocates/clients', config)
      .then((response) => {
        setClients(response.data.data);
      })
      .catch((err) => console.error(err));
    setIsLoading(false);
  }

  /**
   * Use Effect
   */
  useEffect(() => {
    getClients();
  }, []);

  return isLoading ? (
    <>
      <Helmet>
        <title>Advoguez</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth="lg">
          <Skeleton
            variant="rectangular"
            animation="wave"
            width="100%"
            height="100%"
          >
            <div style={{ paddingTop: '57%', margin: '16px' }} />
          </Skeleton>
        </Container>
      </Box>
    </>
  ) : (
    <>
      <Helmet>
        <title>Advoguez</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth="lg">
          <ClientListToolbar clients={clients} />
          <ClientManagement clients={clients} />
        </Container>
      </Box>
    </>
  );
};

export default Client;
