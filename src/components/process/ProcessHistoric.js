import {
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
  Tooltip,
  Typography
} from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import moment from 'moment';
import { useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { maskProcessNumber } from 'src/helpers/Helpers';
import { API } from 'src/services/api';
import ToastAnimated, { showToast } from '../Toast';

const ProcessHistoric = () => {
  const { process, historics } = useLocation().state;
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [selectedHistoricId, setSelectedHistoricId] = useState();
  const [rows, setRows] = useState(historics);

  const showSuccessDelete = useRef(false);

  const handleClose = () => {
    setShowModalDelete(false);
  };

  /**
   * Obtém a lista de historico do processo
   */
  async function getHistorics() {
    showSuccessDelete.current = false;
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
    showSuccessDelete.current = false;
    const token = window.localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    await API.delete(
      `advocates/processes/historic/${selectedHistoricId}`,
      config
    )
      .then(() => {
        showSuccessDelete.current = true;
        getHistorics();
      })
      .catch((err) => {
        console.log(err);
        showSuccessDelete.current = false;
      });
  }

  return rows.length > 0 ? (
    <Card>
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
                  deleteHistoric();
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
      {showSuccessDelete.current && (
        <>
          <ToastAnimated />
          {showToast({
            type: 'success',
            message: 'Histórico deletado com sucesso!'
          })}
        </>
      )}
    </Card>
  ) : (
    <Card sx={{ mt: 3, mb: 4, ml: 2, mr: 2 }}>
      <Divider />
      <CardContent>
        <Typography color="textSecondary" variant="body1">
          Não existe histórico para o processo selecionado.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProcessHistoric;
