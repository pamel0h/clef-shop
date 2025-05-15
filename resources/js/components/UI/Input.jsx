import { useState } from 'react';
import SearchIcon from "../icons/SearchIcon"
import '../../../css/components/Input.css'; 

const SearchBar = ({
    placeholder,
    variant = null, //"search"
}) => {
  const [query, setQuery] = useState('');
    const baseClass = 'input';
    const SearchClass = variant ? 'search' : '';
  return (
    <div className={baseClass}>
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      
      {variant && (
        <div className={SearchClass}>{<SearchIcon/>}</div>
      )}
    </div>
  );
};

export default SearchBar;