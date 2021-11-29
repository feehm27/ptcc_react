import {
  Box,
  Button,
  Card,
  CardContent,
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
import { Delete, DownloadRounded, Edit, Visibility } from '@material-ui/icons';
import SearchBar from 'material-ui-search-bar';
import moment from 'moment';
import { useContext, useRef, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useNavigate } from 'react-router';
import { UserContext } from 'src/contexts/UserContext';
import { API } from 'src/services/api';
import ToastAnimated, { showToast } from '../Toast';

const ClientManagement = (listClients) => {
  const navigate = useNavigate();
  const showExportSuccess = useRef(false);
  const { data } = useContext(UserContext);

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(listClients.clients);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedClient, setSelectedClient] = useState([]);
  const [searched, setSearched] = useState('');

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const checkedPermission = (positionMenu, positionPermission) => {
    if (data && !data.isAdmin) {
      return (
        data.checkeds.permissions_checked[positionMenu][positionPermission]
          .checked === 0
      );
    } else {
      return false;
    }
  };

  /**
   * Exporta todos os clientes em PDF
   * @param {*} values
   */
  async function exportClient(clientId) {
    setSubmitting(true);
    showExportSuccess.current = false;

    const token = window.localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    await API.post('/advocates/clients/download', { id: clientId }, config)
      .then((response) => {
        if (response.data.link) {
          window.open(response.data.link);
          showExportSuccess.current = true;
        }
      })
      .catch(() => {
        showExportSuccess.current = false;
      });

    setSubmitting(false);
  }

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

  /**
   * Busca os clientes na tabela
   * @param {} value
   */
  const searchClients = (value) => {
    if (value === '' || value === undefined) {
      setRows(listClients.clients);
    } else {
      const filteredRows = rows.filter((row) => {
        return row.name.toLowerCase().includes(value.toLowerCase());
      });
      setRows(filteredRows);
    }
  };

  /**
   * Cancela a busca na tabela
   */
  const cancelSearch = () => {
    setSearched('');
    searchClients(searched);
  };

  return listClients.clients.length > 0 ? (
    <Card sx={{ mt: 3, mb: 4 }}>
      <PerfectScrollbar>
        <Box>
          <Card>
            <CardContent>
              <Box>
                <SearchBar
                  style={{ display: '-webkit-inline-box' }}
                  placeholder="Buscar cliente"
                  value={searched}
                  onChange={(value) => searchClients(value)}
                  onCancelSearch={() => cancelSearch()}
                ></SearchBar>
              </Box>
            </CardContent>
          </Card>
        </Box>
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
              {rows.slice(0, limit).map((client) => (
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
                    <Tooltip title="Visualizar">
                      {checkedPermission(3, 1) ? (
                        <Visibility
                          style={{
                            color: '#c0c0c0',
                            cursor: 'not-allowed',
                            pointerEvents: 'none'
                          }}
                        ></Visibility>
                      ) : (
                        <Visibility
                          cursor="pointer"
                          onClick={() => {
                            navigate('/clients/edit', {
                              state: { client, show: true }
                            });
                          }}
                        ></Visibility>
                      )}
                    </Tooltip>
                    <Tooltip title="Editar">
                      {checkedPermission(3, 2) ? (
                        <Edit
                          style={{
                            color: '#c0c0c0',
                            cursor: 'not-allowed',
                            pointerEvents: 'none'
                          }}
                          cursor="pointer"
                        ></Edit>
                      ) : (
                        <Edit
                          cursor="pointer"
                          onClick={() => {
                            navigate('/clients/edit', {
                              state: { client, show: false }
                            });
                          }}
                        ></Edit>
                      )}
                    </Tooltip>
                    <Tooltip title={submitting ? 'Exportando..' : 'Exportar'}>
                      {checkedPermission(3, 3) ? (
                        <DownloadRounded
                          style={{
                            color: '#c0c0c0',
                            cursor: 'not-allowed',
                            pointerEvents: 'none'
                          }}
                          cursor="pointer"
                        ></DownloadRounded>
                      ) : (
                        <DownloadRounded
                          cursor="pointer"
                          onClick={() => exportClient(client.id)}
                          disabled={submitting}
                        ></DownloadRounded>
                      )}
                    </Tooltip>
                    <Tooltip title="Excluir">
                      {checkedPermission(3, 4) ? (
                        <Delete
                          style={{
                            color: '#c0c0c0',
                            cursor: 'not-allowed',
                            pointerEvents: 'none'
                          }}
                          cursor="pointer"
                          onClick={() => {
                            setSelectedClient(client);
                            setShowModal(true);
                          }}
                        ></Delete>
                      ) : (
                        <Delete
                          cursor="pointer"
                          onClick={() => {
                            setSelectedClient(client);
                            setShowModal(true);
                          }}
                        ></Delete>
                      )}
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
        count={rows.length}
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
      {showExportSuccess.current && (
        <>
          <ToastAnimated />
          {showToast({
            type: 'success',
            message: 'Cliente exportado com sucesso!'
          })}
        </>
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
    <Card sx={{ mt: 3, mb: 4 }}>
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
