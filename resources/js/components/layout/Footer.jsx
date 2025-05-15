import '../../../css/components/Footer.css'; 


function Footer() {
    return(
        <div className="footer">
            <div className="footer-container">
                <div className="qr-code"></div>
                <div className="media">
                    <div className="vk">
                        <div className="icon-temp"></div> 
                        <p>@clef_mus</p>
                    </div>
                    <div className="telegram">
                        <div className="icon-temp"></div> 
                        <p>@clef_shop</p>
                    </div>
                    <div className="instagram">
                        <div className="icon-temp"></div> 
                        <p>@clef</p>
                    </div>
                </div>
            </div>
            <p >Clef 2025</p>
        </div>
        
    );
}

export default Footer;
