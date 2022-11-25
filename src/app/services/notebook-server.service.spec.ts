import { TestBed } from '@angular/core/testing';

import { NotebookServerService } from './notebook-server.service';

describe('JupyterKernelGatewayService', () => {
  let service: NotebookServerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotebookServerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
