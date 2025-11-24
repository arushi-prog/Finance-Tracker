// ===========================
// LOCAL STORAGE UTILITIES (Robust Version)
// ===========================

const StorageHelper = {
    STORAGE_KEY: 'financeTrackerData',

    // Safe JSON parse helper
    _safeParse(raw, fallback = []) {
        if (!raw) return fallback;
        try {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : fallback;
        } catch (e) {
            console.warn('[StorageHelper] Corrupted data. Resetting.', e);
            return fallback;
        }
    },

    // Safe stringify + save
    _safeSave(list) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
        } catch (e) {
            console.error('[StorageHelper] Failed to save data.', e);
        }
    },

    // Generate a unique ID
    generateId() {
        if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
        return 'tx_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
    },

    // Get all transactions
    getAllTransactions() {
        const raw = localStorage.getItem(this.STORAGE_KEY);
        return this._safeParse(raw, []);
    },

    // Replace all transactions
    saveAllTransactions(list) {
        if (!Array.isArray(list)) return;
        this._safeSave(list);
    },

    // Add a transaction
    addTransaction(tx) {
        const transactions = this.getAllTransactions();
        const normalized = {
            id: this.generateId(),
            type: tx.type === 'income' ? 'income' : 'expense',
            description: (tx.description || '').trim().slice(0, 200),
            amount: Number.isFinite(tx.amount) ? Number(tx.amount) : 0,
            category: (tx.category || 'other'),
            date: this._normalizeDate(tx.date),
            notes: (tx.notes || '').trim().slice(0, 300),
            createdAt: new Date().toISOString()
        };
        transactions.push(normalized);
        this._safeSave(transactions);
        return normalized;
    },

    // Delete transaction by ID
    deleteTransaction(id) {
        const transactions = this.getAllTransactions();
        const updated = transactions.filter(t => t.id !== id);
        this._safeSave(updated);
        return updated;
    },

    clearAllData() {
        try { localStorage.removeItem(this.STORAGE_KEY); } catch (e) {}
    },

    getTransactionsByType(type) {
        return this.getAllTransactions().filter(t => t.type === type);
    },

    getTransactionsByCategory(category) {
        return this.getAllTransactions().filter(t => t.category === category);
    },

    getTotalIncome() {
        return this.getTransactionsByType('income')
            .reduce((sum, t) => sum + (Number.isFinite(t.amount) ? t.amount : 0), 0);
    },

    getTotalExpenses() {
        return this.getTransactionsByType('expense')
            .reduce((sum, t) => sum + (Number.isFinite(t.amount) ? t.amount : 0), 0);
    },

    getBalance() {
        return this.getTotalIncome() - this.getTotalExpenses();
    },

    getSpendingByCategory() {
        const map = {};
        this.getTransactionsByType('expense').forEach(t => {
            const key = t.category || 'other';
            const amt = Number.isFinite(t.amount) ? t.amount : 0;
            map[key] = (map[key] || 0) + amt;
        });
        return map;
    },

    getRecentTransactions(limit = 5) {
        return this.getAllTransactions()
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, limit);
    },

    // Category metadata
    _categoryMeta: {
        food: { icon: '🍔', name: 'Food & Dining' },
        transport: { icon: '🚗', name: 'Transportation' },
        shopping: { icon: '🛍️', name: 'Shopping' },
        entertainment: { icon: '🎬', name: 'Entertainment' },
        bills: { icon: '💡', name: 'Bills & Utilities' },
        health: { icon: '⚕️', name: 'Healthcare' },
        education: { icon: '📚', name: 'Education' },
        salary: { icon: '💼', name: 'Salary' },
        other: { icon: '📦', name: 'Other' }
    },

    getCategoryIcon(category) {
        return (this._categoryMeta[category] || this._categoryMeta.other).icon;
    },

    getCategoryName(category) {
        return (this._categoryMeta[category] || this._categoryMeta.other).name;
    },

    formatCurrency(amount) {
        const safe = Number.isFinite(amount) ? amount : 0;
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(safe);
    },

    formatDate(dateString) {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    },

    _normalizeDate(raw) {
        const d = new Date(raw);
        if (isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
        return d.toISOString().slice(0, 10); // yyyy-mm-dd
    }
};

window.StorageHelper = StorageHelper;
