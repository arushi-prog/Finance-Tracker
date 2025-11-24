// ===========================
// DASHBOARD REACT APP
// ===========================

function DashboardApp() {
    const [transactions, setTransactions] = React.useState([]);

    function loadTransactions() {
        const recentTransactions = window.StorageHelper.getRecentTransactions(6);
        setTransactions(recentTransactions);
        console.log('[DashboardApp] Loaded recent transactions', recentTransactions.length, 'items');
    }

    // Initial load
    React.useEffect(() => {
        loadTransactions();
    }, []);

    // Listen for storageUpdated event (primary)
    React.useEffect(() => {
        const handleStorageUpdate = () => {
            console.log('[DashboardApp] storageUpdated event received');
            loadTransactions();
        };

        const handleStorageChange = (e) => {
            if (e.key === window.StorageHelper.STORAGE_KEY || e.key === null) {
                console.log('[DashboardApp] storage event received (cross-tab)');
                loadTransactions();
            }
        };

        window.addEventListener('storageUpdated', handleStorageUpdate);
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storageUpdated', handleStorageUpdate);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return (
        <>
            {transactions.map(transaction => (
                <window.ExpenseCard 
                    key={transaction.id}
                    transaction={transaction}
                    showDeleteButton={false}
                />
            ))}
            
            {transactions.length === 0 && (
                <div className="no-data-message">
                    <p>No transactions yet. <a href="add-expense.html">Add your first transaction!</a></p>
                </div>
            )}
        </>
    );
}

function ChartApp() {
    const [chartKey, setChartKey] = React.useState(0);

    React.useEffect(() => {
        const handleStorageUpdate = () => {
            console.log('[ChartApp] storageUpdated event received');
            setChartKey(prev => prev + 1);
        };

        const handleStorageChange = (e) => {
            if (e.key === window.StorageHelper.STORAGE_KEY || e.key === null) {
                console.log('[ChartApp] storage event received (cross-tab)');
                setChartKey(prev => prev + 1);
            }
        };

        window.addEventListener('storageUpdated', handleStorageUpdate);
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storageUpdated', handleStorageUpdate);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return <window.SimpleGraph key={chartKey} />;
}

// Render components when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Render recent transactions
    const transactionsContainer = document.getElementById('recentTransactions');
    if (transactionsContainer) {
        const root1 = ReactDOM.createRoot(transactionsContainer);
        root1.render(<DashboardApp />);
    }

    // Render chart
    const chartContainer = document.getElementById('categoryChart');
    if (chartContainer) {
        const root2 = ReactDOM.createRoot(chartContainer);
        root2.render(<ChartApp />);
    }

    // Expose global refresh method
    window.refreshDashboardComponents = () => {
        window.dispatchEvent(new CustomEvent('storageUpdated'));
    };

    // Auto-refresh when page becomes visible
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            window.dispatchEvent(new CustomEvent('storageUpdated'));
        }
    });
});
