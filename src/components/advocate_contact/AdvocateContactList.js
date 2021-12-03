import { Card, CardHeader, Divider } from '@material-ui/core';

const AdvocateContactList = (messages) => {
  return (
    messages.messages && (
      <Card>
        <CardHeader title="Lista de mensagens" />
        <Divider />
      </Card>
    )
  );
};

export default AdvocateContactList;
