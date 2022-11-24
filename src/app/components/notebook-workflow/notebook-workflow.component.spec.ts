import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotebookWorkflowComponent } from './notebook-workflow.component';

describe('NotebookWorkflowComponent', () => {
  let component: NotebookWorkflowComponent;
  let fixture: ComponentFixture<NotebookWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotebookWorkflowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotebookWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
