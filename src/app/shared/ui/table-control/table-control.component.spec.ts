import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableControlComponent } from './table-control.component';

describe('TableControlComponent', () => {
  let component: TableControlComponent;
  let fixture: ComponentFixture<TableControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ TableControlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
