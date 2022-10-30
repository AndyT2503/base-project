export interface PagingModel<T> {
  items: T[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
}
