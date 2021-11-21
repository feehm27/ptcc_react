import { Helmet } from 'react-helmet';
import { Box, Button, Container, Typography } from '@material-ui/core';

const Construction = () => (
  <>
    <Helmet>
      <title>Construção</title>
    </Helmet>
    <Box
      sx={{
        backgroundColor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'center'
      }}
    >
      <Container maxWidth="md" sx={{ mt: 2 }}>
        <Typography align="center" color="textPrimary" variant="h1">
          <Button color="primary" variant="contained">
            Ops.. Página em construção...
          </Button>
        </Typography>
        <Typography align="center" color="textPrimary" variant="h1">
          <Button color="primary" variant="contained">
            Em breve disponibilizaremos para visualização.
          </Button>
        </Typography>

        <Box sx={{ textAlign: 'center' }}>
          <img
            alt="Under development"
            src="/static/images/not_found.png"
            style={{
              marginTop: 50,
              display: 'inline-block',
              maxWidth: '100%',
              width: 560
            }}
          />
        </Box>
      </Container>
    </Box>
  </>
);

export default Construction;
