import { Box, Button } from '@material-ui/core';
import { useContext } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from 'src/contexts/UserContext';
import { API } from 'src/services/api';

const ClientContactList = (messages) => {
  const navigate = useNavigate();
  const { data } = useContext(UserContext);

  /**
   * Obtém as mensagens recebidas
   */
  async function getMessagesSent() {
    const token = window.localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    await API.get(
      `messages/sent?user_id=${data.id}&client_sent=${true}`,
      config
    )
      .then((response) => {
        if (response.data.status_code === 200) {
          navigate('/contacts/sent', {
            state: { messages: response.data.data }
          });
        }
      })
      .catch(() => {});
  }

  return (
    messages.messages && (
      <Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            mb: 2
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
          <Button
            sx={{ mx: 1 }}
            color="primary"
            variant="contained"
            onClick={() => getMessagesSent()}
          >
            Mensagens enviadas
          </Button>
        </Box>
      </Box>
    )
  );
};

export default ClientContactList;
