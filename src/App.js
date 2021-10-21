import 'react-perfect-scrollbar/dist/css/styles.css';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './helpers/Route/ProtectedRoute';
import PageLayout from './components/PageLayout';
import Account from './pages/Account';
import CustomerList from './pages/CustomerList';
import ProductList from './pages/ProductList';
import { UserStorage } from './contexts/UserContext';
import Login from './pages/Login';
import MainLayout from './components/MainLayout';
import Settings from './pages/Settings';
import UserProfile from './pages/UserProfile';
import Permissions from './components/Permissions';
import ProfileTypes from './components/ProfileTypes';
import MyInformation from './pages/MyInformation';
import Identity from './pages/Identity';
import Client from './pages/Client';
import ClientCreate from './components/client/ClientCreate';
import ClientEdit from './components/client/ClientEdit';

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
                <Route path="404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" />} />
                <Route path="/" element={<Navigate to="/login" />} />
              </MainLayout>
              <PageLayout>
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
