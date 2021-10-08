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
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { UserContext } from 'src/contexts/UserContext';
import { API } from 'src/services/api';
import ToastAnimated, { showToast } from '../Toast';

const VisualIdentity = () => {
  const { data, loading } = useContext(UserContext);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(false);

  /**
   * Envia os dados do formulário
   */
  async function handleSubmit() {
    setSubmitting(true);
    setShowSuccess(false);

    if (selectedImage) {
      const token = window.localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const formData = new FormData();
      formData.append('image', selectedImage);

      await API.post('identity/upload', formData, config)
        .then((response) => {
          if (response.data.status === 200) {
            setShowSuccess(true);
          }
        })
        .catch((err) => {
          const errorImage = err.response.data.errors;
          if (errorImage.image) {
            setError(errorImage.image[0]);
          }
          console.error(err);
          setShowSuccess(false);
        });
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
  }, [selectedImage, showSuccess]);

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
        onSubmit={handleSubmit}
      >
        {({ errors, values, submitForm, setFieldError }) => (
          <form
            autoComplete="off"
            onSubmit={(e) => {
              e.preventDefault();
              setShowSuccess(false);
              handleSubmit(values, errors, setFieldError);
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
                      onChange={(e) => setSelectedImage(e.target.files[0])}
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
                  <Button
                    color="primary"
                    variant="contained"
                    type="button"
                    onClick={submitForm}
                  >
                    Salvar
                  </Button>
                )}
              </Stack>
            </Box>
            {showSuccess && (
              <>
                <ToastAnimated />
                {showToast({
                  type: 'success',
                  message: 'Logomarca alterada com sucesso!'
                })}
                <div className="mt-3">
                  {showToast({
                    type: 'warning',
                    message:
                      'Deslogue e logue novamente para atualização da logo.'
                  })}
                </div>
              </>
            )}
          </form>
        )}
      </Formik>
    </>
  );
};

export default VisualIdentity;
