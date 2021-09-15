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

const ProfileTypes = () => {
  const { profile } = useLocation().state;
  const { menus } = profile;

  const permissions = menus.map((menu) => {
    console.log(menu.permissions);
    return menu;
  });

  console.log(permissions);

  const [selectedMenuIds, setSelectedMenuIds] = useState([]);

  const handleSelectAll = (event) => {
    let newSelectedMenuIds;

    if (event.target.checked) {
      newSelectedMenuIds = menus.map((menu) => menu.id);
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
                Tipo de Perfil: {profile.name}
              </Typography>
              <Box>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedMenuIds.length === menus.length}
                          color="primary"
                          indeterminate={
                            selectedMenuIds.length > 0 &&
                            selectedMenuIds.length < menus.length
                          }
                          onChange={handleSelectAll}
                        />
                      </TableCell>
                      <TableCell>Menus</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {menus.map((menu) => (
                      <TableRow
                        hover
                        key={menu.id}
                        selected={selectedMenuIds.indexOf(menu.id) !== -1}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedMenuIds.indexOf(menu.id) !== -1}
                            onChange={(event) =>
                              handleSelectOne(event, menu.id)
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
                              {menu.name}
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

export default ProfileTypes;
