import { useTranslation } from 'react-i18next';
import "../../../../css/components/Message.css";

const Message = ({ message }) => {
    const { t } = useTranslation();

    return (
        <div className="message">
            <div className="message-user">
                <p><strong>{t('profile.message_user')}</strong> {message.message}</p>
                <p className="timestamp">{new Date(message.created_at).toLocaleString()}</p>
            </div>
            {message.admin_response && (
                <div className="message-admin">
                    <p><strong>{t('profile.message_admin')}</strong> {message.admin_response}</p>
                    <p className="timestamp">{new Date(message.updated_at).toLocaleString()}</p>
                </div>
            )}
        </div>
    );
};

export default Message;