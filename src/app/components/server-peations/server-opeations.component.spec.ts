import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerOperationsComponent } from './server-operations.component';

describe('NotebookWorkflowComponent', () => {
  let component: ServerOperationsComponent;
  let fixture: ComponentFixture<ServerOperationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServerOperationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServerOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
