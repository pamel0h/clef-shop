import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../UI/Button';
import Header from '../../layout/Header';
import Footer from '../../layout/Footer';

const HomePage = () => {
    return (
        <div className='page'>
            <Header/>
            <div className='content'>
                <h1>YOUR PERFECT SOUND STARTS HERE</h1>
                <div>
                    <Link to="/catalog">
                        <Button>Перейти в каталог</Button>
                    </Link>
                </div>
            </div>
            
            <Footer />
        </div>
    );
};

export default HomePage; // Не забываем экспортировать!