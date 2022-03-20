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
import { Delete, Visibility } from '@material-ui/icons';
import SearchBar from 'material-ui-search-bar';
import { useRef, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useNavigate } from 'react-router';
import { API } from 'src/services/api';
import ToastAnimated, { showToast } from '../Toast';

const AdvocateContactManagement = (listClients) => {
  const navigate = useNavigate();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(listClients.clients);
  const [searched, setSearched] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState([]);

  const showSuccess = useRef(false);
  const showError = useRef(false);

  const handleClose = () => {
    setShowModal(false);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  /**
   * Obtém as informações das mensagens
   */
  async function getMessages() {
    const config = {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
      }
    };
    await API.get(`advocates/messages/received`, config)
      .then((response) => {
        setRows(response.data.data);
      })
      .catch((err) => console.error(err));
  }

  /**
   * Envia os dados do advogado
   * @param {*} values
   */
  async function deleteAllMessages() {
    showSuccess.current = false;
    const token = window.localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    const values = {
      all_messages: true,
      client_id: selectedClientId
    };

    await API.post(`advocates/messages/received/destroy`, values, config)
      .then(() => {
        showSuccess.current = true;
        getMessages();
      })
      .catch((err) => {
        console.log(err);
        showError.current = true;
      });
  }

  /**
   * Busca os clientes na tabela
   * @param {} value
   */
  const searchClient = (value) => {
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
    searchClient(searched);
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
                  placeholder="Buscar por cliente"
                  value={searched}
                  onChange={(value) => searchClient(value)}
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
                <TableCell>Nome do Cliente</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>CPF</TableCell>
                <TableCell>Qtd. Mensagens</TableCell>
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
                  <TableCell>
                    <Typography color="textPrimary" variant="body1">
                      {client.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="textPrimary" variant="body1">
                      {client.cpf}
                    </Typography>
                  </TableCell>
                  <TableCell>{`${client.messages.length}`}</TableCell>
                  <TableCell>
                    <Tooltip title="Visualizar mensagens">
                      <Visibility
                        cursor="pointer"
                        onClick={() => {
                          navigate('/advocates/contacts/show', {
                            state: {
                              client,
                              show: true
                            }
                          });
                          showSuccess.current = false;
                          showError.current = false;
                        }}
                      ></Visibility>
                    </Tooltip>
                    <Tooltip title="Excluir todas as mensagens">
                      <Delete
                        cursor="pointer"
                        onClick={() => {
                          setSelectedClientId(client.id);
                          setShowModal(true);
                          showSuccess.current = false;
                          showError.current = false;
                        }}
                      ></Delete>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
        {console.log(showSuccess.current)}
        {showSuccess.current && (
          <>
            <ToastAnimated />
            {showToast({
              type: 'success',
              message: 'Mensagens deletadas com sucesso!'
            })}
          </>
        )}
        {showError.current && (
          <>
            <ToastAnimated />
            {showToast({
              type: 'error',
              message: 'Ocorreu um erro inesperado deletar as mensagens!'
            })}
          </>
        )}
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
                Todas as mensagens relacionadas a esse cliente, incluindo suas
                respostas também serão deletadas. Tem certeza que deseja
                confirmar a exclusão?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  showSuccess.current = false;
                  showError.current = false;
                  handleClose();
                  deleteAllMessages();
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
                Não existem mensagens recebidas.
              </Typography>
            </TableCell>
          </TableBody>
        </Table>
      </Box>
    </Card>
  );
};

export default AdvocateContactManagement;
