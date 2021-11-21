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
import { Edit, LockOpenRounded, LockRounded } from '@material-ui/icons';
import SearchBar from 'material-ui-search-bar';
import moment from 'moment';
import { useContext, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useNavigate } from 'react-router';
import { API } from 'src/services/api';
import { UserContext } from 'src/contexts/UserContext';
import ToastAnimated, { showToast } from '../Toast';

const UserManagement = (listUsers) => {
  const navigate = useNavigate();
  const { data } = useContext(UserContext);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showLockOrUnlock, setShowLockOrUnlock] = useState(false);
  const [rows, setRows] = useState(listUsers.users);
  const [selectedUser, setSelectedUser] = useState([]);
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

  /**
   * Envia os dados do advogado
   * @param {*} values
   */
  async function lockOrUnlockUser(userId, blocked) {
    setShowLockOrUnlock(false);
    const token = window.localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    const values = {
      id: userId,
      blocked
    };

    await API.put(`advocates/users/block`, values, config)
      .then(() => {})
      .catch((err) => {
        console.log(err);
        setShowLockOrUnlock(false);
      })
      .finally(() => {
        setShowLockOrUnlock(true);
      });
  }

  /**
   * Busca os usuários na tabela
   * @param {} value
   */
  const searchUsers = (value) => {
    if (value === '' || value === undefined) {
      setRows(listUsers.users);
    } else {
      const filteredRows = rows.filter((row) => {
        return row.name.toLowerCase().includes(value.toLowerCase());
      });
      setRows(filteredRows);
    }
  };

  /**
   * Cancela a busca na tabela dos usuários
   */
  const cancelSearch = () => {
    setSearched('');
    searchUsers(searched);
  };

  return listUsers.users.length > 0 ? (
    <Card sx={{ mt: 3, mb: 4 }}>
      <PerfectScrollbar>
        <Box>
          <Card>
            <CardContent>
              <Box>
                <SearchBar
                  style={{ display: '-webkit-inline-box' }}
                  placeholder="Buscar usuário"
                  value={searched}
                  onChange={(value) => searchUsers(value)}
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
                <TableCell>Email</TableCell>
                <TableCell>Perfil</TableCell>
                <TableCell>Data de Cadastro</TableCell>
                <TableCell>Acões</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.slice(0, limit).map((user) => (
                <TableRow hover key={user.id}>
                  <TableCell>
                    <Typography color="textPrimary" variant="body1">
                      {user.name}
                    </Typography>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.is_advocate ? 'Advogado' : 'Cliente'}
                  </TableCell>
                  <TableCell>
                    {moment(user.created_at).format('MM/DD/YYYY')}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Editar">
                      {data &&
                      data.checkeds.permissions_checked[10][2].checked === 0 ? (
                        <Edit
                          style={{
                            color: '#c0c0c0',
                            cursor: 'not-allowed',
                            pointerEvents: 'none'
                          }}
                          cursor="pointer"
                          onClick={() => {
                            navigate('/users/edit', {
                              state: { user }
                            });
                          }}
                        ></Edit>
                      ) : (
                        <Edit
                          cursor="pointer"
                          onClick={() => {
                            navigate('/users/edit', {
                              state: { user }
                            });
                          }}
                        ></Edit>
                      )}
                    </Tooltip>

                    {user.blocked ? (
                      <Tooltip title="Desbloquear">
                        {data &&
                        data.checkeds.permissions_checked[10][3].checked ===
                          0 ? (
                          <LockOpenRounded
                            style={{
                              color: '#c0c0c0',
                              cursor: 'not-allowed',
                              pointerEvents: 'none'
                            }}
                            cursor="pointer"
                          ></LockOpenRounded>
                        ) : (
                          <LockOpenRounded
                            cursor="pointer"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowModal(true);
                            }}
                          ></LockOpenRounded>
                        )}
                      </Tooltip>
                    ) : (
                      <Tooltip title="Bloquear">
                        {data &&
                        data.checkeds.permissions_checked[10][3].checked ===
                          0 ? (
                          <LockRounded
                            cursor="pointer"
                            style={{
                              color: '#c0c0c0',
                              cursor: 'not-allowed',
                              pointerEvents: 'none'
                            }}
                          ></LockRounded>
                        ) : (
                          <LockRounded
                            cursor="pointer"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowModal(true);
                            }}
                          ></LockRounded>
                        )}
                      </Tooltip>
                    )}
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
                Confirmar{' '}
                {selectedUser.blocked === 1 ? 'desbloqueio' : 'bloqueio'} do
                usuário?
              </Typography>
            </DialogTitle>
            {selectedUser.blocked === 1 ? (
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Após o desbloqueio o usuário terá acesso a todas as
                  funcionalidades do sistema.
                </DialogContentText>
              </DialogContent>
            ) : (
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Após o bloqueio o usuário não terá acesso a nenhuma
                  funcionalidade do sistema.
                </DialogContentText>
              </DialogContent>
            )}
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  handleClose();
                  lockOrUnlockUser(selectedUser.id, !selectedUser.blocked);
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
      {showLockOrUnlock && (
        <>
          <ToastAnimated />
          {showToast({
            type: 'success',
            message: `Usuário ${
              selectedUser.blocked ? 'desbloqueado' : 'bloqueado'
            } com sucesso!`
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
                Não existem usuários cadastrados.
              </Typography>
            </TableCell>
          </TableBody>
        </Table>
      </Box>
    </Card>
  );
};

export default UserManagement;
