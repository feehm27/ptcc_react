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
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useNavigate } from 'react-router';

const UserProfileList = ({ profiles, ...rest }) => {
  const navigate = useNavigate();
  return (
    <Card {...rest}>
      <PerfectScrollbar>
        <Box>
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
                        navigate('/profiles/types', {
                          state: { profile }
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
