import React from 'react';
import Header from '../../layout/Header';
import Category from '../../UI/Category'

const CatalogPage = () => {
    return (
        <div>
            <Header/>
            <h1>Catalog</h1>
            <Category>Гитары</Category>
            <Category>Клавишные</Category>
            <Category>Ударные</Category>
        </div>
    );
};

export default CatalogPage; 