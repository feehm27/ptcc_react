import { Box, Container, Skeleton } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import ContractClientView from 'src/components/contract_client/ContractClientView';
import { API } from 'src/services/api';

const ContractClient = () => {
  const [contract, setContract] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Obtém o contrato do cliente
   */
  async function getContractByClient() {
    setIsLoading(true);

    const config = {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
      }
    };

    await API.get('clients/contracts', config)
      .then((response) => {
        setContract(response.data.data);
      })
      .catch((err) => console.error(err));

    setIsLoading(false);
  }

  /**
   * Use Effect
   */
  useEffect(() => {
    getContractByClient();
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
          <ContractClientView contract={contract} />
        </Container>
      </Box>
    </>
  );
};

export default ContractClient;
