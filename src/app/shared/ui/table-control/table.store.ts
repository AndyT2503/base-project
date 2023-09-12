import { Observable, Subscription, tap } from 'rxjs';
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '../../const';
import { PagingModel } from '../../data-access/api/models';
import { ComponentStoreWithSelectors } from '../../utils';

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

type UnpackTableState<TState> = TState extends TableState<infer U> ? U : {};

export class TableStore<
  TState extends TableState<any>,
> extends ComponentStoreWithSelectors<TState> {
  loadData!: (
    observableOrValue?: void | Observable<void> | undefined,
  ) => Subscription;

  readonly updateVm = this.updater(
    (state, vm: PagingModel<UnpackTableState<TState>>) => ({
      ...state,
      items: vm.items,
      pageIndex: vm.pageIndex,
      pageSize: vm.pageSize,
      totalCount: vm.totalCount,
    }),
  );

  readonly updatePageIndex = this.effect<number>(
    tap((pageIndex) => {
      this.patchState((s) => ({
        ...s,
        pageIndex,
      }));
      this.loadData();
    }),
  );

  readonly updatePageSize = this.effect<number>(
    tap((pageSize) => {
      this.patchState((s) => ({
        ...s,
        pageSize,
        pageIndex: DEFAULT_PAGE_INDEX
      }));
      this.loadData();
    }),
  );

  readonly updateLoading = this.updater((state, isLoading: boolean) => ({
    ...state,
    isLoading,
  }));

  readonly updateSort = this.effect<{ sortName: string; ascend: boolean }>(
    tap((sort) => {
      this.patchState((state) => ({
        ...state,
        sortName: sort.sortName,
        ascend: sort.ascend,
      }));
      this.loadData();
    }),
  );

  readonly vm = this.selectSignal((s) => ({
    items: s.items,
    totalCount: s.totalCount,
    pageIndex: s.pageIndex,
    pageSize: s.pageSize,
    isLoading: s.isLoading,
  }));
}
