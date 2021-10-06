import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Input,
  Skeleton,
  Stack,
  Typography
} from '@material-ui/core';
import { Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import InformationSchema from 'src/schemas/InformationSchema';
import { API } from 'src/services/api';
import ToastAnimated, { showToast } from '../Toast';

const VisualIdentity = () => {
  const navigate = useNavigate();
  const [logo, setLogo] = useState();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  /**
   * Envia os dados do formulário
   */
  async function handleSubmit() {
    setSubmitting(true);

    if (selectedImage) {
      const token = window.localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      await API.post('identity/upload', { file: selectedImage }, config)
        .then((response) => {
          if (response.data.status === 200) {
            setShowSuccess(true);
          }
        })
        .catch((err) => {
          console.error(err);
          setShowSuccess(false);
        })
        .finally(() => {
          setSubmitting(false);
        });
    }
    setSubmitting(false);
  }

  /**
   * Obtém as informações do advogado
   */
  async function getLogo() {
    const token = window.localStorage.getItem('token');
    setLoading(true);

    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    await API.get('identity/logo', config)
      .then((response) => {
        if (response.data.status === 200) setLogo(response.data.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }

  /**
   * Use Effect
   */
  useEffect(() => {
    if (selectedImage) {
      setImageUrl(URL.createObjectURL(selectedImage));
    }
    getLogo();
  }, [selectedImage]);

  return loading ? (
    <Skeleton variant="rectangular" animation="wave" width="100%" height="100%">
      <div style={{ paddingTop: '57%' }} />
    </Skeleton>
  ) : (
    <Formik
      initialValues={{
        file: logo || ''
      }}
      validationSchema={InformationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, values, submitForm, setFieldError }) => (
        <form
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(values, errors, setFieldError);
          }}
        >
          <Card>
            <CardHeader title="Logomarca" />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item md={12} xs={12}>
                  <div htmlFor="icon-button-file">
                    <Input
                      accept="image/*"
                      id="icon-button-file"
                      type="file"
                      name="file"
                      onChange={(e) => setSelectedImage(e.target.files[0])}
                    />
                    <IconButton
                      color="primary"
                      aria-label="upload picture"
                      component="span"
                    />
                  </div>
                </Grid>
                <Grid item md={12} xs={12}>
                  <Typography variant="h5">Pré visualização</Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      mt: '2',
                      flexDirection: 'column'
                    }}
                  >
                    <Avatar
                      src={
                        imageUrl && selectedImage
                          ? imageUrl
                          : '/static/logo.png'
                      }
                      sx={{
                        height: '50%',
                        width: '50%'
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
                  type="submit"
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
            </>
          )}
        </form>
      )}
    </Formik>
  );
};

export default VisualIdentity;
