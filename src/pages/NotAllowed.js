import { Helmet } from 'react-helmet';
import { Box, Button, Container, Typography } from '@material-ui/core';

const NotAllowed = () => (
  <>
    <Helmet>
      <title>Construção</title>
    </Helmet>
    <Container sx={{ mt: 2 }}>
      <Typography color="primary" variant="h3" align="center">
        <Button color="primary" variant="contained">
          Você não possui permissões para acessar essa página
        </Button>
      </Typography>
      <Box sx={{ textAlign: 'center' }}>
        <img
          alt="Sem permissão"
          src="https://advoguez-images.s3.sa-east-1.amazonaws.com/not_allowed.png"
          style={{
            marginTop: 50,
            display: 'inline-block',
            maxWidth: '100%',
            width: 380
          }}
        />
      </Box>
    </Container>
  </>
);

export default NotAllowed;
