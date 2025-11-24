// ===========================
// EXPENSE CARD REACT COMPONENT
// ===========================

function ExpenseCard({ transaction, onDelete, showDeleteButton = false }) {
    const categoryIcon = window.StorageHelper.getCategoryIcon(transaction.category);
    const categoryName = window.StorageHelper.getCategoryName(transaction.category);
    const formattedAmount = window.StorageHelper.formatCurrency(transaction.amount);
    const formattedDate = window.StorageHelper.formatDate(transaction.date);
    
    const amountClass = transaction.type === 'income' ? 'income' : 'expense';
    const cardClass = `expense-card type-${transaction.type}`;
    const amountPrefix = transaction.type === 'income' ? '+' : '-';

    return (
        <div className={cardClass}>
            <div className="expense-card-header">
                <div className="expense-card-title">
                    <span className="expense-category-icon">{categoryIcon}</span>
                    <span className="expense-description">{transaction.description}</span>
                </div>
                <div 
                    className={`expense-amount ${amountClass}`}
                    aria-label={`Amount ${amountPrefix}${formattedAmount} (${transaction.type})`}
                >
                    <span className="sr-only">{`Transaction amount ${transaction.type === 'income' ? 'received' : 'spent'}: ${amountPrefix}${formattedAmount}`}</span>
                    {amountPrefix}{formattedAmount}
                </div>
            </div>
            
            <div className="expense-card-body">
                <span className="expense-category">{categoryName}</span>
                <span className="expense-date">{formattedDate}</span>
            </div>
            
            {transaction.notes && (
                <div className="expense-card-footer">
                    <p className="expense-notes">{transaction.notes}</p>
                </div>
            )}
            
            {showDeleteButton && (
                <button 
                    className="delete-btn"
                    onClick={() => onDelete(transaction.id)}
                    aria-label={`Delete transaction '${transaction.description}' (${formattedAmount})`}
                >
                    Delete
                </button>
            )}
        </div>
    );
}

// Make it globally available
window.ExpenseCard = ExpenseCard;
