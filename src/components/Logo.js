const Logo = (props) => (
  <img
    alt="Logo"
    src="/static/logo.png"
    {...props}
    style={{
      display: 'block',
      width: '100%'
    }}
  />
);

export default Logo;
