import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import ClientManagement from 'src/components/client/ClientManagement';

const Client = () => (
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
        <ClientManagement />
      </Container>
    </Box>
  </>
);

export default Client;
