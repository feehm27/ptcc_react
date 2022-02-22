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
import { Brightness1 } from '@material-ui/icons';
import { Doughnut } from 'react-chartjs-2';

const ProcessesByStatus = (props) => {
  const theme = useTheme();

  const data = {
    datasets: [
      {
        data: props.processes.length === 0 ? [0] : props.processes.data,
        backgroundColor:
          props.processes.length === 0
            ? ['white']
            : props.processes.backgrounds,
        borderWidth: 8,
        borderColor: colors.common.white,
        hoverBorderColor: colors.common.white
      }
    ],
    labels:
      props.processes.length === 0 ? ['Sem processos'] : props.processes.labels
  };

  const options = {
    animation: false,
    cutoutPercentage: 80,
    layout: { padding: 0 },
    legend: {
      display: false
    },
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
      <CardHeader title="Processos por status" />
      <Divider />
      <CardContent>
        {props.processes.length === 0 || props.processes.data.length === 0 ? (
          <Box>
            <Typography color="textSecondary" gutterBottom variant="h6">
              Nenhum processo encontrado.
            </Typography>
          </Box>
        ) : (
          <>
            <Box
              sx={{
                height: 300,
                position: 'relative'
              }}
            >
              <Doughnut data={data} options={options} />
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                pt: 2
              }}
            >
              {props.processes.devices.map((process) => (
                <Box
                  key={process.title}
                  sx={{
                    p: 1,
                    textAlign: 'center'
                  }}
                >
                  <Brightness1 style={{ color: `${process.color}` }} />
                  <Typography color="textPrimary" variant="body1">
                    {process.title}
                  </Typography>

                  <Typography
                    style={{ color: `${process.color}` }}
                    variant="h2"
                  >
                    {process.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProcessesByStatus;
