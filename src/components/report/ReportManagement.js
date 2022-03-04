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
import { Delete, DownloadRounded, Edit } from '@material-ui/icons';
import SearchBar from 'material-ui-search-bar';
import moment from 'moment';
import { useContext, useRef, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useNavigate } from 'react-router';
import { UserContext } from 'src/contexts/UserContext';
import { API } from 'src/services/api';
import ToastAnimated, { showToast } from '../Toast';

const ReportManagement = (listReports) => {
  const navigate = useNavigate();
  const showExportSuccess = useRef(false);
  const showSuccess = useRef(false);
  const { data } = useContext(UserContext);

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(listReports.reports);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedReport, setSelectedReport] = useState([]);
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
   * Exporta um relatório
   * @param {*} values
   */
  async function exportReport(report) {
    showExportSuccess.current = false;
    setSubmitting(true);

    const req = new XMLHttpRequest();
    req.open('GET', report.filters.link_report, true);
    req.setRequestHeader('Access-Control-Allow-Origin', '*');
    req.responseType = 'blob';
    req.onload = function teste() {
      const blob = req.response;
      const fileName = `${report.name}-${moment().format(
        'DD-MM-YYYY hh:mm:ss'
      )}`;
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      showExportSuccess.current = true;
      link.click();
    };

    req.send();
    setSubmitting(false);
  }

  /**
   * Obtém os relatórios
   */
  async function getReports() {
    const tokenUser = window.localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${tokenUser}` }
    };
    await API.get('advocates/reports', config)
      .then((response) => {
        setRows(response.data.data);
      })
      .catch((err) => console.error(err));
  }

  /**
   * Deleta um relatório
   * @param {*} values
   */
  async function deleteReport(reportId) {
    showSuccess.current = false;
    const token = window.localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    await API.delete(`advocates/reports/${reportId}`, config)
      .then(() => {
        showSuccess.current = true;
        getReports();
      })
      .catch((err) => {
        console.log(err);
        showSuccess.current = false;
      })
      .finally(() => {
        showSuccess.current = true;
      });
  }

  /**
   * Busca os clientes na tabela
   * @param {} value
   */
  const searchReports = (value) => {
    if (value === '' || value === undefined) {
      setRows(listReports.reports);
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
    searchReports(searched);
  };

  return listReports.reports.length > 0 ? (
    <Card sx={{ mt: 3, mb: 4 }}>
      <PerfectScrollbar>
        <Box>
          <Card>
            <CardContent>
              <Box>
                <SearchBar
                  style={{ display: '-webkit-inline-box' }}
                  placeholder="Buscar relatório"
                  value={searched}
                  onChange={(value) => searchReports(value)}
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
                <TableCell>Tipo</TableCell>
                <TableCell>Nome</TableCell>
                <TableCell>Formato da exportação</TableCell>
                <TableCell>Data de criação</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.slice(0, limit).map((report) => (
                <TableRow hover key={report.id}>
                  <TableCell>
                    <Typography color="textPrimary" variant="body1">
                      {report.type}
                    </Typography>
                  </TableCell>
                  <TableCell>{report.name}</TableCell>
                  <TableCell>{report.export_format}</TableCell>
                  <TableCell>
                    {moment(report.created_at).format('DD/MM/YYYY')}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Editar">
                      {checkedPermission(9, 2) ? (
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
                            showExportSuccess.current = false;
                            showSuccess.current = false;
                            navigate('/reports/edit', {
                              state: { report, show: true }
                            });
                          }}
                        ></Edit>
                      )}
                    </Tooltip>
                    <Tooltip
                      title={submitting ? 'Fazendo download..' : 'Download'}
                    >
                      {checkedPermission(9, 1) ? (
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
                          onClick={() => {
                            exportReport(report);
                            showSuccess.current = false;
                          }}
                          disabled={submitting}
                        ></DownloadRounded>
                      )}
                    </Tooltip>
                    <Tooltip title="Excluir">
                      {checkedPermission(9, 3) ? (
                        <Delete
                          style={{
                            color: '#c0c0c0',
                            cursor: 'not-allowed',
                            pointerEvents: 'none'
                          }}
                          cursor="pointer"
                          onClick={() => {
                            showExportSuccess.current = false;
                            showSuccess.current = false;
                            setSelectedReport(report);
                            setShowModal(true);
                          }}
                        ></Delete>
                      ) : (
                        <Delete
                          cursor="pointer"
                          onClick={() => {
                            showExportSuccess.current = false;
                            showSuccess.current = false;
                            setSelectedReport(report);
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
                Tem certeza que deseja excluir ? Todos os vinculos, como os
                filtros, relacionados ao relatório também serão deletados.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  handleClose();
                  deleteReport(selectedReport.id);
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
            message: 'Relatório baixado com sucesso!'
          })}
        </>
      )}
      {showSuccess.current && (
        <>
          <ToastAnimated />
          {showToast({
            type: 'success',
            message: 'Relatório deletado com sucesso!'
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
                Não existem relatórios cadastrados.
              </Typography>
            </TableCell>
          </TableBody>
        </Table>
      </Box>
    </Card>
  );
};

export default ReportManagement;
