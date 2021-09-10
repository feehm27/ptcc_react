import { Helmet } from 'react-helmet';
import { Box, Container, Typography } from '@material-ui/core';
import profiles from 'src/__mocks__/profiles';
import UserProfileList from 'src/components/users/UserProfileList';

const UserProfile = () => (
  <>
    <Helmet>
      <title>Advoguez - Perfil de Usuários</title>
    </Helmet>
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
        py: 3
      }}
    >
      <Container maxWidth={false}>
        <Typography color="primary" variant="h3">
          Perfil de Usuários
        </Typography>
        <Box sx={{ pt: 3 }}>
          <UserProfileList profiles={profiles} />
        </Box>
      </Container>
    </Box>
  </>
);

export default UserProfile;
