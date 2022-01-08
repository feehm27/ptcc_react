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
import { useContext, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useNavigate } from 'react-router';
import { API } from 'src/services/api';
import { UserContext } from 'src/contexts/UserContext';
import ToastAnimated, { showToast } from '../Toast';

const ContractManagement = (listContracts) => {
  const navigate = useNavigate();
  const { data } = useContext(UserContext);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(listContracts.contracts);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedContract, setSelectedContract] = useState([]);
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
   * Envia os dados do advogado
   * @param {*} values
   */
  async function deleteContract(contractId) {
    setShowSuccess(false);
    const token = window.localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    await API.delete(`advocates/contracts/${contractId}`, config)
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
  const searchContracts = (value) => {
    if (value === '' || value === undefined) {
      setRows(listContracts.contracts);
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
    searchContracts(searched);
  };

  return listContracts.contracts.length > 0 ? (
    <Card sx={{ mt: 3, mb: 4 }}>
      <PerfectScrollbar>
        <Box>
          <Card>
            <CardContent>
              <Box>
                <SearchBar
                  style={{ display: '-webkit-inline-box' }}
                  placeholder="Buscar contrato"
                  value={searched}
                  onChange={(value) => searchContracts(value)}
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
                <TableCell>ID Contrato</TableCell>
                <TableCell>Nome do cliente</TableCell>
                <TableCell>Data de inicio</TableCell>
                <TableCell>Data de fim</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.slice(0, limit).map((contract) => (
                <TableRow hover key={contract.id}>
                  <TableCell>
                    <Typography color="textPrimary" variant="body1">
                      {contract.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography color="textPrimary" variant="body1">
                      {contract.client.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {moment(contract.start_date).format('DD/MM/YYYY')}
                  </TableCell>
                  <TableCell>
                    {moment(contract.finish_date).format('DD/MM/YYYY')}
                  </TableCell>
                  <TableCell>
                    {contract.canceled_at !== null ? (
                      <Typography color="error">Cancelado</Typography>
                    ) : (
                      <Typography>Ativo</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Visualizar">
                      {checkedPermission(4, 1) ? (
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
                            navigate('/contracts/edit', {
                              state: { contract }
                            });
                          }}
                        ></Visibility>
                      )}
                    </Tooltip>
                    <Tooltip title="Editar">
                      {checkedPermission(4, 2) ? (
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
                            navigate('/contracts/edit', {
                              state: { contract, show: false }
                            });
                          }}
                        ></Edit>
                      )}
                    </Tooltip>
                    <Tooltip title="Exportar">
                      {checkedPermission(4, 3) ? (
                        <DownloadRounded
                          style={{
                            color: '#c0c0c0',
                            cursor: 'not-allowed',
                            pointerEvents: 'none'
                          }}
                          cursor="pointer"
                        ></DownloadRounded>
                      ) : (
                        <DownloadRounded cursor="pointer"></DownloadRounded>
                      )}
                    </Tooltip>
                    <Tooltip title="Excluir">
                      {checkedPermission(4, 6) ? (
                        <Delete
                          style={{
                            color: '#c0c0c0',
                            cursor: 'not-allowed',
                            pointerEvents: 'none'
                          }}
                          cursor="pointer"
                          onClick={() => {
                            setSelectedContract(contract);
                            setShowModal(true);
                          }}
                        ></Delete>
                      ) : (
                        <Delete
                          cursor="pointer"
                          onClick={() => {
                            setSelectedContract(contract);
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
                Todos os vinculos relacionados ao contrato também serão
                deletados.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  handleClose();
                  deleteContract(selectedContract.id);
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
            message: 'Contrato deletado com sucesso!'
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
                Não existem contratos cadastrados.
              </Typography>
            </TableCell>
          </TableBody>
        </Table>
      </Box>
    </Card>
  );
};

export default ContractManagement;
