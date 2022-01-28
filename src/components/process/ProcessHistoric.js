import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
  Typography
} from '@material-ui/core';
import moment from 'moment';
import { useLocation } from 'react-router';
import { maskProcessNumber } from 'src/helpers/Helpers';
import { Delete } from '@material-ui/icons';

const ProcessHistoric = () => {
  const { process, historics } = useLocation().state;

  return historics.length > 0 ? (
    <Card>
      <CardHeader
        title={`Histórico do Processo - ${maskProcessNumber(process.number)}`}
      />
      <Divider />
      <CardContent>
        {historics.map((historic) => (
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            <ListItem>
              <ListItemAvatar
                sx={{
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <Tooltip title="Excluir histórico">
                  <Delete
                    style={{
                      color: '#FF0000'
                    }}
                    cursor="pointer"
                    onClick={() => {}}
                  ></Delete>
                </Tooltip>
                <Typography
                  style={{
                    ml: '10px'
                  }}
                >
                  {' '}
                  {moment(historic.modification_date).format('DD/MM/YYYY')}
                </Typography>
              </ListItemAvatar>
              <ListItemText
                sx={{ ml: 5 }}
                primary={`Status alterado para "${historic.status_process}"`}
                secondary={
                  <div>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    ></Typography>
                    {`Descrição da modificação: ${historic.modification_description}`}
                  </div>
                }
              />
            </ListItem>
            <Divider />
          </List>
        ))}
      </CardContent>
    </Card>
  ) : (
    <Card sx={{ mt: 3, mb: 4, ml: 2, mr: 2 }}>
      <Divider />
      <CardContent>
        <Typography color="textSecondary" variant="body1">
          Não existe histórico para o processo selecionado.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProcessHistoric;
