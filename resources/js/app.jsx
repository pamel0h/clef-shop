import './bootstrap';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import './i18n';
import ReactDOM from 'react-dom/client';
import { routes } from './config/routes';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';

// Рекурсивный рендер роутов
const renderRoutes = (routesToRender) => {
  return routesToRender.map((route, index) => (
    <Route
      key={route.path || index}
      path={route.path}
      index={route.index}
      element={route.element}
    >
      {route.children && renderRoutes(route.children)}
    </Route>
  ));
};

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {renderRoutes(routes)}
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
};

ReactDOM.createRoot(document.getElementById('app')).render(
  <App />
);