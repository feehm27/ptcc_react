import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Box, Divider, Drawer, Hidden, List } from '@material-ui/core';
import {
  AlertCircle as AlertCircleIcon,
  Calendar as CalendarIcon,
  MessageSquare as MessageIcon,
  FileText as FileIcon,
  Book as BookIcon
} from 'react-feather';
import NavItem from './NavItem';

const items = [
  {
    id: 12,
    href: '/dashboard-client',
    icon: AlertCircleIcon,
    title: 'Página Inicial',
    disabled: false
  },
  {
    href: '/construction',
    icon: FileIcon,
    title: 'Contrato',
    disabled: true
  },
  {
    href: '/construction',
    icon: BookIcon,
    title: 'Acompanhar Processo',
    disabled: true
  },
  {
    id: 13,
    href: '/construction',
    icon: CalendarIcon,
    title: 'Agendar Reunião',
    disabled: true
  },
  {
    id: 14,
    href: '/construction',
    icon: MessageIcon,
    title: 'Contato',
    disabled: true
  }
];

const MenuClient = ({ onMobileClose, openMobile }) => {
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
            sx: {
              width: 256
            }
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
              top: 64
            }
          }}
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

MenuClient.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

MenuClient.defaultProps = {
  onMobileClose: () => {},
  openMobile: false
};

export default MenuClient;
