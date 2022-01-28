import DateFnsUtils from '@date-io/date-fns';
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
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@material-ui/core';
import {
  Add,
  Delete,
  DownloadForOfflineRounded,
  Edit,
  List
} from '@material-ui/icons';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider
} from '@material-ui/pickers';
import { ptBR } from 'date-fns/locale';
import { Formik } from 'formik';
import { isEmpty } from 'lodash';
import SearchBar from 'material-ui-search-bar';
import moment from 'moment';
import { useContext, useRef, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useNavigate } from 'react-router';
import ProcessConstantes from 'src/constants/ProcessConstantes';
import { UserContext } from 'src/contexts/UserContext';
import { maskProcessNumber } from 'src/helpers/Helpers';
import ProcessAddSchema from 'src/schemas/ProcessAddSchema';
import { API } from 'src/services/api';
import ToastAnimated, { showToast } from '../Toast';

const ProcessManagement = (listProcesses) => {
  const navigate = useNavigate();
  const { data } = useContext(UserContext);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(listProcesses.processes);
  const [showModal, setShowModal] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState([]);
  const [searched, setSearched] = useState('');
  const [selectedDate, handleDateChange] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedProcessId, setSelectedProcessId] = useState();

  const showSuccess = useRef(false);

  const showSuccessHistory = useRef(false);
  const showErrorHistory = useRef(false);

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleCloseAdd = () => {
    setShowAdd(false);
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
  async function sendProcessHistoric(values) {
    setSubmitting(true);

    const config = {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
      }
    };

    values.modification_date = moment(selectedDate).format('YYYY-MM-DD');
    values.process_id = selectedProcessId;

    await API.post('advocates/processes/historic', values, config)
      .then(() => {
        showSuccessHistory.current = true;
      })
      .catch((err) => {
        showErrorHistory.current = true;
        console.error(err);
      });

    setSubmitting(false);
  }

  /**
   * Envia os dados do formulário
   * @param {*} values
   */
  const handleSubmit = (values, errors) => {
    if (values.modification_date !== 'Invalid Date') {
      delete errors.modification_date;
    }

    if (isEmpty(errors)) sendProcessHistoric(values);
  };

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
                  onChange={(value) => {
                    showSuccessHistory.current = false;
                    showErrorHistory.current = false;
                    searchProcesses(value);
                  }}
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
                <TableCell>Data de inicio</TableCell>
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
                    <Tooltip title="Gerenciar modificações">
                      {checkedPermission(5, 1) ? (
                        <List
                          style={{
                            color: '#c0c0c0',
                            cursor: 'not-allowed',
                            pointerEvents: 'none'
                          }}
                        ></List>
                      ) : (
                        <List
                          cursor="pointer"
                          onClick={() => {
                            showSuccessHistory.current = false;
                            showErrorHistory.current = false;
                            showSuccess.current = false;
                            navigate('/processes/historic', {
                              state: { process, historics: process.historics }
                            });
                          }}
                        ></List>
                      )}
                    </Tooltip>
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
                            showSuccessHistory.current = false;
                            showErrorHistory.current = false;
                            showSuccess.current = false;
                            setSelectedProcessId(process.id);
                            setShowAdd(true);
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
                            showSuccessHistory.current = false;
                            showErrorHistory.current = false;
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
                            showSuccessHistory.current = false;
                            showErrorHistory.current = false;
                            setSelectedProcess(process);
                            setShowModal(true);
                          }}
                        ></Delete>
                      ) : (
                        <Delete
                          cursor="pointer"
                          onClick={() => {
                            showSuccessHistory.current = false;
                            showErrorHistory.current = false;
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
      {showAdd && (
        <div>
          <Dialog
            fullWidth
            open={showAdd}
            onClose={handleCloseAdd}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              <Typography color="primary" variant="h5" textAlign="center">
                Adicionar Modificações
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Formik
                initialValues={{
                  modification_date: '',
                  status_process: '',
                  modification_description: ''
                }}
                validationSchema={ProcessAddSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, values, handleBlur, handleChange, submitForm }) => (
                  <form
                    autoComplete="off"
                    onSubmit={(e) => {
                      e.preventDefault();
                      showSuccessHistory.current = false;
                      showErrorHistory.current = false;
                      handleSubmit(values, errors);
                    }}
                  >
                    <Card>
                      <Divider />
                      <CardContent>
                        <Grid container spacing={3}>
                          <Grid item md={6} xs={12}>
                            <MuiPickersUtilsProvider
                              locale={ptBR}
                              utils={DateFnsUtils}
                            >
                              <KeyboardDatePicker
                                fullWidth
                                openTo="year"
                                invalidDateMessage="Data inválida"
                                format="dd/MM/yyyy"
                                label="Data de modificação"
                                views={['year', 'month', 'date']}
                                value={selectedDate}
                                inputVariant="outlined"
                                onChange={(e) => {
                                  showSuccessHistory.current = false;
                                  showErrorHistory.current = false;
                                  handleDateChange(e);
                                }}
                                onBlur={(e) => {
                                  handleBlur(e);
                                }}
                                name="modification_date"
                                required
                              />
                            </MuiPickersUtilsProvider>
                          </Grid>
                          <Grid item md={6} xs={12}>
                            <TextField
                              error={errors.status_process}
                              fullWidth
                              helperText={errors.status_process}
                              label="Etapa do processo"
                              name="status_process"
                              onBlur={(event) => {
                                handleBlur(event);
                              }}
                              onChange={(event) => {
                                showSuccessHistory.current = false;
                                showErrorHistory.current = false;
                                handleChange(event);
                              }}
                              required
                              select
                              SelectProps={{ native: true }}
                              value={values.status_process}
                              variant="outlined"
                            >
                              {ProcessConstantes.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </TextField>
                          </Grid>
                          <Grid item md={12} xs={12}>
                            <TextField
                              error={errors.modification_description}
                              fullWidth
                              helperText={errors.modification_description}
                              label="Descrição da modificação"
                              rows="6"
                              multiline
                              rowsMax={Infinity}
                              onBlur={(event) => {
                                handleBlur(event);
                              }}
                              onChange={(event) => {
                                showSuccessHistory.current = false;
                                showErrorHistory.current = false;
                                handleChange(event);
                              }}
                              name="modification_description"
                              required
                            />
                          </Grid>
                          <DialogActions>
                            <Button
                              onClick={() => {
                                handleCloseAdd();
                                showSuccessHistory.current = false;
                                showErrorHistory.current = false;
                              }}
                              color="primary"
                            >
                              Cancelar
                            </Button>
                            {submitting ? (
                              <Button
                                color="primary"
                                variant="contained"
                                disabled
                              >
                                Carregando..
                              </Button>
                            ) : (
                              <Button
                                type="submit"
                                onClick={submitForm}
                                autoFocuscolor="primary"
                                variant="contained"
                              >
                                Adicionar
                              </Button>
                            )}
                          </DialogActions>
                        </Grid>
                      </CardContent>
                    </Card>
                  </form>
                )}
              </Formik>
            </DialogContent>
          </Dialog>
        </div>
      )}
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
                  showSuccessHistory.current = false;
                  showErrorHistory.current = false;
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
      {showSuccessHistory.current && (
        <>
          <ToastAnimated />
          {showToast({
            type: 'success',
            message: 'Histórico adicionado com sucesso!'
          })}
        </>
      )}
      {showErrorHistory.current && (
        <>
          <ToastAnimated />
          {showToast({
            type: 'error',
            message: 'Ocorreu um erro inesperado ao adicionar o histórico!'
          })}
        </>
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
