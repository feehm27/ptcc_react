import { useState, useContext, useEffect } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Grid from '@material-ui/core/Grid';
import { filter, uniqBy } from 'lodash';
import {
  Box,
  Card,
  Checkbox,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';

import { useLocation } from 'react-router';
import { UserContext } from 'src/contexts/UserContext';
import { API } from 'src/services/api';

const ProfileTypes = () => {
  const { profile } = useLocation().state;
  const { data } = useContext(UserContext);

  const [showPermissions, setShowPermissions] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedUserMenuIds, setSelectedUserMenuIds] = useState([]);
  const [selectedUserPermissionsIds, setSelectedUserPermissionsIds] = useState(
    []
  );

  const [Aahhhh, setAahhhh] = useState();
  const [menus, setMenus] = useState([]);
  const [selectedMenuIds, setSelectedMenuIds] = useState([]);
  const [selectedPermissionsIds, setSelectedPermissionsIds] = useState([]);

  /**
   * Obtém os menus e as permissões do usuário
   */
  async function getMenusAndPermissions(token) {
    setIsLoading(true);
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    await API.get('/menu/permissions', config).then((response) => {
      const menusResponse = filter(response.data.data, function (menu) {
        return menu.profile_type_id === profile.id;
      });

      setMenus(menusResponse);
      const newSelectedUserMenuIds = data.permissions.map((menu) => menu.id);
      setSelectedUserMenuIds(newSelectedUserMenuIds);
    });
    setIsLoading(false);
  }

  /**
   * Obtém os ids das permissões do usuário
   * @param {*} menu
   */
  const getPermissionsIds = (menu) => {
    console.log('evento', Aahhhh);

    if (Aahhhh !== undefined && !Aahhhh) {
      setSelectedUserPermissionsIds([]);
      return;
    }

    const menusUser = filter(data.permissions, function (menuUser) {
      return menuUser.id === menu.id;
    });

    if (menusUser.length > 0) {
      const newSelectedUserPermissionsIds = menusUser[0].permissions.map(
        (permission) => permission.id
      );
      setSelectedUserPermissionsIds(newSelectedUserPermissionsIds);
    }
  };

  /**
   * Seleciona todos os checkboxs do menu
   * @param {*} event
   */
  const handleSelectAllMenus = (event) => {
    let newSelectedMenuIds;

    if (event.target.checked) {
      newSelectedMenuIds = menus.map((menu) => menu.id);
    } else {
      newSelectedMenuIds = [];
    }

    setSelectedMenuIds(newSelectedMenuIds);
    setSelectedUserMenuIds(newSelectedMenuIds);
  };

  /**
   * Seleciona todos os checkbox  das permissões
   * @param {*} event
   */
  const handleSelectAllPermissions = (event) => {
    let newSelectedPermissionsIds;

    if (event.target.checked) {
      newSelectedPermissionsIds = selectedMenu.permissions.map(
        (permission) => permission.id
      );
    } else {
      newSelectedPermissionsIds = [];
    }
    setSelectedPermissionsIds(newSelectedPermissionsIds);
    setSelectedUserPermissionsIds(newSelectedPermissionsIds);
  };

  /**
   * Atualiza a lista de menus
   * @param {*} index
   * @param {*} id
   * @param {*} isSelectedUser
   */
  const updateSelectedMenus = (index, id, isSelectedUser) => {
    let newSelectedMenuIds = [];

    if (index === -1) {
      newSelectedMenuIds = newSelectedMenuIds.concat(selectedMenuIds, id);
    } else if (index === 0) {
      newSelectedMenuIds = newSelectedMenuIds.concat(selectedMenuIds.slice(1));
    } else if (index === selectedMenuIds.length - 1) {
      newSelectedMenuIds = newSelectedMenuIds.concat(
        selectedMenuIds.slice(0, -1)
      );
    } else if (index > 0) {
      newSelectedMenuIds = newSelectedMenuIds.concat(
        selectedMenuIds.slice(0, index),
        selectedMenuIds.slice(index + 1)
      );
    }

    if (newSelectedMenuIds.length === 1) {
      const filterSelectedMenuIds = filter(
        selectedUserMenuIds,
        function (selectedMenuId) {
          return selectedMenuId !== newSelectedMenuIds[0];
        }
      );
      newSelectedMenuIds = filterSelectedMenuIds;
    }

    isSelectedUser
      ? setSelectedUserMenuIds(newSelectedMenuIds)
      : setSelectedMenuIds(newSelectedMenuIds);
  };

  /**
   * Seleciona um checbox do menu
   * @param {*} event
   * @param {*} id
   */
  const handleSelectOneMenu = (event, id) => {
    setAahhhh(event.target.checked);

    if (event.target.checked) {
      const menusUser = filter(data.permissions, function (menuUser) {
        return menuUser.id === id;
      });

      if (menusUser.length > 0) {
        const newSelectedUserPermissionsIds = menusUser[0].permissions.map(
          (permission) => permission.id
        );
        setSelectedUserPermissionsIds(newSelectedUserPermissionsIds);
        setSelectedPermissionsIds(newSelectedUserPermissionsIds);
      }
    } else {
      setSelectedPermissionsIds([]);
      setSelectedUserPermissionsIds([]);
    }

    const selectedIndex = selectedMenuIds.indexOf(id);
    updateSelectedMenus(selectedIndex, id, false);

    const selectedIndexUser = selectedUserMenuIds.indexOf(id);
    updateSelectedMenus(selectedIndexUser, id, true);
  };

  /**
   * Atualiza a lista de permissões
   * @param {*} index
   * @param {*} id
   * @param {*} isSelectedUser
   */
  const updateSelectedPermissions = (index, id, isSelectedUser) => {
    let newSelectedPermissionsIds = [];

    if (index === -1) {
      newSelectedPermissionsIds = newSelectedPermissionsIds.concat(
        selectedPermissionsIds,
        id
      );
    } else if (index === 0) {
      newSelectedPermissionsIds = newSelectedPermissionsIds.concat(
        selectedPermissionsIds.slice(1)
      );
    } else if (index === selectedPermissionsIds.length - 1) {
      newSelectedPermissionsIds = newSelectedPermissionsIds.concat(
        selectedPermissionsIds.slice(0, -1)
      );
    } else if (index > 0) {
      newSelectedPermissionsIds = newSelectedPermissionsIds.concat(
        selectedPermissionsIds.slice(0, index),
        selectedPermissionsIds.slice(index + 1)
      );
    }

    if (newSelectedPermissionsIds.length === 1) {
      const filterSelectedPermissionsIds = filter(
        selectedUserPermissionsIds,
        function (selectedMenuId) {
          return selectedMenuId !== newSelectedPermissionsIds[0];
        }
      );
      newSelectedPermissionsIds = filterSelectedPermissionsIds;
    }

    newSelectedPermissionsIds = uniqBy(newSelectedPermissionsIds);

    if (newSelectedPermissionsIds.length === 0) {
      newSelectedPermissionsIds[0] = id;
    }

    isSelectedUser
      ? setSelectedUserPermissionsIds(newSelectedPermissionsIds)
      : setSelectedPermissionsIds(newSelectedPermissionsIds);
  };

  /**
   * Seleciona um checkbox das permissões
   * @param {*} event
   * @param {*} id
   */
  const handleSelectOnePermission = (event, id) => {
    const selectedIndex = selectedPermissionsIds.indexOf(id);
    updateSelectedPermissions(selectedIndex, id, false);

    const selectedIndexUser = selectedUserPermissionsIds.indexOf(id);
    updateSelectedPermissions(selectedIndexUser, id, true);
  };

  /**
   * Use Effect
   */
  useEffect(() => {
    const token = window.localStorage.getItem('token');
    getMenusAndPermissions(token);
  }, []);

  return (
    <Grid container spacing={0} item xs={12} sm={12}>
      <Grid container item xs={6} sm={6}>
        <Box sx={{ pt: 3, width: '100%', ml: 1 }}>
          {isLoading ? (
            <Skeleton
              variant="rectangular"
              animation="wave"
              width="100%"
              height="100%"
            >
              <div style={{ paddingTop: '57%' }} />
            </Skeleton>
          ) : (
            <Card>
              <PerfectScrollbar>
                <Typography sx={{ m: 2 }} color="primary" variant="h3">
                  Menus do {profile.name}
                </Typography>
                <Box>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={
                              selectedMenuIds.length === menus.length ||
                              selectedUserMenuIds.length === menus.length
                            }
                            color="primary"
                            indeterminate={
                              selectedMenuIds.length > 0 &&
                              selectedMenuIds.length < menus.length
                            }
                            onChange={handleSelectAllMenus}
                          />
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {menus.map((menu) => (
                        <TableRow
                          hover
                          key={menu.id}
                          selected={
                            selectedMenuIds.indexOf(menu.id) !== -1 ||
                            selectedUserMenuIds.indexOf(menu.id) !== -1
                          }
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={
                                selectedMenuIds.indexOf(menu.id) !== -1 ||
                                selectedUserMenuIds.indexOf(menu.id) !== -1
                              }
                              onChange={(event) => {
                                handleSelectOneMenu(event, menu.id);
                              }}
                              onClick={() => {
                                setShowPermissions(true);
                                setSelectedMenu(menu);
                                getPermissionsIds(menu);
                              }}
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
                              <Typography
                                color="textPrimary"
                                variant="body1"
                                onClick={() => {
                                  setShowPermissions(true);
                                  setSelectedMenu(menu);
                                  getPermissionsIds(menu);
                                }}
                              >
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
          )}
        </Box>
      </Grid>
      {showPermissions && (
        <Grid container item xs={6} sm={6}>
          <Box sx={{ pt: 3, width: '100%', mr: 1 }}>
            <Card>
              <PerfectScrollbar>
                <Typography sx={{ m: 2 }} color="primary" variant="h3">
                  Permissões: {selectedMenu.name}
                </Typography>
                <Box>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={
                              selectedPermissionsIds.length ===
                                selectedMenu.permissions.length ||
                              selectedUserPermissionsIds.length ===
                                selectedMenu.permissions.length
                            }
                            color="primary"
                            indeterminate={
                              selectedPermissionsIds.length > 0 &&
                              selectedPermissionsIds.length <
                                selectedMenu.permissions.length
                            }
                            onChange={handleSelectAllPermissions}
                          />
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedMenu.permissions.map((permission) => (
                        <TableRow
                          hover
                          key={permission.id}
                          selected={
                            selectedPermissionsIds.indexOf(permission.id) !== -1
                          }
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={
                                selectedPermissionsIds.indexOf(
                                  permission.id
                                ) !== -1 ||
                                selectedUserPermissionsIds.indexOf(
                                  permission.id
                                ) !== -1
                              }
                              onChange={(event) => {
                                handleSelectOnePermission(event, permission.id);
                              }}
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
        </Grid>
      )}
    </Grid>
  );
};

export default ProfileTypes;
