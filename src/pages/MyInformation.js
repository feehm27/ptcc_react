import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import InformationDetails from 'src/components/informations/InformationDetails';

const MyInformation = () => (
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
        <InformationDetails />
      </Container>
    </Box>
  </>
);

export default MyInformation;
