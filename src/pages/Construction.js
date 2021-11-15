import { Helmet } from 'react-helmet';
import { Box, Container, Typography } from '@material-ui/core';

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
          Página em Construção..
        </Typography>
        <Typography align="center" color="textPrimary" variant="subtitle2">
          Ops, ainda estamos desenvolvendo esta página. Em breve ela estará
          disponível para visualização.
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
