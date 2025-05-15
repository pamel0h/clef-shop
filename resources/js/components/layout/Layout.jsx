import '../../../css/components/Layout.css'; 
import {Outlet} from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

export const Layout = () =>{
    return(
        <div className='app'>
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}