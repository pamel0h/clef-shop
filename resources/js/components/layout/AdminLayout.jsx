// src/components/layout/AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
    return (
        
        <div className="admin-layout">
            
            {/* Здесь можно добавить админский хедер, сайдбар или что-то ещё */}
            <main>
                <Outlet /> {/* Здесь будут рендериться дочерние маршруты */}
            </main>
        </div>
    );
};

export default AdminLayout;