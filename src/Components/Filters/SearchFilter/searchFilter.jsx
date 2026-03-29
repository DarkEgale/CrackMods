import './searchFilter.scss';
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function SearchFilter({ onSearch, placeholder = "Search apps..." }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className="search-filter">
      <div className="search-input-wrapper">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder={placeholder}
          className="search-input"
        />
        {searchTerm && (
          <button className="clear-btn" onClick={handleClear}>
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
