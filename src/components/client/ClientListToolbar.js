import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon
} from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';
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
      <Box sx={{ mt: 3, mb: 4 }}>
        <Card>
          <CardContent>
            <Box>
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SvgIcon fontSize="small" color="action">
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  )
                }}
                placeholder="Buscar cliente"
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default ClientListToolbar;
