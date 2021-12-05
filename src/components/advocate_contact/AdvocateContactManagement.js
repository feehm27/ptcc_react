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
import { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useNavigate } from 'react-router';

const AdvocateContactManagement = (listClients) => {
  const navigate = useNavigate();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(listClients.clients);
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
                <TableCell>Cliente</TableCell>
                <TableCell>CPF</TableCell>
                <TableCell>Qtd. Mensagens Enviadas</TableCell>
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
                      {client.cpf}
                    </Typography>
                  </TableCell>
                  <TableCell>{`${client.messages.length} mensagens`}</TableCell>
                  <TableCell>
                    <Tooltip title="Visualizar mensagens">
                      <Visibility
                        cursor="pointer"
                        onClick={() => {
                          navigate('/advocates/contacts/show', {
                            state: { messages: client.messages, show: true }
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

export default AdvocateContactManagement;
