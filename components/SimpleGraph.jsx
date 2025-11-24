// ===========================
// SIMPLE GRAPH REACT COMPONENT (CSS-based Bar Chart)
// ===========================

function SimpleGraph() {
    const categoryData = window.StorageHelper.getSpendingByCategory();
    
    // Convert to array and sort by amount
    const dataArray = Object.entries(categoryData)
        .map(([category, amount]) => ({
            category,
            amount,
            label: window.StorageHelper.getCategoryName(category),
            icon: window.StorageHelper.getCategoryIcon(category)
        }))
        .sort((a, b) => b.amount - a.amount);

    // Calculate max for percentage
    let maxAmount = Math.max(...dataArray.map(d => d.amount), 0);
    if (maxAmount <= 0) maxAmount = 1; // Prevent divide-by-zero

    // Color palette for bars
    const colors = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
        'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
        'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
    ];

    if (dataArray.length === 0) {
        return (
            <div className="no-data-message" role="img" aria-label="Spending by category: no data available">
                <p>No expense data available yet. Start adding transactions to see your spending breakdown!</p>
            </div>
        );
    }

    return (
        <div className="bar-chart" role="img" aria-label="Spending by category bar chart">
            <div className="sr-only" aria-hidden="false">
                <p>Spending details:</p>
                <ul>
                    {dataArray.map(item => (
                        <li key={`sr-${item.category}`}>{item.label}: {window.StorageHelper.formatCurrency(item.amount)}</li>
                    ))}
                </ul>
            </div>
            {dataArray.map((item, index) => {
                const percentage = (item.amount / maxAmount) * 100;
                const barColor = colors[index % colors.length];

                return (
                    <div key={item.category} className="bar-item">
                        <div className="bar-label">
                            <span>{item.icon}</span> {item.label}
                        </div>
                        <div className="bar-container">
                            <div 
                                className="bar-fill" 
                                style={{
                                    width: `${percentage}%`,
                                    background: barColor
                                }}
                            >
                            </div>
                        </div>
                        <div className="bar-value">
                            {window.StorageHelper.formatCurrency(item.amount)}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// Make it globally available
window.SimpleGraph = SimpleGraph;
