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
  Typography
} from '@material-ui/core';
import { Edit, LockOpenRounded, LockRounded } from '@material-ui/icons';
import moment from 'moment';
import { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useNavigate } from 'react-router';
import { API } from 'src/services/api';
import ToastAnimated, { showToast } from '../Toast';

const UserManagement = (listUsers) => {
  const navigate = useNavigate();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showLockOrUnlock, setShowLockOrUnlock] = useState(false);
  const [selectedUser, setSelectedUser] = useState([]);

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

  return listUsers.users.length > 0 ? (
    <Card>
      <PerfectScrollbar>
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
              {listUsers.users.slice(0, limit).map((user) => (
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
                    <Edit
                      cursor="pointer"
                      onClick={() => {
                        navigate('/users/edit', {
                          state: { user }
                        });
                      }}
                    ></Edit>
                    {user.blocked ? (
                      <LockOpenRounded
                        cursor="pointer"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowModal(true);
                        }}
                      ></LockOpenRounded>
                    ) : (
                      <LockRounded
                        cursor="pointer"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowModal(true);
                        }}
                      ></LockRounded>
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
        count={listUsers.users.length}
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
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Após o bloqueio o usuário não terá acesso a nenhuma
                funcionalidade do sistema.
              </DialogContentText>
            </DialogContent>
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
    <Card>
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
