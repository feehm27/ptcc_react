import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography
} from '@material-ui/core';
import { Delete, DownloadRounded, Edit } from '@material-ui/icons';
import moment from 'moment';
import { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useNavigate } from 'react-router';
import { API } from 'src/services/api';
import ToastAnimated, { showToast } from '../Toast';

const ClientManagement = (listClients) => {
  const navigate = useNavigate();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState([]);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  /**
   * Envia os dados do advogado
   * @param {*} values
   */
  async function deleteClient(clientId) {
    setShowSuccess(false);
    const token = window.localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    await API.delete(`advocates/clients/${clientId}`, config)
      .then(() => {})
      .catch((err) => {
        console.log(err);
        setShowSuccess(false);
      })
      .finally(() => {
        setShowSuccess(true);
      });
  }

  return listClients.clients.length > 0 ? (
    <Card>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>CPF</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Data de nascimento</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listClients.clients.slice(0, limit).map((client) => (
                <TableRow hover key={client.id}>
                  <TableCell>
                    <Typography color="textPrimary" variant="body1">
                      {client.name}
                    </Typography>
                  </TableCell>
                  <TableCell>{client.cpf}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>
                    {moment(client.birthday).format('MM/DD/YYYY')}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Editar">
                      <Edit
                        cursor="pointer"
                        onClick={() => {
                          navigate('/clients/edit', {
                            state: { client }
                          });
                        }}
                      ></Edit>
                    </Tooltip>
                    <Tooltip title="Exportar">
                      <DownloadRounded cursor="pointer"></DownloadRounded>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <Delete
                        cursor="pointer"
                        onClick={() => {
                          setSelectedClient(client);
                          setShowModal(true);
                        }}
                      ></Delete>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={listClients.clients.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
      {showModal && (
        <div>
          <Dialog
            open={showModal}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              <Typography color="primary" variant="h5" textAlign="center">
                Confirmar exclusão?
              </Typography>
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Os vínculos como contrato, processo e usuário relacionados ao
                cliente também serão deletados.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  handleClose();
                  deleteClient(selectedClient.id);
                }}
                autoFocuscolor="primary"
                variant="contained"
              >
                Confirmar
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
      {showSuccess && (
        <>
          <ToastAnimated />
          {showToast({
            type: 'success',
            message: 'Cliente deletado com sucesso!'
          })}
          {setTimeout(() => window.location.reload(), 1000)}
        </>
      )}
    </Card>
  ) : (
    <Card>
      <Box sx={{ minWidth: 1050 }}>
        <Table>
          <TableHead>
            <TableRow></TableRow>
          </TableHead>
          <TableBody>
            <TableCell>
              <Typography color="textSecondary" variant="body1">
                Não existem clientes cadastrados.
              </Typography>
            </TableCell>
          </TableBody>
        </Table>
      </Box>
    </Card>
  );
};

export default ClientManagement;
