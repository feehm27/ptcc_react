import { Box, Button } from '@material-ui/core';
import { useNavigate } from 'react-router';

const ClientListToolbar = (clients) => {
  const navigate = useNavigate();

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
          onClick={() => navigate('/clients/create')}
        >
          Novo Cliente
        </Button>
        <Button
          sx={{ mx: 1 }}
          color="primary"
          variant="contained"
          onClick={() => navigate('/clients/create')}
        >
          Exportar todos os clientes
        </Button>
      </Box>
    </Box>
  );
};

export default ClientListToolbar;
