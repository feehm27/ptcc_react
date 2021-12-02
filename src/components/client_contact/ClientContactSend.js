import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  TextField,
  Typography
} from '@material-ui/core';
import moment from 'moment';

import { useLocation, useNavigate } from 'react-router';

const ClientContactSend = () => {
  const navigate = useNavigate();
  const { message } = useLocation().state;

  /**
   * Envia a resposta
   */
  async function sendAnswer() {
    console.log(message);
    console.log('criar a lógica aqui');
  }

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
        py: 3
      }}
    >
      <Container>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            mb: 2
          }}
        >
          <Button
            color="primary"
            variant="outlined"
            onClick={() => navigate('/contacts')}
          >
            Voltar
          </Button>
          <Button
            sx={{ mx: 1 }}
            color="primary"
            variant="contained"
            onClick={() => sendAnswer()}
          >
            Responder
          </Button>
        </Box>
      </Container>
      <Container>
        <Card variant="outlined">
          <CardContent sx={{ mt: 3, mb: 4 }}>
            <Grid item md={12} xs={12}>
              <Typography
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '15px'
                }}
                variant="h5"
                component="div"
              >
                <span>Data de envio:&nbsp;</span>
                <Typography color="text.secondary" variant="h5">
                  {`${moment(message.created_at).format(
                    'DD-MM-YYYY'
                  )} ás ${moment(message.created_at).format('hh:mm')}`}
                </Typography>
              </Typography>
            </Grid>
            <Grid item md={12} xs={12}>
              <Typography
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '15px'
                }}
                variant="h5"
                component="div"
              >
                <span>Remetente:&nbsp;</span>
                <Typography variant="h5" color="text.secondary">
                  {' '}
                  {message.sender_name}
                </Typography>
              </Typography>
            </Grid>
            <Grid item md={12} xs={12}>
              <Typography
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '15px'
                }}
                variant="h5"
                component="div"
              >
                <span>Destinatário:&nbsp;</span>
                <Typography color="text.secondary" variant="h5">
                  {message.recipient_name}
                </Typography>
              </Typography>
            </Grid>
            <Grid item md={12} xs={12}>
              <Typography
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '15px'
                }}
                variant="h5"
                component="div"
              >
                <span>Email do destinatário:&nbsp;</span>
                <Typography color="text.secondary" variant="h5">
                  {message.recipient_name}
                </Typography>
              </Typography>
            </Grid>
            <Grid item md={12} xs={12}>
              <Typography
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '15px'
                }}
                variant="h5"
                component="div"
              >
                <span>Assunto:&nbsp;</span>
                <Typography color="text.secondary" variant="h5">
                  {message.subject}
                </Typography>
              </Typography>
            </Grid>
            <Grid item md={12} xs={12} spacing={3}>
              <Typography
                variant="h5"
                component="div"
                style={{
                  marginBottom: '15px'
                }}
              >
                Mensagem:
              </Typography>
              <TextField
                fullWidth
                multiline
                required
                value={message.message}
                disabled
              />
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ClientContactSend;
