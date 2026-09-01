//PaginationControls.jsx - Table Pagination Navigation Component

/* PaginationControls Component */
const PaginationControls = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  
  /* Single Page Condition Check */
  if (totalPages <= 1) {
    return null;
  }

  /* Previous Page Navigation Handler */
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  /* Next Page Navigation Handler */
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="card-footer">
      <nav>
        {/* Bootstrap Pagination with Accessibility Features */}
        <ul className="pagination pagination-sm justify-content-center mb-0">
          
          {/* Previous Page Navigation Button */}
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button 
              className="page-link"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              aria-label="Navigate to previous page"
            >
              Previous
            </button>
          </li>
          
          {/* Dynamic Page Number Generation */}
          {[...Array(totalPages)].map((_, i) => (
            <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
              <button 
                className="page-link"
                onClick={() => onPageChange(i + 1)}
                aria-label={`Navigate to page ${i + 1}`}
                aria-current={currentPage === i + 1 ? 'page' : undefined}
              >
                {i + 1}
              </button>
            </li>
          ))}
          
          {/* Next Page Navigation Button */}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button 
              className="page-link"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              aria-label="Navigate to next page"
            >
              Next
            </button>
          </li>
          
        </ul>
      </nav>
    </div>
  );
};

export default PaginationControls;