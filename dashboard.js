// ===========================
// DASHBOARD PAGE LOGIC
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    updateDashboard();

    // Listen for the primary storageUpdated event
    window.addEventListener('storageUpdated', () => {
        console.log('[Dashboard] storageUpdated event received');
        updateDashboard();
        updateDebugBanner();
    });

    // Listen for storage changes (cross-tab)
    window.addEventListener('storage', (e) => {
        if (e.key === StorageHelper.STORAGE_KEY || e.key === null) {
            updateDashboard();
            updateDebugBanner();
        }
    });

    // Auto-refresh when page becomes visible
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            updateDashboard();
            updateDebugBanner();
        }
    });

    injectDebugBanner();
});

function updateDashboard() {
    // Update summary cards
    updateSummaryCards();
    
    // Recent transactions will be handled by React components
    // Chart will be handled by React components
}

function updateSummaryCards() {
    const totalIncome = StorageHelper.getTotalIncome();
    const totalExpense = StorageHelper.getTotalExpenses();
    const balance = StorageHelper.getBalance();

    console.log('[Dashboard] Totals recalculated', {
        totalIncome,
        totalExpense,
        balance,
        transactionsCount: StorageHelper.getAllTransactions().length
    });

    const incomeEl = document.getElementById('totalIncome');
    const expenseEl = document.getElementById('totalExpense');
    const balanceEl = document.getElementById('balance');

    if (incomeEl) {
        incomeEl.textContent = StorageHelper.formatCurrency(totalIncome);
    }
    if (expenseEl) {
        expenseEl.textContent = StorageHelper.formatCurrency(totalExpense);
    }
    if (balanceEl) {
        balanceEl.textContent = StorageHelper.formatCurrency(balance);
    }

    // Optional animation
    if (totalIncome > 0 || totalExpense > 0) {
        animateValue('totalIncome', 0, totalIncome, 800);
        animateValue('totalExpense', 0, totalExpense, 800);
        animateValue('balance', 0, balance, 800);
    }
}

function animateValue(id, start, end, duration) {
    const element = document.getElementById(id);
    if (!element) return; // Guard missing element
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        if (element) element.textContent = StorageHelper.formatCurrency(current);
    }, 16);
}

function injectDebugBanner() {
    if (document.getElementById('debugBanner')) return;
    const banner = document.createElement('div');
    banner.id = 'debugBanner';
    banner.style.position = 'fixed';
    banner.style.bottom = '10px';
    banner.style.right = '10px';
    banner.style.background = 'rgba(0,0,0,0.7)';
    banner.style.color = '#fff';
    banner.style.padding = '6px 10px';
    banner.style.fontSize = '12px';
    banner.style.borderRadius = '6px';
    banner.style.zIndex = '9999';
    banner.style.fontFamily = 'monospace';
    banner.style.pointerEvents = 'none';
    document.body.appendChild(banner);
    updateDebugBanner();
    window.addEventListener('transactionsUpdated', updateDebugBanner);
    window.addEventListener('storage', updateDebugBanner);
}

function updateDebugBanner() {
    const banner = document.getElementById('debugBanner');
    if (!banner) return;
    const list = StorageHelper.getAllTransactions();
    banner.textContent = `tx:${list.length} income:${StorageHelper.getTotalIncome().toFixed(2)} expense:${StorageHelper.getTotalExpenses().toFixed(2)} balance:${StorageHelper.getBalance().toFixed(2)}`;
}

// Export function for React components to trigger updates
window.refreshDashboard = updateDashboard;
