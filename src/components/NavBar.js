import {
  AppBar,
  Box,
  Hidden,
  IconButton,
  Toolbar,
  Tooltip
} from '@material-ui/core';
import InputIcon from '@material-ui/icons/Input';
import MenuIcon from '@material-ui/icons/Menu';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { UserContext } from 'src/contexts/UserContext';
import Logo from './Logo';

const NavBar = ({ onMobileNavOpen, ...rest }) => {
  const { userLogout } = useContext(UserContext);

  return (
    <AppBar elevation={0} {...rest} sx={{ height: '64px' }}>
      <Toolbar>
        <RouterLink to="/">
          <Logo />
        </RouterLink>
        <Box sx={{ flexGrow: 1 }} />
        <Hidden lgDown>
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
