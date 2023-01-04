import { Observable } from 'rxjs';
import { PagingModel } from '../../data-access/api/models';

export interface ViewModel<T> extends PagingModel<T> {
  isLoading?: boolean;
}

export interface TableConfig<T> {
  vm$: Observable<ViewModel<T>>;
  showCommand?: boolean;
  scrollConfig?: ScrollConfig;
  commandConfig?: Array<CommandConfig<T>>;
  columnConfig: Array<TableColumnConfig<T>>;
  disabledRow?: (value: T) => boolean;
}

export interface TableColumnConfig<T> {
  label: string;
  type: 'text' | 'date' | 'number' | 'percent';
  canSort?: true;
  filterKey?: string;
  key: keyof T & string;
  width?: string;
  align?: 'left' | 'right' | 'center';
  format?: string;
  onClick?: (value: T) => void;
}

export interface CommandConfig<T> {
  tooltip: string;
  icon: string;
  haveConfirm?: boolean;
  confirmText?: string;
  disableField?: keyof T & string;
  onClick?: (value: T) => void;
  hidden?: (value: T) => boolean;
}

interface ScrollConfig {
  x?: string;
  y?: string;
}
