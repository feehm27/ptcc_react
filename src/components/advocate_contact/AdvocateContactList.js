import { Card, CardHeader, Divider } from '@material-ui/core';

const AdvocateContactList = (clients) => {
  return (
    clients.clients && (
      <Card>
        <CardHeader title="Lista de mensagens por cliente" />
        <Divider />
      </Card>
    )
  );
};

export default AdvocateContactList;
