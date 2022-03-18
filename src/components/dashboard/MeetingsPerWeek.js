import {
  Box,
  Card,
  CardContent,
  CardHeader,
  colors,
  Divider,
  Typography,
  useTheme
} from '@material-ui/core';
import { Pie } from 'react-chartjs-2';

const MeetingsPerWeek = (props) => {
  const theme = useTheme();

  const data = {
    datasets: [
      {
        data: props.meetings.data,
        backgroundColor: [
          colors.indigo[500],
          colors.red[600],
          colors.orange[600],
          colors.yellow[500],
          colors.green[500],
          colors.red[200]
        ],
        borderWidth: 8,
        borderColor: colors.common.white,
        hoverBorderColor: colors.common.white
      }
    ],
    labels: props.meetings.labels
  };

  const options = {
    animation: false,
    cornerRadius: 20,
    layout: { padding: 0 },
    legend: { display: true },
    maintainAspectRatio: false,
    responsive: true,
    tooltips: {
      backgroundColor: theme.palette.background.paper,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: 'index',
      titleFontColor: theme.palette.text.primary
    }
  };

  return (
    <Card {...props}>
      <CardHeader title="Reuniões agendadas na semana" />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 400,
            position: 'relative'
          }}
        >
          <Pie data={data} options={options} />
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pt: 2
          }}
        >
          {props.meetings.labels.map((label, index) => (
            <Box
              sx={{
                p: 1,
                textAlign: 'center'
              }}
            >
              <Typography
                color="textPrimary"
                variant="body1"
                style={{ fontSize: '11px' }}
              >
                {label}
              </Typography>
              <Typography variant="body1">
                {props.meetings.data[index]}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default MeetingsPerWeek;
