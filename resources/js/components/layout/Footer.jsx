import '../../../css/components/Footer.css'; 
import TelegramIcon from '../icons/TelegramIcon';
import VkIcon from '../icons/VkIcon'
import TikTokIcon from '../icons/TikTokIcon'


function Footer() {
    return(
        <div className="footer">
            <div className="footer-container">
                <div className="qr-code"></div>
                <div className="media">
                    <div className="vk">
                        <VkIcon />
                        <p>@clef_mus</p>
                    </div>
                    <div className="telegram">
                        <TelegramIcon /> 
                        <p>@clef_shop</p>
                    </div>
                    <div className="tiktok">
                        <TikTokIcon />
                        <p>@clef</p>
                    </div>
                </div>
            </div>
            <p >Clef 2025</p>
        </div>
        
    );
}

export default Footer;
