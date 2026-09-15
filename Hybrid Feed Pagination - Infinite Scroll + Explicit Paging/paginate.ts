import { History } from 'history';

interface OnChangePageArgs {
  page: number;
  limit: number;
  history: History;
  searchValue?: string;
}

// Keeps the current page (and search term, if any) reflected in the URL,
// so pagination state survives a refresh and is shareable via link.
export const Paginate = {
  onChangePage({ page, limit, history, searchValue }: OnChangePageArgs) {
    const offset = (page - 1) * limit;
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('offset', String(offset));
    if (searchValue) params.set('search', searchValue);
    history.push({ search: params.toString() });
  }
};
