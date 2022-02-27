import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography
} from '@material-ui/core';
import { TimelineOppositeContent } from '@mui/lab';
import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import moment from 'moment';
import { maskProcessNumber } from 'src/helpers/Helpers';

const ProcessClientView = (props) => {
  const getHistorics = () => {
    return props.process.historics.map((historic, index) => {
      return (
        <Timeline
          position="alternate"
          sx={{
            '& .MuiTimelineContent-root': {
              flex: 100
            }
          }}
        >
          <TimelineItem>
            <TimelineOppositeContent color="text.secondary">
              <Typography gutterBottom variant="h6">
                {moment(historic.modification_date).format('DD/MM/YYYY')}
              </Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              {index % 2 === 0 ? (
                <TimelineDot color="primary" />
              ) : (
                <TimelineDot />
              )}
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <span
                style={{
                  display: 'flex'
                }}
              >
                <Typography color="black" gutterBottom variant="h6">
                  Status: &nbsp;
                </Typography>
                <Typography color="textSecondary" gutterBottom variant="h6">
                  {historic.status_process}
                </Typography>
              </span>
              <span
                style={{
                  display: 'flex'
                }}
              >
                <Typography color="black" gutterBottom variant="h6">
                  Descrição:&nbsp;
                </Typography>
                <Typography color="textSecondary" gutterBottom variant="h6">
                  {historic.modification_description}
                </Typography>
              </span>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      );
    });
  };

  return props.process.length === 0 ? (
    <Card>
      <CardHeader title="Visualização do Contrato" />
      <Divider />
      <CardContent>
        <Typography color="primary" variant="body1">
          Não existem processos vinculados ao seu usuário para visualização.
        </Typography>
      </CardContent>
    </Card>
  ) : (
    <Card>
      <CardHeader title="Dados do processo" />
      <Divider />
      <CardContent>
        <span
          style={{
            display: 'flex',
            fontSize: '14px'
          }}
        >
          <Typography gutterBottom variant="h6">
            Status atual :&nbsp;
          </Typography>
          <Typography gutterBottom color="textSecondary" variant="h6">
            {props.process.status}
          </Typography>
        </span>
        <span
          style={{
            display: 'flex',
            fontSize: '14px'
          }}
        >
          <Typography gutterBottom variant="h6">
            Data da última atualização :&nbsp;
          </Typography>
          <Typography gutterBottom color="textSecondary" variant="h6">
            {moment(props.process.last_modification).format('DD/MM/YYYY')}
          </Typography>
        </span>
        <span
          style={{
            display: 'flex',
            fontSize: '14px'
          }}
        >
          <Typography gutterBottom variant="h6">
            Número do processo :&nbsp;
          </Typography>
          <Typography gutterBottom color="textSecondary" variant="h6">
            {maskProcessNumber(props.process.number_process)}
          </Typography>
        </span>
        <span
          style={{
            display: 'flex',
            fontSize: '14px'
          }}
        >
          <Typography gutterBottom variant="h6">
            Observações :&nbsp;
          </Typography>
          <Typography gutterBottom color="textSecondary" variant="h6">
            {props.process.observation}
          </Typography>
        </span>
      </CardContent>
      <>
        <Divider />
        <CardHeader title="Histórico de alterações" />
        <Divider />
        <CardContent>{getHistorics()}</CardContent>
      </>
    </Card>
  );
};

export default ProcessClientView;
