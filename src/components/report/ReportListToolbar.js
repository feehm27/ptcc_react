import { Box, Button } from '@material-ui/core';
import { useContext } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from 'src/contexts/UserContext';

const ReportListToolbar = () => {
  const navigate = useNavigate();
  const { data } = useContext(UserContext);

  return (
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
          onClick={() => navigate('/reports/create')}
          disabled={
            data && !data.isAdmin
              ? data.checkeds.permissions_checked[9][0].checked === 0
              : false
          }
        >
          Novo Relatório
        </Button>
      </Box>
    </Box>
  );
};

export default ReportListToolbar;
