import { useContext, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  AppBar,
  Badge,
  Box,
  Hidden,
  IconButton,
  Toolbar,
  Tooltip
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import InputIcon from '@material-ui/icons/Input';
import { UserContext } from 'src/contexts/UserContext';
import Logo from './Logo';

const NavBar = ({ onMobileNavOpen, ...rest }) => {
  const [notifications] = useState([]);
  const { userLogout } = useContext(UserContext);

  return (
    <AppBar elevation={0} {...rest} sx={{ height: '64px' }}>
      <Toolbar>
        <RouterLink to="/">
          <Logo />
        </RouterLink>
        <Box sx={{ flexGrow: 1 }} />
        <Hidden lgDown>
          <Tooltip title="Notificações">
            <IconButton color="inherit">
              <Badge
                badgeContent={notifications.length}
                color="primary"
                variant="dot"
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title="Sair">
            <IconButton color="inherit">
              <InputIcon tooltip="teste" onClick={() => userLogout()} />
            </IconButton>
          </Tooltip>
        </Hidden>
        <Hidden lgUp>
          <IconButton color="inherit" onClick={onMobileNavOpen}>
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

NavBar.propTypes = {
  onMobileNavOpen: PropTypes.func
};

export default NavBar;
