import { ThemeProvider } from '@material-ui/core';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import ClientCreate from './components/client/ClientCreate';
import ClientEdit from './components/client/ClientEdit';
import MainLayout from './components/MainLayout';
import PageLayout from './components/PageLayout';
import Permissions from './components/Permissions';
import ProfileTypesTeste from './components/ProfileTypesTeste';
import UserCreate from './components/users/UserCreate';
import UserEdit from './components/users/UserEdit';
import { UserStorage } from './contexts/UserContext';
import ProtectedRoute from './helpers/Route/ProtectedRoute';
import Account from './pages/Account';
import Client from './pages/Client';
import CustomerList from './pages/CustomerList';
import Dashboard from './pages/Dashboard';
import Identity from './pages/Identity';
import Construction from './pages/Construction';
import Login from './pages/Login';
import MyInformation from './pages/MyInformation';
import NotFound from './pages/NotFound';
import ProductList from './pages/ProductList';
import Register from './pages/Register';
import Settings from './pages/Settings';
import User from './pages/User';
import UserProfile from './pages/UserProfile';

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
              <MainLayout>
                <Route path="*" element={<Navigate to="/404" />} />
                <Route path="/" element={<Navigate to="/login" />} />
              </MainLayout>
              <PageLayout>
                <Route path="404" element={<NotFound />} />
                <Route path="construction" element={<Construction />} />
                <ProtectedRoute path="/dashboard" element={<Dashboard />} />
                <ProtectedRoute path="/account" element={<Account />} />
                <ProtectedRoute
                  path="/informations"
                  element={<MyInformation />}
                />
                <ProtectedRoute path="/identity" element={<Identity />} />
                <ProtectedRoute path="/clients" element={<Client />} />
                <ProtectedRoute
                  path="/clients/create"
                  element={<ClientCreate />}
                />
                <ProtectedRoute path="/clients/edit" element={<ClientEdit />} />
                <ProtectedRoute path="/users" element={<User />} />
                <ProtectedRoute path="/users/create" element={<UserCreate />} />
                <ProtectedRoute path="/users/edit" element={<UserEdit />} />
                <ProtectedRoute path="/products" element={<ProductList />} />
                <ProtectedRoute path="/settings" element={<Settings />} />
                <ProtectedRoute path="/customers" element={<CustomerList />} />
                <ProtectedRoute
                  path="/profiles/types"
                  element={<ProfileTypesTeste />}
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
