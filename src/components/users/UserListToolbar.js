import { Box, Button } from '@material-ui/core';
import { useNavigate } from 'react-router';
import { useContext } from 'react';
import { UserContext } from 'src/contexts/UserContext';

const UserListToolbar = (users) => {
  const navigate = useNavigate();
  const { data } = useContext(UserContext);

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
          disabled={
            data && !data.isAdmin
              ? data.checkeds.permissions_checked[10][0].checked === 0
              : false
          }
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
          disabled={
            data && !data.isAdmin
              ? data.checkeds.permissions_checked[10][0].checked === 0
              : false
          }
          onClick={() => navigate('/users/create')}
        >
          Novo Usuário
        </Button>
      </Box>
    </Box>
  );
};

export default UserListToolbar;
