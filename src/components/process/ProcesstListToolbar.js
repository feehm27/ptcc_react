import { Box, Button } from '@material-ui/core';
import { useContext } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from 'src/contexts/UserContext';

const ProcessListToolbar = (processes) => {
  const navigate = useNavigate();
  const { data } = useContext(UserContext);

  return processes.length === 0 ? (
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
          onClick={() => navigate('/processes/join')}
          disabled={
            data && !data.isAdmin
              ? data.checkeds.permissions_checked[5][0].checked === 0
              : false
          }
        >
          Novo Processo
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
              ? data.checkeds.permissions_checked[5][0].checked === 0
              : false
          }
          onClick={() => navigate('/processes/join')}
        >
          Novo Processo
        </Button>
      </Box>
    </Box>
  );
};

export default ProcessListToolbar;
