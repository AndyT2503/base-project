import { Signal, TemplateRef } from '@angular/core';
import { PagingModel } from '../../data-access/api/models';

export interface ViewModel<T> extends PagingModel<T> {
  isLoading?: boolean;
}

export interface TableConfig<T> {
  vm: Signal<ViewModel<T>>;
  scrollConfig?: ScrollConfig;
  commandConfig?: Array<CommandConfig<T>>;
  columnConfig: Array<TableColumnConfig<T>>;
  disabledRow?: (value: T) => boolean;
  onRowClick?: (value: T) => void;
}

export type TableColumnConfig<T> = {
  label: string;
  canSort?: true;
  filterKey?: string;
  key: keyof T & string;
  width?: string;
  align?: 'left' | 'right' | 'center';
  onCellClick?: (value: T) => void;
} & (
  | {
      format: string;
      type: 'date' | 'number' | 'percent';
    }
  | {
      type: 'text';
    }
  | {
      type: 'templateRef';
      templateRef: TemplateRef<unknown>;
    }
);

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
