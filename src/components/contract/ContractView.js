import {
  Box,
  Button,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Stack
} from '@material-ui/core';
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useLocation, useNavigate } from 'react-router';

const ContractView = () => {
  const { contract } = useLocation().state;
  const [pages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const navigate = useNavigate();

  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

  const url = `https://ancient-dawn-76058.herokuapp.com/${contract.link_contract}`;

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

  return (
    <Card
      sx={{
        m: '30px'
      }}
    >
      <CardHeader title="Visualização do Contrato" />
      <Divider />
      <CardContent sx={{}}>
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
            onClick={() => navigate('/contracts')}
          >
            Voltar
          </Button>
        </Stack>
      </Box>
    </Card>
  );
};

export default ContractView;
