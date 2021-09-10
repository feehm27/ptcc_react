import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import { useNavigate } from 'react-router';
import customers from 'src/__mocks__/customers';

const UserProfileList = ({ profiles, ...rest }) => {
  const navigate = useNavigate();

  return (
    <Card {...rest}>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tipo de Perfil</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {profiles.map((profile) => (
                <TableRow hover key={profile.id}>
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      <Typography color="textPrimary" variant="body1">
                        {profile.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Button
                      color="primary"
                      size="small"
                      type="submit"
                      variant="contained"
                      onClick={() => {
                        navigate('/permissions', {
                          state: { profile, customers }
                        });
                      }}
                    >
                      Editar Permissões
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
    </Card>
  );
};

UserProfileList.propTypes = {
  profiles: PropTypes.array.isRequired
};

export default UserProfileList;
