// ===========================
// ADD EXPENSE PAGE LOGIC
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('date');
    if (dateInput) dateInput.valueAsDate = new Date();

    const form = document.getElementById('expenseForm');
    if (form) form.addEventListener('submit', handleFormSubmit);
});

function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    clearFormError();

    const formData = new FormData(form);
    const rawAmount = formData.get('amount');
    const amount = parseFloat(rawAmount);
    const description = (formData.get('description') || '').trim();
    const category = (formData.get('category') || '').trim();
    const dateRaw = formData.get('date');
    const notes = (formData.get('notes') || '').trim();

    // Validation
    if (!description) return showFormError('Description is required.');
    if (!rawAmount || !Number.isFinite(amount) || amount <= 0) return showFormError('Amount must be a number greater than 0.');
    if (!category) return showFormError('Please select a category.');

    // Normalize date
    let normalizedDate = dateRaw;
    const d = new Date(dateRaw);
    if (isNaN(d.getTime())) normalizedDate = new Date().toISOString().slice(0, 10);
    else normalizedDate = d.toISOString().slice(0, 10);

    const transaction = {
        type: formData.get('type') === 'income' ? 'income' : 'expense',
        description,
        amount,
        category,
        date: normalizedDate,
        notes
    };

    StorageHelper.addTransaction(transaction);
    showSuccessMessage();

    form.reset();
    const dateInput = document.getElementById('date');
    if (dateInput) dateInput.valueAsDate = new Date();

    // Dispatch global event to notify all components
    try {
        window.dispatchEvent(new CustomEvent('storageUpdated'));
        console.log('[AddExpense] Dispatched storageUpdated event');
    } catch (e) {
        console.error('[AddExpense] Failed to dispatch event', e);
    }
}

function showSuccessMessage() {
    const message = document.getElementById('successMessage');
    if (!message) return;
    message.setAttribute('role', 'status');
    message.setAttribute('aria-live', 'polite');
    message.classList.remove('hidden');
    setTimeout(() => { message.classList.add('hidden'); }, 3000);
}

function showFormError(msg) {
    let errorEl = document.getElementById('formErrorMessage');
    if (!errorEl) {
        errorEl = document.createElement('div');
        errorEl.id = 'formErrorMessage';
        errorEl.className = 'error-message';
        const formContainer = document.querySelector('.form-container');
        if (formContainer) formContainer.insertBefore(errorEl, formContainer.firstChild.nextSibling);
    }
    errorEl.textContent = msg;
    errorEl.setAttribute('role', 'alert');
}

function clearFormError() {
    const errorEl = document.getElementById('formErrorMessage');
    if (errorEl) errorEl.textContent = '';
}
