import { useLocation } from 'react-router-dom';
// import './SearchPage.css'; 

function SearchPage() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get('query') || '';

    return (
        <div className="search-page">
            <h1>Search</h1>
            <h1>Результаты поиска по запросу: {query || 'Ничего не введено'}</h1>
            <p>{query ? `Вы ввели: ${query}` : 'Пожалуйста, введите запрос для поиска.'}</p>
            <div>
                {query ? (
                    <p>Здесь будут результаты поиска для "{query}".</p>
                ) : (
                    <p>Результаты поиска отсутствуют.</p>
                )}
            </div>
        </div>
    );
}

export default SearchPage;