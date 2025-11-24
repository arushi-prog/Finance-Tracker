// ===========================
// SIMPLIFIED DASHBOARD (NO REACT STATE COMPLEXITY)
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    console.log('[Dashboard-Simple] Starting...');
    
    setTimeout(() => {
        renderDashboardComponents();
    }, 300);
});

function renderDashboardComponents() {
    console.log('[Dashboard-Simple] Rendering components...');
    
    // Render Recent Transactions
    renderRecentTransactions();
    
    // Render Chart
    renderSpendingChart();
    
    // Listen for updates
    window.addEventListener('storageUpdated', renderDashboardComponents);
}

function renderRecentTransactions() {
    const container = document.getElementById('recentTransactions');
    if (!container) return;
    
    const recentTransactions = window.StorageHelper.getRecentTransactions(6);
    console.log('[Dashboard-Simple] Recent transactions:', recentTransactions.length);
    
    if (recentTransactions.length === 0) {
        container.innerHTML = '<div class="no-data-message"><p>No transactions yet. <a href="add-expense.html">Add your first transaction!</a></p></div>';
        return;
    }
    
    container.innerHTML = recentTransactions.map(t => {
        const icon = window.StorageHelper.getCategoryIcon(t.category);
        const name = window.StorageHelper.getCategoryName(t.category);
        const amount = window.StorageHelper.formatCurrency(t.amount);
        const date = window.StorageHelper.formatDate(t.date);
        
        return `
            <div class="expense-card type-${t.type}">
                <div class="expense-card-header">
                    <div class="expense-card-title">
                        <span class="expense-category-icon">${icon}</span>
                        <span class="expense-description">${t.description}</span>
                    </div>
                    <div class="expense-amount ${t.type}">
                        ${t.type === 'income' ? '+' : '-'}${amount}
                    </div>
                </div>
                <div class="expense-card-body">
                    <span class="expense-category">${name}</span>
                    <span class="expense-date">${date}</span>
                </div>
                ${t.notes ? `<div class="expense-card-footer"><p class="expense-notes">${t.notes}</p></div>` : ''}
            </div>
        `;
    }).join('');
}

function renderSpendingChart() {
    const chartContainer = document.getElementById('categoryChart');
    if (!chartContainer) return;
    
    const categoryData = window.StorageHelper.getSpendingByCategory();
    console.log('[Dashboard-Simple] Category data:', categoryData);
    
    // Convert to array and sort
    const dataArray = Object.entries(categoryData)
        .map(([category, amount]) => ({
            category,
            amount,
            label: window.StorageHelper.getCategoryName(category),
            icon: window.StorageHelper.getCategoryIcon(category)
        }))
        .sort((a, b) => b.amount - a.amount);
    
    if (dataArray.length === 0) {
        chartContainer.innerHTML = '<div class="no-data-message"><p>No expense data available yet. Start adding transactions to see your spending breakdown!</p></div>';
        return;
    }
    
    // Calculate max for percentage
    let maxAmount = Math.max(...dataArray.map(d => d.amount), 0);
    if (maxAmount <= 0) maxAmount = 1;
    
    // Color palette
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
    
    const barsHTML = dataArray.map((item, index) => {
        const percentage = (item.amount / maxAmount) * 100;
        const barColor = colors[index % colors.length];
        
        return `
            <div class="bar-item">
                <div class="bar-label">
                    <span>${item.icon}</span> ${item.label}
                </div>
                <div class="bar-container">
                    <div class="bar-fill" style="width: ${percentage}%; background: ${barColor}">
                    </div>
                </div>
                <div class="bar-value">
                    ${window.StorageHelper.formatCurrency(item.amount)}
                </div>
            </div>
        `;
    }).join('');
    
    chartContainer.innerHTML = `<div class="bar-chart">${barsHTML}</div>`;
    console.log('[Dashboard-Simple] Chart rendered with', dataArray.length, 'categories');
}
