import '../../../../css/components/NewsPage.css'; 
import Button from '../../UI/Button';
import News from './News'

const NewsPage = () => {
    return (
        <div className="page page--news">
            <h1 className="titleNews">News</h1>
            <p className="descNews">Current events and promotions</p>
            <News title="News1" to="/news/1" className="news1" variant='big' />
            <News title="News2" to="/news/2" className="news2" />
            <News title="News3" to="/news/3" className="news3" />
            <News title="News4" to="/news/4" className="news4" />
            <News title="News5" to="/news/5" className="news5" />
            <News title="News6" to="/news/6" className="news6" />
            <h1 className="titleArchive">Archive</h1>
            <News title="News7" to="/news/7" className="news7" />
            <News title="News8" to="/news/8" className="news8" />
            <News title="News9" to="/news/9" className="news9" />
            <News title="News10" to="/news/10" className="news10" />
            <News title="News11" to="/news/11" className="news11" />
            <News title="News12" to="/news/12" className="news12" />
            <div className="listpages">
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