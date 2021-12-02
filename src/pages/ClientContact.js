import { Box, Container, Skeleton } from '@material-ui/core';
import { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import ClientContactList from 'src/components/client_contact/ClientContactList';
import ClientContactManagement from 'src/components/client_contact/ClientContactManagement';
import { UserContext } from 'src/contexts/UserContext';
import { API } from 'src/services/api';

const ClientContact = () => {
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
    await API.get(`messages?user_id=${data.id}`, config)
      .then((response) => {
        console.log(response.data.data);
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
      <Skeleton />
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
          <ClientContactList messages={messages} />
          <ClientContactManagement messages={messages} />
        </Container>
      </Box>
    </>
  );
};

export default ClientContact;
