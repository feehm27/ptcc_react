import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
  Typography
} from '@material-ui/core';
import { Formik } from 'formik';
import { find } from 'lodash';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { NavLink } from 'react-router-dom';
import ClientJoinSchema from 'src/schemas/ClientJoinSchema';

import { API } from 'src/services/api';

const ContractJoin = () => {
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState();
  const [showSelectedClients, setShowSelectedClients] = useState(false);

  /**
   * Obtém a lista de clientes do advogado
   */
  async function getClients() {
    setShowSelectedClients(false);
    const config = {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem('token')}`
      }
    };

    await API.get(`advocates/clients?check_contract=1`, config)
      .then((response) => {
        setClients(response.data.data);
        setShowSelectedClients(true);
      })
      .catch((err) => {
        console.error(err);
        setShowSelectedClients(false);
      });
  }

  /**
   * Use Effect
   */
  useEffect(() => {
    getClients();
  }, []);

  return (
    <Formik
      initialValues={{
        clients: ''
      }}
      validationSchema={ClientJoinSchema}
      onSubmit={() => {
        const findClient = find(clients, function findClient(client) {
          return client.id === Number(selectedClientId);
        });

        navigate('/contracts/create', {
          state: { client: findClient }
        });
      }}
    >
      {({ errors, handleBlur, handleChange, values, submitForm }) => (
        <form
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          {showSelectedClients &&
            (clients.length > 0 ? (
              <div>
                <Grid container spacing={12}>
                  <Dialog
                    fullWidth
                    open={showSelectedClients}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      <Typography
                        color="primary"
                        variant="h5"
                        textAlign="center"
                      >
                        Vincular Cliente
                      </Typography>
                    </DialogTitle>
                    <DialogContent>
                      <Grid item md={12} xs={12}>
                        <TextField
                          error={errors.clients}
                          fullWidth
                          helperText={errors.clients}
                          label="Selecione um cliente"
                          name="clients"
                          onBlur={(event) => {
                            handleBlur(event);
                            setSelectedClientId(event.target.value);
                          }}
                          onChange={(event) => {
                            handleChange(event);
                            setSelectedClientId(event.target.value);
                          }}
                          required
                          select
                          SelectProps={{ native: true }}
                          value={values.clients}
                          variant="outlined"
                        >
                          <option key={0} value={0}>
                            Selecione uma opção
                          </option>
                          {clients.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.name}
                            </option>
                          ))}
                        </TextField>
                      </Grid>
                    </DialogContent>
                    <DialogActions>
                      <Button
                        onClick={() => {
                          navigate('/contracts');
                        }}
                        color="primary"
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        onClick={submitForm}
                        autoFocuscolor="primary"
                        variant="contained"
                      >
                        Vincular
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Grid>
              </div>
            ) : (
              <div>
                <Grid container spacing={12}>
                  <Dialog
                    borderRadius="2"
                    borderColor="text.primary"
                    fullWidth
                    open={showSelectedClients}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">
                      <Typography
                        color="primary"
                        variant="h5"
                        textAlign="center"
                      >
                        Vincular Cliente
                      </Typography>
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText
                        id="alert-dialog-description"
                        textAlign="justify"
                      >
                        <b>
                          Você não possui clientes cadastrados para vínculo ou
                          todos os seus clientes já estão vinculados a um
                          contrato.
                        </b>
                        <NavLink
                          to={{
                            pathname: '/clients'
                          }}
                        >
                          &nbsp;Clique aqui
                        </NavLink>{' '}
                        <b>para cadastrar um novo cliente.</b>
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button
                        onClick={() => {
                          navigate('/contracts');
                        }}
                        color="primary"
                        variant="outlined"
                        style={{ margin: '0 auto', display: 'block' }}
                      >
                        Voltar
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Grid>
              </div>
            ))}
        </form>
      )}
    </Formik>
  );
};

export default ContractJoin;
