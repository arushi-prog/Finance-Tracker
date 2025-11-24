// ===========================
// HISTORY PAGE REACT APP
// ===========================

function HistoryApp() {
    const [activeFilter, setActiveFilter] = React.useState('all');
    const [transactions, setTransactions] = React.useState([]);

    // Load transactions on mount and when filter changes
    React.useEffect(() => {
        loadTransactions();
    }, [activeFilter]);

    function loadTransactions() {
        let allTransactions = window.StorageHelper.getAllTransactions();
        
        // Sort by date (newest first)
        allTransactions = allTransactions.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
        );

        // Filter by category
        if (activeFilter !== 'all') {
            allTransactions = allTransactions.filter(t => t.category === activeFilter);
        }

        setTransactions(allTransactions);
    }

    function handleDelete(id) {
        window.deleteTransaction(id);
    }

    return (
        <>
            {transactions.map(transaction => (
                <window.ExpenseCard 
                    key={transaction.id}
                    transaction={transaction}
                    showDeleteButton={true}
                    onDelete={handleDelete}
                />
            ))}
        </>
    );
}

function FilterApp() {
    const [activeFilter, setActiveFilter] = React.useState('all');

    function handleFilterChange(filter) {
        setActiveFilter(filter);
        
        // Trigger re-render of transactions
        const event = new CustomEvent('filterChanged', { detail: filter });
        window.dispatchEvent(event);
    }

    return (
        <window.CategoryFilter 
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
        />
    );
}

// Render components when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('[History] DOM loaded');
    
    // Give Babel time to compile JSX
    setTimeout(() => {
        console.log('[History] Components check:', {
            StorageHelper: !!window.StorageHelper,
            ExpenseCard: !!window.ExpenseCard,
            CategoryFilter: !!window.CategoryFilter,
            React: !!window.React,
            ReactDOM: !!window.ReactDOM
        });
        
        if (!window.ExpenseCard) {
            console.error('[History] ExpenseCard not loaded! Cannot render.');
            return;
        }
        
        initHistoryPage();
    }, 200);
});

function initHistoryPage() {
    console.log('[History] Initializing page...');
    
    // Render filter
    const filterContainer = document.getElementById('categoryFilter');
    if (filterContainer && window.CategoryFilter) {
        const filterRoot = ReactDOM.createRoot(filterContainer);
        filterRoot.render(<FilterApp />);
        console.log('[History] Filter rendered');
    } else {
        console.error('[History] Filter container or CategoryFilter not found');
    }

    // Render transactions list
    const listContainer = document.getElementById('transactionsList');
    if (listContainer && window.ExpenseCard) {
        const listRoot = ReactDOM.createRoot(listContainer);
        let currentFilter = 'all';
        
        function renderList(filter = 'all') {
            currentFilter = filter;
            let allTransactions = window.StorageHelper.getAllTransactions();
            
            console.log('[History] renderList called with filter:', filter);
            console.log('[History] Total transactions found:', allTransactions.length);
            console.log('[History] Transactions:', allTransactions);
            
            // Sort by date (newest first)
            allTransactions = allTransactions.sort((a, b) => 
                new Date(b.createdAt) - new Date(a.createdAt)
            );

            // Filter by category
            if (filter !== 'all') {
                allTransactions = allTransactions.filter(t => t.category === filter);
                console.log('[History] After category filter:', allTransactions.length);
            }

            // Show/hide empty state
            const emptyState = document.getElementById('emptyState');
            if (allTransactions.length === 0) {
                console.log('[History] No transactions - showing empty state');
                listContainer.style.display = 'none';
                if (emptyState) emptyState.classList.remove('hidden');
            } else {
                console.log('[History] Showing', allTransactions.length, 'transactions');
                listContainer.style.display = 'flex';
                if (emptyState) emptyState.classList.add('hidden');
            }

            // Render transactions
            console.log('[History] Rendering', allTransactions.length, 'transactions...');
            
            try {
                listRoot.render(
                    <>
                        {allTransactions.map(transaction => (
                            <window.ExpenseCard 
                                key={transaction.id}
                                transaction={transaction}
                                showDeleteButton={true}
                                onDelete={window.deleteTransaction}
                            />
                        ))}
                    </>
                );
                console.log('[History] Render complete');
            } catch (err) {
                console.error('[History] React render failed:', err);
                
                // Fallback: Direct HTML render
                console.log('[History] Using fallback HTML render');
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
                            <button class="delete-btn" onclick="window.deleteTransaction('${t.id}')">Delete</button>
                        </div>
                    `;
                }).join('');
            }
        }

        // Initial render
        renderList();

        // Listen for filter changes
        window.addEventListener('filterChanged', (e) => {
            renderList(e.detail);
        });

        // Listen for primary storageUpdated event
        window.addEventListener('storageUpdated', () => {
            console.log('[History] storageUpdated event received');
            renderList(currentFilter);
        });

        // Listen for storage changes (cross-tab)
        window.addEventListener('storage', (e) => {
            if (e.key === window.StorageHelper.STORAGE_KEY || e.key === null) {
                console.log('[History] storage event received (cross-tab)');
                renderList(currentFilter);
            }
        });

        // Expose refresh method globally
        window.refreshHistory = () => renderList(currentFilter);

        // Auto-refresh when page becomes visible (user switches back to tab)
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                renderList(currentFilter);
            }
        });
        
        console.log('[History] All listeners attached');
    } else {
        console.error('[History] List container or ExpenseCard not found');
    }
}
