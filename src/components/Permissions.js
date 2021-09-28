import { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Card,
  Checkbox,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';

import { useLocation } from 'react-router';

const Permissions = () => {
  const { permissions } = useLocation().state;
  const { menuName } = useLocation().state;

  console.log(permissions);
  console.log(menuName);

  const [selectedMenuIds, setSelectedMenuIds] = useState([]);

  const handleSelectAll = (event) => {
    let newSelectedMenuIds;

    if (event.target.checked) {
      newSelectedMenuIds = permissions.map((menu) => menu.id);
    } else {
      newSelectedMenuIds = [];
    }
    setSelectedMenuIds(newSelectedMenuIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedMenuIds.indexOf(id);
    let newSelectedMenuIds = [];

    if (selectedIndex === -1) {
      newSelectedMenuIds = newSelectedMenuIds.concat(selectedMenuIds, id);
    } else if (selectedIndex === 0) {
      newSelectedMenuIds = newSelectedMenuIds.concat(selectedMenuIds.slice(1));
    } else if (selectedIndex === selectedMenuIds.length - 1) {
      newSelectedMenuIds = newSelectedMenuIds.concat(
        selectedMenuIds.slice(0, -1)
      );
    } else if (selectedIndex > 0) {
      newSelectedMenuIds = newSelectedMenuIds.concat(
        selectedMenuIds.slice(0, selectedIndex),
        selectedMenuIds.slice(selectedIndex + 1)
      );
    }
    setSelectedMenuIds(newSelectedMenuIds);
  };

  return (
    <>
      <Container maxWidth={false}>
        <Box sx={{ pt: 3, width: 350 }}>
          <Card>
            <PerfectScrollbar>
              <Typography sx={{ m: 2 }} color="primary" variant="h3">
                Permissões: {menuName}
              </Typography>
              <Box>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={
                            selectedMenuIds.length === permissions.length
                          }
                          color="primary"
                          indeterminate={
                            selectedMenuIds.length > 0 &&
                            selectedMenuIds.length < permissions.length
                          }
                          onChange={handleSelectAll}
                        />
                      </TableCell>
                      <TableCell>Permissões</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {permissions.map((permission) => (
                      <TableRow
                        hover
                        key={permission.id}
                        selected={selectedMenuIds.indexOf(permission.id) !== -1}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={
                              selectedMenuIds.indexOf(permission.id) !== -1
                            }
                            onChange={(event) =>
                              handleSelectOne(event, permission.id)
                            }
                            value="true"
                          />
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              alignItems: 'center',
                              display: 'flex'
                            }}
                          >
                            <Typography color="textPrimary" variant="body1">
                              {permission.name}
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </PerfectScrollbar>
          </Card>
        </Box>
      </Container>
    </>
  );
};

export default Permissions;
