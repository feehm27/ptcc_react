import { Helmet } from 'react-helmet';
import { Box, Container, Typography } from '@material-ui/core';
import UserProfileList from 'src/components/users/UserProfileList';
import ProfileTypeConstants from 'src/constants/ProfileTypeConstants';

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
          <UserProfileList profiles={ProfileTypeConstants} />
        </Box>
      </Container>
    </Box>
  </>
);

export default UserProfile;
