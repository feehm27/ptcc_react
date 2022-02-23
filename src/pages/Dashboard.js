import { Box, Container } from '@material-ui/core';
import { Helmet } from 'react-helmet';
import DashboardAdvocate from './DashboardAdvocate';

const Dashboard = () => (
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
        <DashboardAdvocate />
      </Container>
    </Box>
  </>
);

export default Dashboard;
