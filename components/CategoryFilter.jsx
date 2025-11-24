// ===========================
// CATEGORY FILTER REACT COMPONENT
// ===========================

function CategoryFilter({ onFilterChange, activeFilter }) {
    const categories = [
        { value: 'all', label: 'All', icon: '📊' },
        { value: 'food', label: 'Food', icon: '🍔' },
        { value: 'transport', label: 'Transport', icon: '🚗' },
        { value: 'shopping', label: 'Shopping', icon: '🛍️' },
        { value: 'entertainment', label: 'Entertainment', icon: '🎬' },
        { value: 'bills', label: 'Bills', icon: '💡' },
        { value: 'health', label: 'Health', icon: '⚕️' },
        { value: 'education', label: 'Education', icon: '📚' },
        { value: 'salary', label: 'Salary', icon: '💼' },
        { value: 'other', label: 'Other', icon: '📦' }
    ];

    return (
        <div className="category-filter">
            {categories.map(category => (
                <button
                    key={category.value}
                    className={`filter-btn ${activeFilter === category.value ? 'active' : ''}`}
                    onClick={() => onFilterChange(category.value)}
                    aria-pressed={activeFilter === category.value}
                    aria-label={`Filter by ${category.label}${activeFilter === category.value ? ' (active)' : ''}`}
                >
                    <span aria-hidden="true">{category.icon}</span> {category.label}
                </button>
            ))}
        </div>
    );
}

// Make it globally available
window.CategoryFilter = CategoryFilter;
