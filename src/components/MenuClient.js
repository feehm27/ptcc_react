import { Box, Divider, Drawer, Hidden, List } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useContext, useEffect } from 'react';
import {
  Activity as ActivityIcon,
  Book as BookIcon,
  Calendar as CalendarIcon,
  FileText as FileIcon,
  MessageSquare as MessageIcon
} from 'react-feather';
import { useLocation } from 'react-router-dom';
import { UserContext } from 'src/contexts/UserContext';
import NavItem from './NavItem';

const MenuClient = ({ onMobileClose, openMobile }) => {
  const location = useLocation();
  const { data } = useContext(UserContext);

  const items = [
    {
      id: 10,
      href: '/dashboard/client',
      icon: ActivityIcon,
      title: 'Página Inicial',
      disabled: false,
      allowed: data && data.checkeds.menus_checked[11].checked === 1
    },
    {
      href: '/contracts/client',
      icon: FileIcon,
      title: 'Contrato',
      disabled: false,
      allowed: true
    },
    {
      href: '/processes/client',
      icon: BookIcon,
      title: 'Acompanhar Processo',
      disabled: false,
      allowed: true
    },
    {
      id: 13,
      href: '/construction',
      icon: CalendarIcon,
      title: 'Agendar Reunião',
      disabled: true,
      allowed: data && data.checkeds.menus_checked[12].checked === 1
    },
    {
      id: 14,
      href: '/contacts',
      icon: MessageIcon,
      title: 'Contato',
      disabled: false,
      allowed: data && data.checkeds.menus_checked[13].checked === 1
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
