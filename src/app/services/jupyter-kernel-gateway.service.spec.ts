import { TestBed } from '@angular/core/testing';

import { JupyterKernelGatewayService } from './jupyter-kernel-gateway.service';

describe('JupyterKernelGatewayService', () => {
  let service: JupyterKernelGatewayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JupyterKernelGatewayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
