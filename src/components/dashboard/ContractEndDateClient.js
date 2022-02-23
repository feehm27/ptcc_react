import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Typography
} from '@material-ui/core';
import { Money } from '@material-ui/icons';
import moment from 'moment';

const ContractEndDateClient = (props) => (
  <Card sx={{ height: '100%' }} {...props}>
    <CardHeader title="Dados do contrato" />
    <Divider />
    <CardContent>
      <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
        {props.contract.start_date === null ? (
          <Grid item>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="h4"
              textAlign="center"
              style={{ marginTop: '20px' }}
            >
              Você não possui contrato vinculado para exibição.
            </Typography>
          </Grid>
        ) : (
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="h6">
              Date de início do contrato
            </Typography>
            <Typography color="textPrimary" variant="h3">
              {moment(props.contract.start_date).format('DD/MM/YYYY')}
            </Typography>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="h6"
              style={{ marginTop: '4px' }}
            >
              Date de término do contrato
            </Typography>
            <Typography color="textPrimary" variant="h3">
              {moment(props.contract.end_date).format('DD/MM/YYYY')}
            </Typography>
          </Grid>
        )}
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: 'green',
              height: 56,
              width: 56
            }}
          >
            <Money />
          </Avatar>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

export default ContractEndDateClient;
