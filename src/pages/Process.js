import { Box, Container, Skeleton } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import ProcessManagement from 'src/components/process/ProcessManagement';
import ProcessListToolbar from 'src/components/process/ProcesstListToolbar';
import { API } from 'src/services/api';

const Process = () => {
  const [processes, setProcesses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Obtém as informações do cliente
   */
  async function getProcesses() {
    setIsLoading(true);
    const tokenUser = window.localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${tokenUser}` }
    };
    await API.get('advocates/processes', config)
      .then((response) => {
        setProcesses(response.data.data);
      })
      .catch((err) => console.error(err));
    setIsLoading(false);
  }

  /**
   * Use Effect
   */
  useEffect(() => {
    getProcesses();
  }, []);

  return isLoading ? (
    <>
      <Helmet>
        <title>Advoguez</title>
      </Helmet>
      <Skeleton />
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
          <ProcessListToolbar processes={processes} />
          <ProcessManagement processes={processes} />
        </Container>
      </Box>
    </>
  );
};

export default Process;
