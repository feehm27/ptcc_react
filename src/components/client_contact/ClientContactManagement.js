import {
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography
} from '@material-ui/core';
import { Visibility } from '@material-ui/icons';
import SearchBar from 'material-ui-search-bar';
import moment from 'moment';
import { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useNavigate } from 'react-router';

const ClientContactManagement = (listMessages) => {
  const navigate = useNavigate();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(listMessages.messages);
  const [searched, setSearched] = useState('');

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  /**
   * Busca os clientes na tabela
   * @param {} value
   */
  const searchSubject = (value) => {
    if (value === '' || value === undefined) {
      setRows(listMessages.messages);
    } else {
      const filteredRows = rows.filter((row) => {
        return row.subject.toLowerCase().includes(value.toLowerCase());
      });
      setRows(filteredRows);
    }
  };

  /**
   * Cancela a busca na tabela
   */
  const cancelSearch = () => {
    setSearched('');
    searchSubject(searched);
  };

  return listMessages.messages.length > 0 ? (
    <Card sx={{ mt: 3, mb: 4 }}>
      <PerfectScrollbar>
        <Box>
          <Card>
            <CardContent>
              <Box>
                <SearchBar
                  style={{ display: '-webkit-inline-box' }}
                  placeholder="Buscar por assunto"
                  value={searched}
                  onChange={(value) => searchSubject(value)}
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
                <TableCell>Nome do destinatário</TableCell>
                <TableCell>Assunto</TableCell>
                <TableCell>Data de envio</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.slice(0, limit).map((message) => (
                <TableRow hover key={message.id}>
                  <TableCell>
                    <Typography color="textPrimary" variant="body1">
                      {message.recipient_name}
                    </Typography>
                  </TableCell>
                  <TableCell>{message.subject}</TableCell>
                  <TableCell>
                    {moment(message.created_at).format('DD/MM/YYYY')}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Visualizar">
                      <Visibility
                        cursor="pointer"
                        onClick={() => {
                          navigate('/contacts/show', {
                            state: { message, show: true }
                          });
                        }}
                      ></Visibility>
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

export default ClientContactManagement;
