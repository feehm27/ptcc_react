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
import {
  Add,
  Delete,
  DownloadForOfflineRounded,
  Edit
} from '@material-ui/icons';
import SearchBar from 'material-ui-search-bar';
import moment from 'moment';
import { useContext, useRef, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useNavigate } from 'react-router';
import { API } from 'src/services/api';
import { UserContext } from 'src/contexts/UserContext';
import ToastAnimated, { showToast } from '../Toast';

const ProcessManagement = (listProcesses) => {
  const navigate = useNavigate();
  const { data } = useContext(UserContext);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(listProcesses.processes);
  const [showModal, setShowModal] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState([]);
  const [searched, setSearched] = useState('');

  const showSuccess = useRef(false);

  function maskProcessNumber(str) {
    const characteres = ['-', '.'];
    const newStr = str;

    return (
      newStr.substring(0, 7) +
      characteres[0] +
      newStr.substring(7, 9) +
      characteres[1] +
      newStr.substring(10, 14) +
      characteres[1] +
      newStr.substring(15, 16) +
      characteres[1] +
      newStr.substring(17, 19) +
      characteres[1] +
      str.substring(16)
    );
  }

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
   * Obtém os dados do processo
   */
  async function getProcesses() {
    const tokenUser = window.localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${tokenUser}` }
    };
    await API.get('advocates/processes', config)
      .then((response) => {
        setRows(response.data.data);
      })
      .catch((err) => console.error(err));
  }

  /**
   * Envia os dados do advogado
   * @param {*} values
   */
  async function deleteProcess(processId) {
    showSuccess.current = false;
    const token = window.localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    await API.delete(`advocates/processes/${processId}`, config)
      .then(() => {
        showSuccess.current = true;
        getProcesses();
      })
      .catch((err) => {
        console.log(err);
        showSuccess.current = false;
      });
  }

  /**
   * Busca os clientes na tabela
   * @param {} value
   */
  const searchProcesses = (value) => {
    if (value === '' || value === undefined) {
      setRows(listProcesses.processes);
    } else {
      const filteredRows = rows.filter((row) => {
        return row.client.name.toLowerCase().includes(value.toLowerCase());
      });
      setRows(filteredRows);
    }
  };

  /**
   * Cancela a busca na tabela
   */
  const cancelSearch = () => {
    setSearched('');
    searchProcesses(searched);
  };

  return listProcesses.processes.length > 0 ? (
    <Card sx={{ mt: 3, mb: 4 }}>
      <PerfectScrollbar>
        <Box>
          <Card>
            <CardContent>
              <Box>
                <SearchBar
                  style={{ display: '-webkit-inline-box' }}
                  placeholder="Buscar pelo cliente"
                  value={searched}
                  onChange={(value) => searchProcesses(value)}
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
                <TableCell>Número do processo</TableCell>
                <TableCell>Nome do cliente</TableCell>
                <TableCell>Data de início</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.slice(0, limit).map((process) => (
                <TableRow hover key={process.id}>
                  <TableCell>
                    <Typography color="textPrimary" variant="body1">
                      {maskProcessNumber(process.number)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="textPrimary" variant="body1">
                      {process.client.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {moment(process.start_date).format('DD/MM/YYYY')}
                  </TableCell>
                  <TableCell>{process.status}</TableCell>
                  <TableCell>
                    <Tooltip title="Adicionar modificações">
                      {checkedPermission(5, 1) ? (
                        <Add
                          style={{
                            color: '#c0c0c0',
                            cursor: 'not-allowed',
                            pointerEvents: 'none'
                          }}
                        ></Add>
                      ) : (
                        <Add
                          cursor="pointer"
                          onClick={() => {
                            showSuccess.current = false;
                            navigate('/processes/add', {
                              state: { process }
                            });
                          }}
                        ></Add>
                      )}
                    </Tooltip>
                    <Tooltip title="Editar">
                      {checkedPermission(5, 2) ? (
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
                            showSuccess.current = false;
                            navigate('/processes/edit', {
                              state: { process, show: false }
                            });
                          }}
                        ></Edit>
                      )}
                    </Tooltip>
                    <Tooltip title="Download">
                      {checkedPermission(5, 3) ? (
                        <DownloadForOfflineRounded
                          style={{
                            color: '#c0c0c0',
                            cursor: 'not-allowed',
                            pointerEvents: 'none'
                          }}
                          cursor="pointer"
                        ></DownloadForOfflineRounded>
                      ) : (
                        <a
                          style={{ color: 'inherit' }}
                          target="webapp-tab"
                          href={process.file}
                          download={process.file}
                        >
                          <DownloadForOfflineRounded cursor="pointer"></DownloadForOfflineRounded>
                        </a>
                      )}
                    </Tooltip>
                    <Tooltip title="Excluir">
                      {checkedPermission(5, 4) ? (
                        <Delete
                          style={{
                            color: '#c0c0c0',
                            cursor: 'not-allowed',
                            pointerEvents: 'none'
                          }}
                          cursor="pointer"
                          onClick={() => {
                            setSelectedProcess(process);
                            setShowModal(true);
                          }}
                        ></Delete>
                      ) : (
                        <Delete
                          cursor="pointer"
                          onClick={() => {
                            setSelectedProcess(process);
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
                Todos os vinculos relacionados ao processo, incluindo os
                históricos também serão deletados. Essa ação é irreversivel.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  handleClose();
                  deleteProcess(selectedProcess.id);
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
      {showSuccess.current && (
        <>
          <ToastAnimated />
          {showToast({
            type: 'success',
            message: 'Processo deletado com sucesso!'
          })}
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
                Não existem processos cadastrados.
              </Typography>
            </TableCell>
          </TableBody>
        </Table>
      </Box>
    </Card>
  );
};

export default ProcessManagement;
