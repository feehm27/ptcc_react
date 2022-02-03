import { Box, Button } from '@material-ui/core';
import { useContext } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from 'src/contexts/UserContext';

const MeetingListToolbar = () => {
  const navigate = useNavigate();
  const { data } = useContext(UserContext);

  return (
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
              ? data.checkeds.permissions_checked[6][0].checked === 0
              : false
          }
        >
          Exportar
        </Button>
      </Box>
    </Box>
  );
};

export default MeetingListToolbar;
