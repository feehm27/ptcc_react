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
import { filter, find, findIndex } from 'lodash';
import { useContext, useEffect, useRef, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useLocation, useNavigate } from 'react-router';
import { UserContext } from 'src/contexts/UserContext';
import { API } from 'src/services/api';
import ToastAnimated, { showToast } from './Toast';

const ProfileTypes = () => {
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
  const [checkedPermissionSelected, setCheckedPermissionSelected] = useState(
    []
  );

  const [submitting, setSubmitting] = useState(false);
  const showSuccess = useRef(false);
  const showError = useRef(false);

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

      const newMenusChecked = data.checkeds.menus_checked.filter((checkeds) => {
        return menusAndPermissions.find(
          (allMenus) => checkeds.menu_id === allMenus.id
        );
      });

      setMenusChecked(newMenusChecked);
    });

    setPermissionsChecked(data.checkeds.permissions_checked);
    setIsLoading(false);
  }

  /**
   * Verifica se todas as permissões do usuário estão habilitadas
   * @returns
   */
  const checkedAllPermissions = () => {
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
    const menusCheckedArray = Object.values(menusChecked);
    const index = findIndex(menusCheckedArray, { menu_id: menuId });
    return menusCheckedArray[index].checked;
  };

  /**
   * Muda o estado do menu
   * @param {*} checked
   * @param {*} menuId
   */
  const changeMenu = (e, menuId) => {
    const index = findIndex(Object.values(menusChecked), { menu_id: menuId });

    Object.values(menusChecked)[index].checked = e.target.checked;

    setMenusChecked(Object.values(menusChecked));

    const allMenusCheckeds = Object.values(menusChecked).every((menu) => {
      return menu.checked === true || menu.checked === 1;
    });

    setCheckedMenu(allMenusCheckeds);

    const menuSelected = {
      id: menuId,
      checked: e.target.checked
    };

    permissionsChecked[menuId - 1].map((permission) => {
      permission.checked = e.target.checked;
    });

    const allPermissionsCheckeds = permissionsChecked[menuId - 1].every(
      (permission) => {
        return permission.checked === true || permission.checked === 1;
      }
    );
    setCheckedPermission(allPermissionsCheckeds);

    setCheckedMenuSelected(menuSelected);
    return Object.values(menusChecked)[index].checked;
  };

  /**
   * Muda o estado do menu
   * @param {*} checked
   * @param {*} permissionId
   */
  const changePermission = (e, permissionId) => {
    permissionsChecked[selectedMenu.id - 1].map((permission) => {
      if (permission.permission_id === permissionId) {
        permission.checked = e.target.checked;
      }
    });

    const allPermissionsCheckeds = permissionsChecked[
      selectedMenu.id - 1
    ].every((permission) => {
      return permission.checked === true || permission.checked === 1;
    });

    setCheckedPermission(allPermissionsCheckeds);

    const permissionSelected = {
      menuId: selectedMenu.id,
      id: permissionId,
      checked: e.target.checked
    };

    setPermissionsChecked(permissionsChecked);
    setCheckedPermissionSelected(permissionSelected);
  };

  const checkedSelectedAllMenus = (menuId) => {
    if (checkedMenuSelected.id === menuId) {
      return checkedMenuSelected.checked;
    }

    const menusCheckedArray = Object.values(menusChecked);
    const index = findIndex(menusCheckedArray, { menu_id: menuId });

    return menusCheckedArray[index].checked;
  };

  const checkedSelectedAllPermissions = (permissionId) => {
    if (
      checkedPermissionSelected.menuId === selectedMenu.id &&
      checkedPermissionSelected.id === permissionId
    ) {
      return checkedPermissionSelected.checked;
    }

    const findPermission = find(
      permissionsChecked[selectedMenu.id - 1],
      function findPermission(permission) {
        return permission.permission_id === permissionId;
      }
    );

    return findPermission.checked;
  };

  /**
   * Verifica se a permissão do usuário está habilitada
   * @param {*} permissionId
   * @returns
   */
  const checkedOnePermission = (permissionId) => {
    const permissionFromMenu = filter(
      permissionsChecked[selectedMenu.id - 1],
      function filterOnePermission(permissionUser) {
        return permissionUser.permission_id === permissionId;
      }
    );
    return permissionFromMenu[0].checked;
  };

  const handleChangeAllMenus = (e) => {
    const newMenusChecked = Object.values(menusChecked).forEach(
      (menuChecked) => {
        menuChecked.checked = e.target.checked;
      }
    );
    setMenusChecked({ ...menusChecked, ...newMenusChecked });
    setCheckedMenu(e.target.checked);
  };

  const handleChangeAllPermissions = (e) => {
    let newPermissionChecked = [];

    newPermissionChecked = permissionsChecked[selectedMenu.id - 1].forEach(
      (permissionChecked) => {
        permissionChecked.checked = e.target.checked;
      }
    );

    setPermissionsChecked({ ...permissionsChecked, ...newPermissionChecked });
    setCheckedPermission(e.target.checked);
  };

  /**
   * Envia os dados do advogado
   * @param {*} values
   */
  async function savePermissions() {
    setSubmitting(true);
    showSuccess.current = false;
    showError.current = false;

    const menusAndPermissions = JSON.stringify({
      menus: menusChecked,
      permissions: permissionsChecked
    });

    const token = window.localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    await API.post(
      'menu/permissions',
      { menus_permissions: menusAndPermissions },
      config
    )
      .then(() => {
        showSuccess.current = true;
      })
      .catch(() => {
        showSuccess.current = false;
        showError.current = true;
        setSubmitting(false);
      });
    setSubmitting(false);
  }

  /**
   * Use Effect
   */
  useEffect(() => {
    const token = window.localStorage.getItem('token');
    getMenusAndPermissions(token);
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
                              checked={checkedAllMenus() || checkedMenu}
                              color="primary"
                              onChange={(e) => {
                                showSuccess.current = false;
                                showError.current = false;
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
                                  checkedSelectedAllMenus(menu.id)
                                }
                                onChange={(e) => {
                                  showSuccess.current = false;
                                  showError.current = false;
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
                                    showSuccess.current = false;
                                    showError.current = false;
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
                                showSuccess.current = false;
                                showError.current = false;
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
                                checked={
                                  checkedOnePermission(permission.id) ||
                                  checkedSelectedAllPermissions(permission.id)
                                }
                                onChange={(e) => {
                                  showSuccess.current = false;
                                  showError.current = false;
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
          {submitting ? (
            <Button color="primary" variant="contained" disabled>
              Carregando..
            </Button>
          ) : (
            <Button
              color="primary"
              variant="contained"
              onClick={(e) => {
                savePermissions();
                e.preventDefault();
                showSuccess.current = false;
                showError.current = false;
              }}
            >
              Salvar
            </Button>
          )}
        </Stack>
      </Box>
      {showSuccess.current && (
        <>
          <ToastAnimated />
          {showToast({
            type: 'success',
            message: 'Permissões atualizadas com sucesso!'
          })}
        </>
      )}
      {showError.current && (
        <>
          <ToastAnimated />
          {showToast({
            type: 'error',
            message: 'Ocorreu um erro ao atualizar as permissões!'
          })}
        </>
      )}
    </Grid>
  );
};

export default ProfileTypes;
