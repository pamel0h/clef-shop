import './bootstrap';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom/client';
import HomePage from './components/pages/Home/HomePage';
import NewsPage from './components/pages/News/NewsPage'; 
import CatalogPage from './components/pages/Catalog/CatalogPage'; 
import AboutPage from './components/pages/About/AboutPage'; 
import ContactPage from './components/pages/Contact/ContactPage'; 

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        { <Route path="/news" element={<NewsPage />} /> }
        { <Route path="/catalog" element={<CatalogPage />} /> }
        { <Route path="/about" element={<AboutPage />} /> }
        { <Route path="/contacts" element={<ContactPage />} /> }
      </Routes>
    </BrowserRouter>
  );
};

// Рендерим только App, всё остальное внутри него
ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);