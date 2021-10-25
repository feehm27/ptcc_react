import { Box, Container, Skeleton } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import UserListToolbar from 'src/components/users/UserListToolbar';
import UserManagement from 'src/components/users/UserManagement';
import { API } from 'src/services/api';

const User = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Obtém os usuários
   */
  async function getUsers() {
    setIsLoading(true);
    const tokenUser = window.localStorage.getItem('token');
    const config = {
      headers: { Authorization: `Bearer ${tokenUser}` }
    };
    await API.get('advocates/users', config)
      .then((response) => {
        setUsers(response.data.data);
      })
      .catch((err) => console.error(err));
    setIsLoading(false);
  }

  /**
   * Use Effect
   */
  useEffect(() => {
    getUsers();
  }, []);

  return isLoading ? (
    <>
      <Helmet>
        <title>Advoguez</title>
      </Helmet>
      <Skeleton />
    </>
  ) : (
    <>
      <Helmet>
        <title>Advoguez</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth="lg">
          <UserListToolbar users={users} />
          <UserManagement users={users} />
        </Container>
      </Box>
    </>
  );
};

export default User;
