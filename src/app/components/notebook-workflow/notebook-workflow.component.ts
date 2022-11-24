import {Component} from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {JupyterKernelGatewayService} from "../../services/jupyter-kernel-gateway.service";

@Component({
  selector: 'app-notebook-workflow',
  templateUrl: './notebook-workflow.component.html',
  styleUrls: ['./notebook-workflow.component.css']
})
export class NotebookWorkflowComponent {

  constructor(private logger: NGXLogger,
              private gatewayService: JupyterKernelGatewayService) {
  }

  isSecondStepDone: any;
  isFirstStepDone: any;

  startNewKernel() {
    this.logger.info("*** Starting Juypter server ...")
    this.gatewayService.startNewKernel();
  }

  startNewSession() {
    this.logger.info("*** Starting new session ...")
    this.gatewayService.startNewSession();
  }
}
