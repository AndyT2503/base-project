import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { Observable } from 'rxjs';

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TableConfig, ViewModel } from './table-config.model';

const nzModules = [
  NzTableModule,
  NzIconModule,
  NzButtonModule,
  NzToolTipModule,
  NzPopconfirmModule,
];

@Component({
  selector: 'app-table-control',
  standalone: true,
  imports: [CommonModule, nzModules, FormsModule],
  templateUrl: './table-control.component.html',
  styleUrls: ['./table-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableControlComponent implements OnInit {
  vm$!: Observable<ViewModel<any>>;
  @Input() tableConfig!: TableConfig<any>;

  @Output() search = new EventEmitter<{ [key: string]: any }>();

  @Output() queryParamsChange = new EventEmitter<NzTableQueryParams>();

  ngOnInit(): void {
    this.vm$ = this.tableConfig.vm$;
  }

  onQueryParamsChange(queryParams: NzTableQueryParams): void {
    this.queryParamsChange.emit(queryParams);
  }

  getColumnKey(key: string): string {
    return key.charAt(0).toUpperCase() + key.slice(1);
  }
}
