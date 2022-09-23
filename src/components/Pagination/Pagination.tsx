import ReactPaginate from 'react-paginate';

interface PaginationProps {
  pageCount: number;
  initialPage: number;
  onPageChange: (value: number) => void;
}

export default function Pagination(props: PaginationProps) {
  const { pageCount, initialPage, onPageChange } = props;

  return (
    <ReactPaginate
      pageCount={pageCount}
      initialPage={initialPage}
      marginPagesDisplayed={1}
      pageRangeDisplayed={3}
      onPageChange={event => onPageChange(event.selected)}
      previousLabel="‹"
      nextLabel="›"
      breakLabel="..."
      containerClassName="pagination w-100 d-flex justify-content-center flex-wrap mb-0"
      pageClassName="page-item data-table-pagination-page"
      pageLinkClassName="page-link"
      nextClassName="page-item data-table-pagination-caret"
      nextLinkClassName="page-link"
      previousClassName="page-item data-table-pagination-caret"
      previousLinkClassName="page-link"
      breakClassName="page-item"
      breakLinkClassName="page-link"
      activeClassName="active"
      activeLinkClassName="active"
      disabledClassName=""
    />
  );
}
