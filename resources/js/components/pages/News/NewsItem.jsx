import { useParams } from 'react-router-dom';
import '../../../../css/components/NewsItem.css'; 

const NewsItem = () => {
    const { newsId } = useParams();
    return (
        <div className='page page--news-item'>
            <h2>News Item: {newsId}</h2>
            <div className='blocknews'></div>
            <p>kfdsfsfsdfjpsfsodfsfsdfsfjsdfksdopfksfsdpfjsdpfjspfjsdpfjsdpfjsdpfjsdpfspfsfpewpfesfnspfje</p>
        </div>
    );
};

export default NewsItem;