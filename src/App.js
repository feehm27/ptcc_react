import { ThemeProvider } from '@material-ui/core';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import AdvocateContactShow from './components/advocate_contact/AdvocateContactShow';
import ClientCreate from './components/client/ClientCreate';
import ClientEdit from './components/client/ClientEdit';
import ClientContactCreate from './components/client_contact/ClientContactCreate';
import ClientContactSend from './components/client_contact/ClientContactSend';
import ClientContactSent from './components/client_contact/ClientContactSent';
import ClientContactShow from './components/client_contact/ClientContactShow';
import ContractCreate from './components/contract/ContractCreate';
import ContractEdit from './components/contract/ContractEdit';
import ContractView from './components/contract/ContractView';
import ContractJoin from './components/contract/ContractJoin';
import MainLayout from './components/MainLayout';
import PageLayout from './components/PageLayout';
import Permissions from './components/Permissions';
import ProfileTypes from './components/ProfileTypes';
import UserCreate from './components/users/UserCreate';
import UserEdit from './components/users/UserEdit';
import { UserStorage } from './contexts/UserContext';
import ProtectedRoute from './helpers/Route/ProtectedRoute';
import Account from './pages/Account';
import AdvocateContact from './pages/AdvocateContact';
import ChangePassword from './pages/ChangePassword';
import Client from './pages/Client';
import ClientContact from './pages/ClientContact';
import Construction from './pages/Construction';
import Contract from './pages/Contract';
import CustomerList from './pages/CustomerList';
import Dashboard from './pages/Dashboard';
import DashboardClient from './pages/DashboardClient';
import Identity from './pages/Identity';
import Login from './pages/Login';
import MyInformation from './pages/MyInformation';
import NotAllowed from './pages/NotAllowed';
import NotFound from './pages/NotFound';
import ProductList from './pages/ProductList';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import Settings from './pages/Settings';
import User from './pages/User';
import UserProfile from './pages/UserProfile';
import Process from './pages/Process';
import ProcessJoin from './components/process/ProcessJoin';
import ProcessCreate from './components/process/ProcessCreate';
import ProcessEdit from './components/process/ProcessEdit';
import ProcessHistoric from './components/process/ProcessHistoric';
import Meeting from './pages/Meeting';
import MeetingSearch from './components/meeting/MettingSearch';

function App() {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <BrowserRouter>
          <UserStorage>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="reset-password" element={<ResetPassword />} />
              <Route
                path="change-password/:token"
                element={<ChangePassword />}
              />
              <MainLayout>
                <Route path="*" element={<Navigate to="/404" />} />
                <Route path="/" element={<Navigate to="/login" />} />
              </MainLayout>
              <PageLayout>
                <Route path="404" element={<NotFound />} />
                <Route path="construction" element={<Construction />} />
                <Route path="not-allowed" element={<NotAllowed />} />

                <ProtectedRoute path="/dashboard" element={<Dashboard />} />
                <ProtectedRoute
                  path="/dashboard-client"
                  element={<DashboardClient />}
                />

                <ProtectedRoute path="/account" element={<Account />} />

                <ProtectedRoute
                  path="/informations"
                  element={<MyInformation />}
                />
                <ProtectedRoute path="/identity" element={<Identity />} />

                <ProtectedRoute path="/clients" element={<Client />} />

                <ProtectedRoute path="/contracts" element={<Contract />} />

                <ProtectedRoute
                  path="/contracts/edit"
                  element={<ContractEdit />}
                />

                <ProtectedRoute
                  path="/contracts/view"
                  element={<ContractView />}
                />

                <ProtectedRoute
                  path="/contracts/join"
                  element={<ContractJoin />}
                />

                <ProtectedRoute
                  path="/contracts/create"
                  element={<ContractCreate />}
                />

                <ProtectedRoute path="/processes" element={<Process />} />

                <ProtectedRoute
                  path="/processes/join"
                  element={<ProcessJoin />}
                />

                <ProtectedRoute
                  path="/processes/create"
                  element={<ProcessCreate />}
                />

                <ProtectedRoute
                  path="/processes/edit"
                  element={<ProcessEdit />}
                />

                <ProtectedRoute
                  path="/processes/historic"
                  element={<ProcessHistoric />}
                />

                <ProtectedRoute path="/meetings" element={<Meeting />} />

                <ProtectedRoute
                  path="/meetings/search"
                  element={<MeetingSearch />}
                />

                <ProtectedRoute path="/clients/edit" element={<ClientEdit />} />

                <ProtectedRoute
                  path="/clients/create"
                  element={<ClientCreate />}
                />

                <ProtectedRoute path="/contacts" element={<ClientContact />} />

                <ProtectedRoute
                  path="/contacts/create"
                  element={<ClientContactCreate />}
                />
                <ProtectedRoute
                  path="/contacts/show"
                  element={<ClientContactShow />}
                />
                <ProtectedRoute
                  path="/contacts/send"
                  element={<ClientContactSend />}
                />

                <ProtectedRoute
                  path="/contacts/sent"
                  element={<ClientContactSent />}
                />

                <ProtectedRoute
                  path="/advocate/contacts"
                  element={<AdvocateContact />}
                />

                <ProtectedRoute
                  path="/advocates/contacts/show"
                  element={<AdvocateContactShow />}
                />

                <ProtectedRoute path="/users" element={<User />} />
                <ProtectedRoute path="/users/create" element={<UserCreate />} />
                <ProtectedRoute path="/users/edit" element={<UserEdit />} />

                <ProtectedRoute path="/products" element={<ProductList />} />
                <ProtectedRoute path="/settings" element={<Settings />} />
                <ProtectedRoute path="/customers" element={<CustomerList />} />

                <ProtectedRoute
                  path="/profiles/types"
                  element={<ProfileTypes />}
                />
                <ProtectedRoute
                  path="/users/profile"
                  element={<UserProfile />}
                />
                <ProtectedRoute
                  path="/users/permissions"
                  element={<Permissions />}
                />
                <ProtectedRoute path="404" element={<NotFound />} />
              </PageLayout>
            </Routes>
          </UserStorage>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
