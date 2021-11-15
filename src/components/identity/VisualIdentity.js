import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Stack,
  Typography
} from '@material-ui/core';
import { Formik } from 'formik';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from 'src/contexts/UserContext';
import { API } from 'src/services/api';
import ToastAnimated, { showToast } from '../Toast';

const VisualIdentity = () => {
  const navigate = useNavigate();
  const { data, loading } = useContext(UserContext);
  const [submitting, setSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(false);

  const showMessage = useRef(false);

  /**
   * Envia os dados do formulário
   */
  async function handleSubmit() {
    setSubmitting(true);
    showMessage.current = false;

    if (selectedImage) {
      const token = window.localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const formData = new FormData();
      formData.append('image', selectedImage);

      await API.post('identity/upload', formData, config)
        .then(() => {
          showMessage.current = true;
        })
        .catch((err) => {
          const errorImage = err.response.data.errors;
          if (errorImage.image) {
            setError(errorImage.image[0]);
          }
          showMessage.current = false;
          console.error(err);
        });
    } else {
      setError(' Selecione uma nova imagem para alteração.');
    }
    setSubmitting(false);
  }

  /**
   * Obtém a url da imagem
   *
   */
  const getImage = () => {
    if (imageUrl && selectedImage) {
      return imageUrl;
    }
    if (data && data.logo !== null) {
      return data.logo;
    }
    return '/static/logo.png';
  };

  /**
   * Use Effect
   */
  useEffect(() => {
    if (selectedImage) {
      setImageUrl(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  return loading ? (
    <Skeleton variant="rectangular" animation="wave" width="100%" height="100%">
      <div style={{ paddingTop: '57%' }} />
    </Skeleton>
  ) : (
    <>
      <Formik
        initialValues={{
          file: null
        }}
      >
        {() => (
          <form
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <Card>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item md={12} xs={12}>
                    <Typography variant="h5">Logomarca</Typography>
                    <input
                      accept="image/png, image/jpeg, image/jpg"
                      id="icon-button-file"
                      type="file"
                      onChange={(e) => {
                        showMessage.current = false;
                        setSelectedImage(e.target.files[0]);
                        setError(null);
                      }}
                      style={{ marginTop: '15px' }}
                    />
                    {error && (
                      <Typography
                        variant="h6"
                        style={{ marginTop: '15px' }}
                        color="#f44336"
                      >
                        Arquivo inválido.{error}
                      </Typography>
                    )}
                  </Grid>

                  <Grid item md={12} xs={12}>
                    <Typography variant="h5">Pré Visualização</Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <Avatar
                        variant="rounded"
                        src={getImage()}
                        sx={{
                          bgcolor: 'background.primary',
                          border: 1,
                          mt: '15px',
                          height: '20%',
                          width: '20%'
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
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
                  onClick={() => navigate('/dashboard')}
                >
                  Voltar
                </Button>
                {submitting ? (
                  <Button color="primary" variant="contained" disabled>
                    Carregando..
                  </Button>
                ) : (
                  <Button color="primary" variant="contained" type="submit">
                    Salvar
                  </Button>
                )}
              </Stack>
            </Box>
          </form>
        )}
      </Formik>
      {showMessage.current && (
        <>
          <ToastAnimated />
          {showToast({
            type: 'success',
            message: 'Logomarca alterada com sucesso!'
          })}
          {setTimeout(() => window.location.reload(), 1000)}
        </>
      )}
    </>
  );
};

export default VisualIdentity;
