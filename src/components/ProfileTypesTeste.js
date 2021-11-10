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
import { filter } from 'lodash';
import { useContext, useEffect, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useLocation, useNavigate } from 'react-router';
import { UserContext } from 'src/contexts/UserContext';
import { API } from 'src/services/api';

const ProfileTypesTeste = () => {
  const navigate = useNavigate();

  const { profile } = useLocation().state;
  const { data } = useContext(UserContext);

  const [showPermissions, setShowPermissions] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const [allMenusPermissions, setAllMenusPermissions] = useState([]);
  const [menusChecked, setMenusChecked] = useState([]);
  const [permissionsChecked, setPermissionsChecked] = useState([]);

  const [checkedMenu, setCheckedMenu] = useState(false);
  const [checkedPermission, setCheckedPermission] = useState(false);
  const [checkedMenuSelected, setCheckedMenuSelected] = useState([]);

  /**
   * Obtém os menus e as permissões do usuário
   * * @param {*} token
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
      setAllMenusPermissions(menusAndPermissions);
    });

    setMenusChecked(data.checkeds.menus_checked);
    setPermissionsChecked(data.checkeds.permissions_checked);
    setIsLoading(false);
  }

  /**
   * Verifica se todas as permissões do usuário estão habilitadas
   * @returns
   */
  const checkedAllPermissions = () => {
    console.log('permissionsChecked', permissionsChecked);
    const permissions = filter(
      permissionsChecked[selectedMenu.id - 1],
      function filterPermissions(permissionUser) {
        return permissionUser.checked === 1;
      }
    );
    return permissions.length === selectedMenu.permissions.length;
  };

  /**
   * Verifica se todos os menus do usuário estão habilitados
   * @returns
   */
  const checkedAllMenus = () => {
    const menus = filter(menusChecked, function filterMenus(menuChecked) {
      return menuChecked.checked === 1;
    });
    return menus.length === allMenusPermissions.length;
  };

  /**
   * Verifica se o menu do usuário está habilitado
   * @param {*} menuId
   * @returns
   */
  const checkedOneMenu = (menuId) => {
    if (menusChecked.menusChecked !== undefined) {
      return menusChecked.menusChecked[menuId - 1].checked;
    }
    return menusChecked[menuId - 1].checked;
  };

  /**
   * Muda o estado do menu
   * @param {*} checked
   * @param {*} menuId
   */
  const changeMenu = (e, menuId) => {
    menusChecked[menuId - 1].checked = e.target.checked;
    setMenusChecked(menusChecked);

    const menuSelected = {
      id: menuId,
      checked: e.target.checked
    };

    setCheckedMenuSelected(menuSelected);
    return menusChecked[menuId - 1].checked;
  };

  /**
   * Muda o estado do menu
   * @param {*} checked
   * @param {*} permissionId
   */
  const changePermission = (e, permissionId) => {
    setPermissionsChecked(
      permissionsChecked[selectedMenu.id - 1].forEach((permission) => {
        console.log('permissionId', permissionId);
        if (permission.id === permissionId) {
          console.log('aqui');
          permission.checked = e.target.checked;
        }
      })
    );
  };

  /**
   * Verifica se a permissão do usuário está habilitada
   * @param {*} permissionId
   * @returns
   */
  const checkedOnePermission = (permissionId) => {
    console.log('permissionsChecked', permissionsChecked);
    const permissionFromMenu = filter(
      permissionsChecked[selectedMenu.id - 1],
      function filterOnePermission(permissionUser) {
        return permissionUser.permission_id === permissionId;
      }
    );

    console.log('permissionsFromMenu', permissionFromMenu);
    return permissionFromMenu[0].checked;
  };

  const handleChangeAllMenus = (e) => {
    const newMenusChecked = menusChecked.forEach((menuChecked) => {
      menuChecked.checked = e.target.checked;
    });

    setMenusChecked({ menusChecked }, () => {
      newMenusChecked;
      console.log(menusChecked);
    });

    setCheckedMenu(e.target.checked);
  };

  const handleChangeAllPermissions = (e) => {
    const newPermissionChecked = permissionsChecked[
      selectedMenu.id - 1
    ].forEach((permissionChecked) => {
      permissionChecked.checked = e.target.checked;
    });

    setPermissionsChecked({ permissionsChecked }, () => {
      newPermissionChecked;
      console.log(permissionsChecked);
    });

    setCheckedPermission(e.target.checked);
  };

  /**
   * Use Effect
   */
  useEffect(() => {
    const token = window.localStorage.getItem('token');
    getMenusAndPermissions(token);
  }, [menusChecked]);

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
                              checked={checkedAllMenus() || checkedMenu}
                              color="primary"
                              onChange={(e) => {
                                handleChangeAllMenus(e);
                              }}
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
                                checked={
                                  checkedOneMenu(menu.id) ||
                                  checkedMenuSelected[menu.id]
                                }
                                onChange={(e) => {
                                  setShowPermissions(true);
                                  setSelectedMenu(menu);
                                  changeMenu(e, menu.id);
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
                                checkedAllPermissions() || checkedPermission
                              }
                              color="primary"
                              onChange={(e) => {
                                handleChangeAllPermissions(e);
                              }}
                            />
                          </TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedMenu.permissions.map((permission) => (
                          <TableRow hover key={permission.id}>
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={checkedOnePermission(permission.id)}
                                onChange={(e) => {
                                  changePermission(e, permission.id);
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
            onClick={() => console.log('aqui')}
          >
            Salvar
          </Button>
        </Stack>
      </Box>
    </Grid>
  );
};

export default ProfileTypesTeste;
