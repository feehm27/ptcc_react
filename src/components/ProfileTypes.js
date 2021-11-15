import {
  Box,
  Button,
  Card,
  Checkbox,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { filter, findIndex, forEach, uniqBy } from 'lodash';
import { useContext, useEffect, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useLocation, useNavigate } from 'react-router';
import { UserContext } from 'src/contexts/UserContext';
import { API } from 'src/services/api';

const ProfileTypes = () => {
  const navigate = useNavigate();
  const { profile } = useLocation().state;
  const { data } = useContext(UserContext);

  const [showPermissions, setShowPermissions] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedUserMenuIds, setSelectedUserMenuIds] = useState([]);
  const [permissionsUser, setPermissionsUser] = useState([]);

  const [allMenusPermissions, setAllMenusPermissions] = useState([]);
  const [menusPermissionsUser, setMenusPermissionsUser] = useState([]);
  const [selectedMenuIds, setSelectedMenuIds] = useState([]);
  const [selectedPermissionsIds, setSelectedPermissionsIds] = useState([]);

  const [updateMenus, setUpdateMenus] = useState([]);

  /**
   * Obtém todos os menus e permissoes
   */
  async function getMenusAndPermissions(token) {
    setIsLoading(true);
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    await API.get('/menu/permissions', config).then((response) => {
      const menusAndPermissions = filter(
        response.data.data,
        function filterMenuPermissions(menu) {
          return menu.profile_type_id === profile.id;
        }
      );

      console.log('allMenusPermissions', menusAndPermissions);
      setAllMenusPermissions(menusAndPermissions);
      setUpdateMenus(menusAndPermissions);
    });
    setIsLoading(false);
  }

  const getMenusPermissionsUser = () => {
    setMenusPermissionsUser(data.permissions);
    console.log('menusPermissionsUser', data.permissions);
    console.log(menusPermissionsUser);
  };

  const checkedAllMenusActive = () => {
    console.log('aqui', menusPermissionsUser.permissions_user);
    const menusUserActives = filter(
      menusPermissionsUser.permissions_user,
      function filterMenusActives(menu) {
        return menu.menu_is_active === 1;
      }
    );

    return menusUserActives.length === allMenusPermissions.length;
  };

  const checkedAllPermissionsActive = () => {
    const permissionsUsersActives = filter(
      permissionsUser,
      function (permission) {
        return permission.is_active === 1;
      }
    );
    return permissionsUsersActives.length === selectedMenu.permissions.length;
  };

  const checkedMenuIsActive = (menuId) => {
    const index = findIndex(menusPermissionsUser.permissions_user, [
      'menu_id',
      menuId
    ]);
    if (index !== -1) {
      return menusPermissionsUser.permissions_user[index].menu_is_active === 1;
    }
    return false;
  };

  const checkedPermissionIsActive = (permissionId) => {
    const index = findIndex(selectedMenu.permissions, ['id', permissionId]);
    if (index !== -1) {
      return selectedMenu.permissions[index].permission_is_active === 1;
    }
    return false;
  };

  /**
   * Atualiza as permissões do usuário
   */
  async function updatePermissions() {
    console.log(updateMenus);
  }

  /**
   * Obtém os ids das permissões do usuário
   * @param {*} menu
   */
  const getPermissionsUser = (menu) => {
    const menuSelected = filter(menusPermissionsUser, function (menuUser) {
      return menuUser.id === menu.id;
    });

    if (menuSelected.length > 0) {
      setPermissionsUser(menuSelected[0].permissions);
    }
  };

  /**
   * Seleciona todos os checkboxs do menu
   * @param {*} event
   */
  const handleSelectAllMenus = (event) => {
    let newSelectedMenuIds;

    forEach(updateMenus, function (menu) {
      menu.is_active = event.target.checked ? 1 : 0;
    });

    if (event.target.checked) {
      newSelectedMenuIds = allMenusPermissions.map((menu) => menu.id);
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
    forEach(updateMenus, function (menu) {
      forEach(menu.permissions, function (permission) {
        permission.is_active = event.target.checked ? 1 : 0;
      });
    });

    let newSelectedPermissionsIds;

    if (event.target.checked) {
      newSelectedPermissionsIds = selectedMenu.permissions.map(
        (permission) => permission.id
      );
    } else {
      newSelectedPermissionsIds = [];
    }
    setSelectedPermissionsIds(newSelectedPermissionsIds);
    setPermissionsUser(newSelectedPermissionsIds);
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
   * @param {*} menuId
   */
  const handleSelectOneMenu = (event, menuId) => {
    const index = findIndex(menusPermissionsUser, ['id', menuId]);
    if (index !== -1) {
      menusPermissionsUser[index].menu_is_active === event.target.checked;
      setMenusPermissionsUser(menusPermissionsUser);
    }
    console.log('nãomeserveparanada', updateSelectedMenus);
  };

  /**
   * Atualiza a lista de permissões
   * @param {*} index
   * @param {*} id
   */
  const updateSelectedPermissions = (index, id) => {
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
        permissionsUser,
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

    setPermissionsUser(newSelectedPermissionsIds);
    setSelectedPermissionsIds(newSelectedPermissionsIds);
  };

  /**
   * Seleciona um checkbox das permissões
   * @param {*} event
   * @param {*} id
   */
  const handleSelectOnePermission = (event, id) => {
    if (selectedPermissionsIds.length === 0) {
      forEach(permissionsUser, function (key, index) {
        selectedPermissionsIds[index] = key;
      });
    }

    forEach(updateMenus, function (menu) {
      forEach(menu.permissions, function (permission) {
        if (permission.id === id) {
          permission.is_active = event.target.checked ? 1 : 0;
        }
      });
    });

    if (event.target.checked) {
      const selectedIndex = selectedPermissionsIds.indexOf(id);
      updateSelectedPermissions(selectedIndex, id);
    } else {
      setPermissionsUser(
        filter(permissionsUser, function (permissionId) {
          return permissionId !== id;
        })
      );
      setSelectedPermissionsIds(
        filter(selectedPermissionsIds, function (permissionId) {
          return permissionId !== id;
        })
      );
    }
  };

  /**
   * Use Effect
   */
  useEffect(() => {
    const token = window.localStorage.getItem('token');
    getMenusAndPermissions(token);
    getMenusPermissionsUser();
  }, []);

  return (
    <Grid>
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
                              checked={checkedAllMenusActive()}
                              color="primary"
                              onChange={handleSelectAllMenus}
                            />
                          </TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {allMenusPermissions.map((menu) => (
                          <TableRow hover key={menu.id}>
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={checkedMenuIsActive(menu.id)}
                                onChange={(event) => {
                                  handleSelectOneMenu(event, menu.id);
                                }}
                                onClick={() => {
                                  setShowPermissions(true);
                                  setSelectedMenu(menu);
                                  getPermissionsUser(menu);
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
                                    getPermissionsUser(menu);
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
                              checked={checkedAllPermissionsActive()}
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
                              selectedPermissionsIds.indexOf(permission.id) !==
                              -1
                            }
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={checkedPermissionIsActive(
                                  permission.id
                                )}
                                onChange={(event) => {
                                  handleSelectOnePermission(
                                    event,
                                    permission.id
                                  );
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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          p: 2
        }}
      >
        <Stack direction="row" spacing={2}>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => navigate('/users/profile')}
          >
            Voltar
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={updatePermissions}
          >
            Salvar
          </Button>
        </Stack>
      </Box>
    </Grid>
  );
};

export default ProfileTypes;
