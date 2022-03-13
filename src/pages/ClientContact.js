import {
  Box,
  Button,
  Card,
  Container,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router';
import ClientContactShow from 'src/components/client_contact/ClientContactShow';
import { UserContext } from 'src/contexts/UserContext';
import { API } from 'src/services/api';

const ClientContact = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { data } = useContext(UserContext);

  /**
   * Obtém as informações das mensagens
   */
  async function getMessages() {
    setIsLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
      }
    };
    await API.get(
      `clients/messages/received?client_id=${data.client.id}`,
      config
    )
      .then((response) => {
        setMessages(response.data.data);
      })
      .catch((err) => console.error(err));
    setIsLoading(false);
  }

  /**
   * Use Effect
   */
  useEffect(() => {
    getMessages();
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
      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            m: 3
          }}
        >
          <Button
            color="primary"
            variant="contained"
            onClick={() => navigate('/contacts/create')}
            disabled={
              data && !data.isAdmin
                ? data.checkeds.permissions_checked[13][0].checked === 0
                : false
            }
          >
            Nova Mensagem
          </Button>
        </Box>
      </Box>
      {messages && messages.length > 0 ? (
        <>
          <Helmet>
            <title>Advoguez</title>
          </Helmet>
          <Box
            sx={{
              backgroundColor: 'background.default',
              minHeight: '100%'
            }}
          >
            <Container maxWidth="lg">
              <ClientContactShow messages={messages} />
            </Container>
          </Box>
        </>
      ) : (
        <Card sx={{ m: 3, mb: 4 }}>
          <Box sx={{ minWidth: 1050 }}>
            <Table>
              <TableHead>
                <TableRow></TableRow>
              </TableHead>
              <TableBody>
                <TableCell>
                  <Typography variant="body1">
                    Não existem mensagens enviadas e/ou recebidas.
                  </Typography>
                </TableCell>
              </TableBody>
            </Table>
          </Box>
        </Card>
      )}
    </>
  );
};

export default ClientContact;
