import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  Tooltip,
  Typography
} from '@material-ui/core';
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useNavigate } from 'react-router';
import { CloudDownload } from '@material-ui/icons';

const ContractClientView = (props) => {
  const navigate = useNavigate();
  const [pages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

  let url = '';

  if (props.contract !== null) {
    url = `https://ancient-dawn-76058.herokuapp.com/${props.contract.link_contract}`;
  }

  document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
  });

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  return props.contract === null ? (
    <Card>
      <CardHeader title="Visualização do Contrato" />
      <Divider />
      <CardContent>
        <Typography variant="body1">
          Não existe contrato vinculado ao seu usuário para visualização.
        </Typography>
      </CardContent>
    </Card>
  ) : (
    <Card
      sx={{
        m: '10px'
      }}
    >
      <span
        style={{
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <CardHeader title="Visualização do Contrato" />
        <Tooltip title="Download">
          <a
            style={{ color: 'inherit' }}
            target="webapp-tab"
            href={props.contract.link_contract}
            download={props.contract.link_contract}
          >
            <CloudDownload
              style={{ marginTop: '4px' }}
              cursor="pointer"
            ></CloudDownload>
          </a>
        </Tooltip>
      </span>
      <Divider />
      <CardContent>
        <div style={{ textAlign: 'center' }}>
          <div className="pagec">
            Página {pageNumber || (pages ? 1 : '--')} de {pages || '--'}
          </div>
        </div>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            p: 2
          }}
        >
          <Stack direction="row" spacing={2}>
            <Button
              onClick={() => previousPage()}
              disabled={pageNumber <= 1}
              autoFocuscolor="primary"
              variant="contained"
              type="button"
            >
              Página Anterior
            </Button>
            <Button
              type="button"
              disabled={pageNumber >= pages}
              onClick={() => nextPage()}
              variant="contained"
            >
              Proxima Página
            </Button>
          </Stack>
        </Box>
        <div
          style={{
            marginLeft: '22%'
          }}
        >
          <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber} />
          </Document>
        </div>
      </CardContent>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          p: 2
        }}
      >
        <Stack direction="row" spacing={2}>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => navigate('/dashboard/client')}
          >
            Voltar
          </Button>
        </Stack>
      </Box>
    </Card>
  );
};

export default ContractClientView;
