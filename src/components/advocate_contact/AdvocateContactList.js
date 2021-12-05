import { Card, CardHeader, Divider } from '@material-ui/core';

const AdvocateContactList = (clients) => {
  console.log(clients);
  return (
    clients.clients && (
      <Card>
        <CardHeader title="Lista de mensagens" />
        <Divider />
      </Card>
    )
  );
};

export default AdvocateContactList;
