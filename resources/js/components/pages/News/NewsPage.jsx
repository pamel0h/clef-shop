import '../../../../css/components/NewsPage.css'; 
import Button from '../../UI/Button';
import News from './News'

const NewsPage = () => {
    return (
        <div className="page page--news">
            <h1 className="titleNews">News</h1>
            <p className="descNews">Current events and promotions</p>
            <News className="news1 mainNews blockews" variant='big'>News1</News>
            <News className="news2 blockews">News2</News>
            <News className="news3 blockews">News3</News>
            <News className="news4 blockews">News4</News>
            <News className="news5 blockews">News5</News>
            <News className="news6 blockews">News6</News>
            <h1 className="titleArchive">Archive</h1>
            <News className="news7 blockews">News7</News>
            <News className="news8 blockews">News8</News>
            <News className="news9 blockews">News9</News>
            <News className="news10 blockews">News10</News>
            <News className="news11 blockews">News11</News>
            <News className="news12 blockews">News12</News>
            <div className="listpages blockews">
                <p>Страница</p>
                <div className='buttons'>
                    <Button size='small'>1</Button>
                    <Button size='small'>2</Button>
                    <Button size='small'>3</Button>

                </div>
            </div>
        </div>
    );
};

export default NewsPage;