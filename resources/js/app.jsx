import './bootstrap';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { routes } from './config/routes';

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
    <BrowserRouter>
      <Routes>
        {renderRoutes(routes)}
      </Routes>
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);