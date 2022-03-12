import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Tooltip,
  Typography
} from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import moment from 'moment';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { maskProcessNumber } from 'src/helpers/Helpers';
import { API } from 'src/services/api';
import ToastAnimated, { showToast } from '../Toast';

const ProcessHistoric = () => {
  const navigate = useNavigate();
  const { process, historics } = useLocation().state;
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [selectedHistoricId, setSelectedHistoricId] = useState();
  const [rows, setRows] = useState(historics);

  const handleClose = () => {
    setShowModalDelete(false);
  };

  /**
   * Obtém a lista de historico do processo
   */
  async function getHistorics() {
    const tokenUser = window.localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${tokenUser}` }
    };

    await API.get(
      `advocates/processes/historic?process_id=${process.id}`,
      config
    )
      .then((response) => {
        setRows(response.data.data);
      })
      .catch((err) => console.error(err));
  }

  /**
   * Envia os dados do advogado
   * @param {*} values
   */
  async function deleteHistoric() {
    const token = window.localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    await API.delete(
      `advocates/processes/historic/${selectedHistoricId}`,
      config
    )
      .then(() => {
        getHistorics();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return rows.length > 0 ? (
    <>
      <Card style={{ marginLeft: '14px', marginTop: '14px' }}>
        <CardHeader
          title={`Histórico do Processo - ${maskProcessNumber(process.number)}`}
        />
        <Divider />
        <CardContent>
          {rows.map((historic) => (
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              <ListItem>
                <ListItemAvatar
                  sx={{
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  <Tooltip title="Excluir histórico">
                    <Delete
                      style={{
                        color: '#FF0000'
                      }}
                      cursor="pointer"
                      onClick={() => {
                        setShowModalDelete(true);
                        setSelectedHistoricId(historic.id);
                      }}
                    ></Delete>
                  </Tooltip>
                  <Typography
                    style={{
                      ml: '10px'
                    }}
                  >
                    {' '}
                    {moment(historic.modification_date).format('DD/MM/YYYY')}
                  </Typography>
                </ListItemAvatar>
                <ListItemText
                  sx={{ ml: 5 }}
                  primary={`Status alterado para "${historic.status_process}"`}
                  secondary={
                    <div>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      ></Typography>
                      {`Descrição da modificação: ${historic.modification_description}`}
                    </div>
                  }
                />
              </ListItem>
              <Divider />
            </List>
          ))}
        </CardContent>
        {showModalDelete && (
          <div>
            <Dialog
              open={showModalDelete}
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
                  Tem certeza que deseja excluir o histórico? Essa ação é
                  irreversivel.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancelar
                </Button>
                <Button
                  onClick={() => {
                    handleClose();
                    <>
                      <ToastAnimated />
                      {showToast({
                        type: 'success',
                        message: 'Histórico deletado com sucesso!'
                      })}
                      {deleteHistoric()}
                    </>;
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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'left',
          m: 3
        }}
      >
        <Stack direction="row" spacing={2}>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => navigate('/processes')}
          >
            Voltar
          </Button>
        </Stack>
      </Box>
    </>
  ) : (
    <>
      <Card sx={{ m: 3 }}>
        <Divider />
        <CardContent>
          <Typography color="textSecondary" variant="body1">
            Não existe histórico para o processo selecionado.
          </Typography>
        </CardContent>
      </Card>
      <Box
        sx={{
          display: 'flex',
          m: 3
        }}
      >
        <Stack direction="row" spacing={2}>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => navigate('/processes')}
          >
            Voltar
          </Button>
        </Stack>
      </Box>
    </>
  );
};

export default ProcessHistoric;
