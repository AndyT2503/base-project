import { ComponentStore } from '@ngrx/component-store';
import { filter } from 'rxjs';
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '../const';
import { PagingModel } from '../data-access/api/models';
import { ComponentStoreWithSelectors, getSelectors } from '../utils';

export interface TableState<T> extends PagingModel<T> {
  sortName?: string;
  ascend?: boolean;
  isLoading?: boolean;
}

export const initialTableState: TableState<any> = {
  items: [],
  pageIndex: DEFAULT_PAGE_INDEX,
  pageSize: DEFAULT_PAGE_SIZE,
  totalCount: 0,
};

type UnpackState<TState> = TState extends TableState<infer U> ? U : {};

export class TableStore<
  TState extends TableState<any>
> extends ComponentStoreWithSelectors<TState> {
  readonly updateVm = this.updater((state, vm: PagingModel<UnpackState<TState>>) => ({
    ...state,
    items: vm.items,
    pageIndex: vm.pageIndex,
    pageSize: vm.pageSize,
    totalCount: vm.totalCount,
  }));

  readonly updatePageIndex = this.updater((state, pageIndex: number) => ({
    ...state,
    pageIndex,
  }));

  readonly updatePageSize = this.updater((state, pageSize: number) => ({
    ...state,
    pageSize,
  }));

  readonly updateLoading = this.updater((state, isLoading: boolean) => ({
    ...state,
    isLoading
  }));

  readonly updateSort = this.updater((state, sort: {sortName: string, ascend: boolean}) => ({
    ...state,
    sortName: sort.sortName,
    ascend: sort.ascend
  }));

  resetTable() {
    this.updatePageIndex(0);
    this.updatePageIndex(DEFAULT_PAGE_INDEX);
  }

  readonly items$ = this.select<UnpackState<TState>[]>((state) => state.items);
  readonly totalCount$ = this.select((state) => state.totalCount);
  readonly pageIndex$ = this.select((state) => state.pageIndex).pipe(filter(x => x >= DEFAULT_PAGE_INDEX));
  readonly pageSize$ = this.select((state) => state.pageSize);
  readonly isLoading$ = this.select((state) => state.isLoading);

  readonly vm$ = this.select(
    this.items$,
    this.totalCount$,
    this.pageIndex$,
    this.pageSize$,
    this.isLoading$,
    (items, totalCount, pageIndex, pageSize, isLoading) => ({
      items,
      totalCount,
      pageIndex,
      pageSize,
      isLoading
    }),
    { debounce: true }
  );
}
