import HomePage from '../components/pages/Home/HomePage';
import NewsPage from '../components/pages/News/NewsPage';
import CatalogPage from '../components/pages/Catalog/CatalogPage';
import AboutPage from '../components/pages/About/AboutPage';
import ContactPage from '../components/pages/Contact/ContactPage';
import { Layout } from '../components/layout/Layout';
import CategoriesList from '../components/pages/Catalog/CategoriesList';
import {SubcategoriesList} from '../components/pages/Catalog/SubcategoriesList';
import { ProductsList } from '../components/pages/Catalog/ProductsList'; 


export const routes = [
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage/> },
      { path: '/news', element: <NewsPage/> },
      {
  path: '/catalog',
  element: <CatalogPage />,
  children: [
    { 
      index: true, 
      element: <CategoriesList /> 
    },
    {
      path: ':categorySlug', 
      children: [
        {
          index: true,
          element: <SubcategoriesList />,
        },
        {
          path: ':subcategorySlug',
          element: <ProductsList />,
        }
      ]
    }
  ]
},
      { path: '/about', element: <AboutPage/> },
      { path: '/contacts', element: <ContactPage/> },
    ],
  },
];