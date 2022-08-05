import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { AuthProvider } from './providers/auth';
import { BrowserRouter } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const innerTheme = createTheme({
  palette: {
    primary: {
      main: '#43a047',
    },
    secondary: {
      main: '#43a047',
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={innerTheme}>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>

  </React.StrictMode>,
  document.getElementById('root')
);