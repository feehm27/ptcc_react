import { Box, Container, Skeleton } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import ProcessClientView from 'src/components/process_client/ProcessClientView';
import { API } from 'src/services/api';

const ProcessClient = () => {
  const [processHistory, setProcessHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Obtém o processo do cliente
   */
  async function getProcessByClient() {
    setIsLoading(true);

    const config = {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
      }
    };

    await API.get('clients/processes', config)
      .then((response) => {
        setProcessHistory(response.data.data);
      })
      .catch((err) => console.error(err));

    setIsLoading(false);
  }

  /**
   * Use Effect
   */
  useEffect(() => {
    getProcessByClient();
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
          <ProcessClientView process={processHistory} />
        </Container>
      </Box>
    </>
  );
};

export default ProcessClient;
