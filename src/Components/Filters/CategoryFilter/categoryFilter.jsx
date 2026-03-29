import './categoryFilter.scss';
import { useState } from 'react';

export default function CategoryFilter({ categories, onFilter, selectedCategory = 'All' }) {
  const [active, setActive] = useState(selectedCategory);

  const handleCategoryClick = (category) => {
    setActive(category);
    onFilter(category);
  };

  return (
    <div className="category-filter">
      <div className="categories-wrapper">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-btn ${active === category ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
