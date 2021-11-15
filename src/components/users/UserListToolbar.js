import { Box, Button } from '@material-ui/core';
import { useNavigate } from 'react-router';

const UserListToolbar = (users) => {
  const navigate = useNavigate();

  return users.length === 0 ? (
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
          onClick={() => navigate('/users/create')}
        >
          Novo Usuário
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
          onClick={() => navigate('/users/create')}
        >
          Novo Usuário
        </Button>
      </Box>
    </Box>
  );
};

export default UserListToolbar;
