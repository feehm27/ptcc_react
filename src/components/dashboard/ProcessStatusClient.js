import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Typography
} from '@material-ui/core';
import { Gavel } from '@material-ui/icons';
import moment from 'moment';

const ProcessStatusClient = (props) => (
  <Card {...props}>
    <CardHeader title="Dados do Processo" />
    <Divider />
    <CardContent>
      <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
        {props.process.status === null ? (
          <Grid item>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="h4"
              textAlign="center"
              style={{ marginTop: '20px' }}
            >
              Você não possui processos em andamento.
            </Typography>
          </Grid>
        ) : (
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="h6">
              Status do processo
            </Typography>
            <Typography color="green" variant="h3">
              {props.process.status}
            </Typography>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="h6"
              style={{ marginTop: '4px' }}
            >
              Data da última modificação
            </Typography>
            <Typography color="green" variant="h3">
              {moment(props.process.date).format('DD/MM/YYYY')}
            </Typography>
          </Grid>
        )}
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: 'orange',
              height: 56,
              width: 56
            }}
          >
            <Gavel />
          </Avatar>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

export default ProcessStatusClient;
