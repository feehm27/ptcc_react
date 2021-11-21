import { Box, Divider, Drawer, Hidden, List } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useContext, useEffect } from 'react';
import {
  ArrowRightCircle as ArrowRightIcon,
  BarChart as BarChartIcon,
  Bell as BellIcon,
  Calendar as CalendarIcon,
  Camera as CameraIcon,
  FileText as FileIcon,
  Info as InfoIcon,
  MessageSquare as MessageIcon,
  User as UserIcon,
  Users as UsersIcon
} from 'react-feather';
import { useLocation } from 'react-router-dom';
import { UserContext } from 'src/contexts/UserContext';
import NavItem from './NavItem';

const MenuAttorney = ({ onMobileClose, openMobile }) => {
  const { data } = useContext(UserContext);
  const menusPermissions = data.checkeds.menus_checked;
  const location = useLocation();

  const items = [
    {
      id: 1,
      href: '/dashboard',
      icon: BarChartIcon,
      title: 'Dashboard',
      disabled: false,
      allowed: menusPermissions[0].checked === 1
    },
    {
      id: 2,
      href: '/informations',
      icon: InfoIcon,
      title: 'Meus Dados',
      disabled: false,
      allowed: menusPermissions[1].checked === 1
    },
    {
      id: 3,
      href: '/identity',
      icon: CameraIcon,
      title: 'Identidade Visual',
      disabled: false,
      allowed: menusPermissions[2].checked === 1
    },
    {
      id: 4,
      href: '/clients',
      icon: ArrowRightIcon,
      title: 'Gestão de Clientes',
      disabled: false,
      allowed: menusPermissions[3].checked === 1
    },
    {
      id: 5,
      href: '/construction',
      icon: ArrowRightIcon,
      title: 'Gestão de Contratos',
      disabled: true,
      allowed: menusPermissions[4].checked === 1
    },
    {
      id: 6,
      href: '/construction',
      icon: ArrowRightIcon,
      title: 'Gestão de Processos',
      disabled: true,
      allowed: menusPermissions[5].checked === 1
    },
    {
      id: 7,
      href: '/construction',
      icon: CalendarIcon,
      title: 'Agenda de Reuniões',
      disabled: true,
      allowed: menusPermissions[6].checked === 1
    },
    {
      id: 8,
      href: '/construction',
      icon: MessageIcon,
      title: 'Mensagens',
      disabled: true,
      allowed: menusPermissions[7].checked === 1
    },
    {
      id: 9,
      href: '/construction',
      icon: BellIcon,
      title: 'Lembretes',
      disabled: true,
      allowed: menusPermissions[8].checked === 1
    },
    {
      id: 10,
      href: '/construction',
      icon: FileIcon,
      title: 'Relatórios',
      disabled: true,
      allowed: menusPermissions[9].checked === 1
    },
    {
      id: 11,
      href: '/users',
      icon: UsersIcon,
      title: 'Usuários',
      disabled: false,
      allowed: menusPermissions[10].checked === 1
    },
    {
      id: 12,
      href: '/users/profile',
      icon: UserIcon,
      title: 'Perfil de Usuários',
      disabled: false,
      allowed: menusPermissions[11].checked === 1
    }
  ];

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <Divider />
      <Box sx={{ p: 2 }}>
        <List>
          {items.map((item) => (
            <NavItem
              href={item.allowed ? item.href : '/not-allowed'}
              key={item.title}
              title={item.title}
              icon={item.icon}
              disabled={item.disabled}
              onClick={(e) => {
                if (item.disabled) {
                  e.preventDefault();
                }
              }}
            />
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
          PaperProps={{
            sx: {}
          }}
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden lgDown>
        <Drawer
          anchor="left"
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: 256,
              top: 64,
              height: 'calc(100% - 64px)'
            }
          }}
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

MenuAttorney.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

MenuAttorney.defaultProps = {
  onMobileClose: () => {},
  openMobile: false
};

export default MenuAttorney;
