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
    title: 'Dashboard',
    disabled: false
  },
  {
    id: 2,
    href: '/informations',
    icon: InfoIcon,
    title: 'Meus Dados',
    disabled: false
  },
  {
    id: 3,
    href: '/identity',
    icon: CameraIcon,
    title: 'Identidade Visual',
    disabled: false
  },
  {
    id: 4,
    href: '/clients',
    icon: ArrowRightIcon,
    title: 'Gestão de Clientes',
    disabled: false
  },
  {
    id: 5,
    href: '/construction',
    icon: ArrowRightIcon,
    title: 'Gestão de Contratos',
    disabled: true
  },
  {
    id: 6,
    href: '/construction',
    icon: ArrowRightIcon,
    title: 'Gestão de Processos',
    disabled: true
  },
  {
    id: 7,
    href: '/construction',
    icon: CalendarIcon,
    title: 'Agenda de Reuniões',
    disabled: true
  },
  {
    id: 8,
    href: '/construction',
    icon: MessageIcon,
    title: 'Mensagens',
    disabled: true
  },
  {
    id: 9,
    href: '/construction',
    icon: BellIcon,
    title: 'Lembretes',
    disabled: true
  },
  {
    id: 10,
    href: '/construction',
    icon: FileIcon,
    title: 'Relatórios',
    disabled: true
  },
  {
    id: 11,
    href: '/users',
    icon: UsersIcon,
    title: 'Usuários',
    disabled: false
  },
  {
    href: '/users/profile',
    icon: UserIcon,
    title: 'Perfil de Usuários',
    disabled: false
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
