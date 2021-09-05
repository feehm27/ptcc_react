import 'react-perfect-scrollbar/dist/css/styles.css';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import GlobalStyles from 'src/components/GlobalStyles';
import 'src/mixins/chartjs';
import theme from 'src/theme';
import { UserStorage } from './contexts/UserContext';
import Login from './pages/Login';
import MainLayout from './components/MainLayout';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <BrowserRouter>
          <UserStorage>
            <Routes>
              <MainLayout>
                <Route path="/login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" />} />
                <Route path="/" element={<Navigate to="/login" />} />
              </MainLayout>
            </Routes>
          </UserStorage>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
