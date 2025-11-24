// ===========================
// SIMPLIFIED HISTORY PAGE (NO REACT STATE)
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    console.log('[History-Simple] Starting...');
    
    setTimeout(() => {
        renderHistoryPage();
    }, 300);
});

function renderHistoryPage() {
    console.log('[History-Simple] Rendering...');
    
    const listContainer = document.getElementById('transactionsList');
    const emptyState = document.getElementById('emptyState');
    
    if (!listContainer) {
        console.error('[History-Simple] List container not found');
        return;
    }
    
    const allTransactions = window.StorageHelper.getAllTransactions();
    console.log('[History-Simple] Found', allTransactions.length, 'transactions');
    
    if (allTransactions.length === 0) {
        listContainer.style.display = 'none';
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    }
    
    // Sort by date
    allTransactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Direct HTML render
    listContainer.innerHTML = allTransactions.map(t => {
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
                <button class="delete-btn" onclick="if(confirm('Delete this transaction?')){window.StorageHelper.deleteTransaction('${t.id}'); window.location.reload();}">Delete</button>
            </div>
        `;
    }).join('');
    
    listContainer.style.display = 'flex';
    if (emptyState) emptyState.classList.add('hidden');
    
    console.log('[History-Simple] Rendered successfully');
    
    // Listen for updates
    window.addEventListener('storageUpdated', renderHistoryPage);
}
