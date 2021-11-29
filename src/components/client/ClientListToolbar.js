import { Box, Button } from '@material-ui/core';
import { useContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from 'src/contexts/UserContext';
import { API } from 'src/services/api';
import ToastAnimated, { showToast } from '../Toast';

const ClientListToolbar = (clients) => {
  const navigate = useNavigate();

  const { data } = useContext(UserContext);
  const [submitting, setSubmitting] = useState(false);

  const showSuccess = useRef(false);
  const showError = useRef(false);

  /**
   * Exporta todos os clientes em PDF
   * @param {*} values
   */
  async function exportClients() {
    setSubmitting(true);

    const token = window.localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    await API.post('/advocates/clients/download', { all_clients: true }, config)
      .then((response) => {
        if (response.data.link) {
          window.open(response.data.link);
          showSuccess.current = true;
        }
      })
      .catch(() => {
        showSuccess.current = false;
        showError.current = true;
        setSubmitting(false);
      });
    setSubmitting(false);
  }

  return clients.clients.length === 0 ? (
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
              ? data.checkeds.permissions_checked[4][0].checked === 0
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
        {submitting ? (
          <Button color="primary" variant="contained" disabled>
            Carregando..
          </Button>
        ) : (
          <Button
            sx={{ mx: 1 }}
            color="primary"
            variant="contained"
            disabled={
              data && !data.isAdmin
                ? data.checkeds.permissions_checked[3][4].checked === 0
                : false
            }
            onClick={() => exportClients()}
          >
            Exportar todos os clientes
          </Button>
        )}
        {showSuccess.current && (
          <>
            <ToastAnimated />
            {showToast({
              type: 'success',
              message: 'Exportação realizada com sucesso!'
            })}
          </>
        )}
        {showError.current && (
          <>
            <ToastAnimated />
            {showToast({
              type: 'error',
              message: 'Ocorreu um erro ao exportar os clientes!'
            })}
          </>
        )}
      </Box>
    </Box>
  );
};

export default ClientListToolbar;
