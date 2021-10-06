import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import VisualIdentity from 'src/components/identity/VisualIdentity';

const Identity = () => (
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
        <VisualIdentity />
      </Container>
    </Box>
  </>
);

export default Identity;
