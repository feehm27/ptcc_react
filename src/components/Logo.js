import { useContext } from 'react';
import { UserContext } from 'src/contexts/UserContext';
import { Skeleton } from '@material-ui/core';

const Logo = (props) => {
  const { data, loading } = useContext(UserContext);

  return loading && data ? (
    <Skeleton />
  ) : (
    <img
      alt="Logo"
      src={data && data.logo !== null ? data.logo : '/static/logo.png'}
      {...props}
      style={{
        display: 'block',
        height: '200px',
        width: '200px'
      }}
    />
  );
};

export default Logo;
