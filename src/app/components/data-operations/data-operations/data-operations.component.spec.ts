import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataOperationsComponent } from './data-operations.component';

describe('DataOperationsComponent', () => {
  let component: DataOperationsComponent;
  let fixture: ComponentFixture<DataOperationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataOperationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
