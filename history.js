// ===========================
// HISTORY PAGE LOGIC
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    const clearAllBtn = document.getElementById('clearAllBtn');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', handleClearAll);
    }
});

function handleClearAll() {
    if (!confirm('Are you sure you want to delete ALL transactions? This cannot be undone. Type OK to proceed.')) return;
    StorageHelper.clearAllData();
    window.location.reload();
}

// Function to be called by React components
window.deleteTransaction = function(id) {
    if (!confirm('Delete this transaction permanently?')) return;
    StorageHelper.deleteTransaction(id);
    window.location.reload();
};
