import HomePage from '../components/pages/Home/HomePage';
import NewsPage from '../components/pages/News/NewsPage';
import CatalogPage from '../components/pages/Catalog/CatalogPage';
import AboutPage from '../components/pages/About/AboutPage';
import ContactPage from '../components/pages/Contact/ContactPage';
import ProfilePage from '../components/pages/Profile/ProfilePage';
import CartPage from '../components/pages/Cart/CartPage';
import { Layout } from '../components/layout/Layout';
import AdminLayout from '../components/layout/AdminLayout'; // Новый layout
import CategoriesList from '../components/pages/Catalog/CategoriesList';
import { SubcategoriesList } from '../components/pages/Catalog/SubcategoriesList';
import ProductsPage from '../components/pages/Catalog/ProductsPage';
import ProductDetailsPage from '../components/pages/Catalog/ProductDetailsPage';
import NewsItem from '../components/pages/News/NewsItem';
import SearchPage from '../components/pages/Catalog/SearchPage';
import ProtectedRoute from './ProtectedRoute';
import AdminProtectedRoute from './AdminProtectedRoute';
import AdminCatalogPage from '../components/pages/Admin/AdminCatalogPage';
import AdminDashboard from '../components/pages/Admin/AdminDashboard';
import AdminPageEditor from '../components/pages/Admin/AdminPageEditor';
import TableOrders from '../components/pages/Admin/TableOrders';
import TableUsers from '../components/pages/Admin/TableUsers';
import MessagesPage from '../components/pages/Admin/MessagePage';

export const routes = [
    {
        element: <Layout />, // Основной layout для публичных страниц
        children: [
            { path: '/', element: <HomePage /> },
            { path: '/news', element: <NewsPage /> },
            { path: '/news/:newsId', element: <NewsItem /> },
            {
                path: '/catalog',
                element: <CatalogPage />,
                children: [
                    { index: true, element: <CategoriesList /> },
                    { path: ':categorySlug', element: <SubcategoriesList /> },
                    { path: ':categorySlug/:subcategorySlug', element: <ProductsPage /> },
                    { path: ':categorySlug/:subcategorySlug/:productId', element: <ProductDetailsPage /> },
                ],
            },
            { path: '/about', element: <AboutPage /> },
            { path: '/contacts', element: <ContactPage /> },
            {
                path: '/profile',
                element: (
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                ),
            },
            { path: '/cart', element: <CartPage /> },
            {
                path: ':search',
                element: <SearchPage />,
                children: [
                    { index: true, element: <ProductsPage /> },
                    { path: ':productId', element: <ProductDetailsPage /> },
                ],
            },
        ],
    },
    {
        element: <AdminLayout />, // Отдельный layout для админки
        children: [
            {
                path: '/admin/dashboard',
                element: (
                    <AdminProtectedRoute>
                        <AdminDashboard />
                    </AdminProtectedRoute>
                ),
            },
            {
                path: '/admin/catalog',
                element: (
                    <AdminProtectedRoute>
                        <AdminCatalogPage />
                    </AdminProtectedRoute>
                ),
            },
            ,
            {
                path: '/admin/pages/:pageId',
                element: (
                <AdminProtectedRoute>
                    <AdminPageEditor />
                </AdminProtectedRoute>
                ),
            },
            {
                path: '/admin/orders',
                element: (
                <AdminProtectedRoute>
                    <TableOrders />
                </AdminProtectedRoute>
                ),
            },
            {
                path: '/admin/users',
                element: (
                <AdminProtectedRoute>
                    <TableUsers />
                </AdminProtectedRoute>
                ),
            },
            {
                path: '/admin/messages',
                element: (
                <AdminProtectedRoute>
                    <MessagesPage />
                </AdminProtectedRoute>
                ),
            }
            
                    
        ],
    },
];