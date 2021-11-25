import { Box, Button } from '@material-ui/core';
import { useNavigate } from 'react-router';
import { useContext } from 'react';
import { UserContext } from 'src/contexts/UserContext';

const ClientListToolbar = (clients) => {
  const navigate = useNavigate();
  const { data } = useContext(UserContext);

  return clients.length === 0 ? (
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
          onClick={() => navigate('/clients/create')}
          disabled={
            data && !data.isAdmin
              ? data.checkeds.permissions_checked[3][0].checked === 0
              : false
          }
        >
          Novo Cliente
        </Button>
      </Box>
    </Box>
  ) : (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start'
        }}
      >
        <Button
          color="primary"
          variant="contained"
          disabled={
            data && !data.isAdmin
              ? data.checkeds.permissions_checked[3][0].checked === 0
              : false
          }
          onClick={() => navigate('/clients/create')}
        >
          Novo Cliente
        </Button>
        <Button
          sx={{ mx: 1 }}
          color="primary"
          variant="contained"
          disabled={
            data && !data.isAdmin
              ? data.checkeds.permissions_checked[3][4].checked === 0
              : false
          }
          onClick={() => navigate('/clients/create')}
        >
          Exportar todos os clientes
        </Button>
      </Box>
    </Box>
  );
};

export default ClientListToolbar;
