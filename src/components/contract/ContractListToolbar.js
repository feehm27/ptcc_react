import { Box, Button } from '@material-ui/core';
import { useContext } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from 'src/contexts/UserContext';

const ContractListToolbar = (contracts) => {
  const navigate = useNavigate();
  const { data } = useContext(UserContext);

  return contracts.length === 0 ? (
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
          onClick={() => navigate('/contracts/join')}
          disabled={
            data && !data.isAdmin
              ? data.checkeds.permissions_checked[4][0].checked === 0
              : false
          }
        >
          Novo Contrato
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
              ? data.checkeds.permissions_checked[4][0].checked === 0
              : false
          }
          onClick={() => navigate('/contracts/join')}
        >
          Novo Contrato
        </Button>
      </Box>
    </Box>
  );
};

export default ContractListToolbar;
