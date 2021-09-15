import { useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { experimentalStyled } from '@material-ui/core';
import { UserContext } from 'src/contexts/UserContext';
import MenuAttorney from './MenuAttorney';
import NavBar from './NavBar';

import MenuClient from './MenuClient';

const LayoutRoot = experimentalStyled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  height: '100%',
  overflow: 'hidden',
  width: '100%'
}));

const LayoutWrapper = experimentalStyled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden',
  paddingTop: 64,
  [theme.breakpoints.up('lg')]: {
    paddingLeft: 256
  }
}));

const LayoutContainer = experimentalStyled('div')({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden'
});

const LayoutContent = experimentalStyled('div')({
  flex: '1 1 auto',
  height: '100%',
  overflow: 'auto'
});

const PageLayout = () => {
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  const { data } = useContext(UserContext);

  /**
   * Verifica o tipo de perfil do usuário logado
   * @returns Boolean
   */
  const profileIsAdvocate = () => {
    if (data !== null && data.is_client === 1) return false;
    return true;
  };

  return (
    <LayoutRoot>
      <NavBar onMobileNavOpen={() => setMobileNavOpen(true)} />
      {profileIsAdvocate() ? (
        <MenuAttorney
          onMobileClose={() => setMobileNavOpen(false)}
          openMobile={isMobileNavOpen}
        />
      ) : (
        <MenuClient
          onMobileClose={() => setMobileNavOpen(false)}
          openMobile={isMobileNavOpen}
        />
      )}
      <LayoutWrapper>
        <LayoutContainer>
          <LayoutContent>
            <Outlet />
          </LayoutContent>
        </LayoutContainer>
      </LayoutWrapper>
    </LayoutRoot>
  );
};

export default PageLayout;
