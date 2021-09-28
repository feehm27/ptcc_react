import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Box, Divider, Drawer, Hidden, List } from '@material-ui/core';
import {
  BarChart as BarChartIcon,
  Users as UsersIcon,
  Camera as CameraIcon,
  ArrowRightCircle as ArrowRightIcon,
  Calendar as CalendarIcon,
  MessageSquare as MessageIcon,
  Bell as BellIcon,
  FileText as FileIcon,
  User as UserIcon,
  Info as InfoIcon
} from 'react-feather';
import NavItem from './NavItem';

const items = [
  {
    id: 1,
    href: '/dashboard',
    icon: BarChartIcon,
    title: 'Dashboard'
  },
  {
    id: 2,
    href: '/informations',
    icon: InfoIcon,
    title: 'Meus Dados'
  },
  {
    id: 3,
    href: '/products',
    icon: CameraIcon,
    title: 'Identidade Visual'
  },
  {
    id: 4,
    href: '/account',
    icon: ArrowRightIcon,
    title: 'Gestão de Clientes'
  },
  {
    id: 5,
    href: '/settings',
    icon: ArrowRightIcon,
    title: 'Gestão de Contratos'
  },
  {
    id: 6,
    href: '/404',
    icon: ArrowRightIcon,
    title: 'Gestão de Processos'
  },
  {
    id: 7,
    href: '/404',
    icon: CalendarIcon,
    title: 'Agenda de Reuniões'
  },
  {
    id: 8,
    href: '/404',
    icon: MessageIcon,
    title: 'Mensagens'
  },
  {
    id: 9,
    href: '/404',
    icon: BellIcon,
    title: 'Lembretes'
  },
  {
    id: 10,
    href: '/404',
    icon: FileIcon,
    title: 'Relatórios'
  },
  {
    id: 11,
    href: '/404',
    icon: UsersIcon,
    title: 'Usuários'
  },
  {
    href: '/users/profile',
    icon: UserIcon,
    title: 'Perfil de Usuários'
  }
];

const MenuAttorney = ({ onMobileClose, openMobile }) => {
  const location = useLocation();

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
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
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
