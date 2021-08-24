import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { experimentalStyled } from '@material-ui/core';
import MenuAttorney from './MenuAttorney';
import NavBar from './NavBar';

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

  return (
    <LayoutRoot>
      <NavBar onMobileNavOpen={() => setMobileNavOpen(true)} />
      <MenuAttorney
        onMobileClose={() => setMobileNavOpen(false)}
        openMobile={isMobileNavOpen}
      />
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
