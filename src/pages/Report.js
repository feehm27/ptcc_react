import { Box, Container, Skeleton } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import ReportListToolbar from 'src/components/report/ReportListToolbar';
import ReportManagement from 'src/components/report/ReportManagement';
import { API } from 'src/services/api';

const Report = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Obtém os relatórios cadastrados pelo advogado
   */
  async function getReports() {
    setIsLoading(true);
    const tokenUser = window.localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${tokenUser}` }
    };
    await API.get('advocates/reports', config)
      .then((response) => {
        setReports(response.data.data);
      })
      .catch((err) => console.error(err));
    setIsLoading(false);
  }

  /**
   * Use Effect
   */
  useEffect(() => {
    getReports();
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
          <ReportListToolbar reports={reports} />
          <ReportManagement reports={reports} />
        </Container>
      </Box>
    </>
  );
};

export default Report;
