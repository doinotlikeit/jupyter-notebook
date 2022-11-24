import {Injectable} from '@angular/core';
import {NGXLogger} from "ngx-logger";

import {
  Kernel, KernelManager, KernelAPI,
  ServerConnection, SessionManager, ContentsManager
} from '@jupyterlab/services';
import {ISessionConnection, ISessionOptions}
  from "@jupyterlab/services/lib/session/session";
import KernelManagerIOptions = KernelManager.IOptions;
import SessionManagerIOptions = SessionManager.IOptions;

'use strict';
const services = require('@jupyterlab/services');

@Injectable({
  providedIn: 'root'
})
export class JupyterKernelGatewayService {
  baseUrl = "http://localhost:8000";
  wsUrl = 'ws://localhost:8000';
  token = '948e75e9f62e2a3be544562b33c762c3e727d56b446d21c79277bda3fb5d2901';

  constructor(private logger: NGXLogger) {
  }

  startNewKernel() {
    let options: Kernel.IModel = {
      id: "111",
      name: "python"
    };
    let settings: any = {
      baseUrl: this.baseUrl,
      wsUrl: this.wsUrl,
      token: this.token,
      appendToken: true
    }
    let foosettings: ServerConnection.ISettings = ServerConnection.makeSettings(settings);
    this.logger.info(`*** Settings: ${JSON.stringify(foosettings)}`)
    KernelAPI.listRunning(foosettings).then((runningKernelsArr: Kernel.IModel[]) => {
      this.logger.info(`*** List of running Kernels: ${runningKernelsArr.length}`)
    });

    KernelAPI.startNew(options, foosettings).then((kernel: Kernel.IModel) => {
      this.logger.info(`*** Started Kernel: ${kernel.name}, ${kernel.id}, ${kernel.reason}, ${kernel.execution_state}`)
    });
  }

  startNewSession(){
    // Start a new session.
    let sessionOptions: ISessionOptions = {
      name: "",
      type: 'notebook',
      path: '',
      kernel: {
        name: 'python'
      }
    };
    let serverConnectionSettings: any = {
      baseUrl: this.baseUrl,
      wsUrl: this.wsUrl,
      token: this.token,
      appendToken: true
    }
    let serverSettings: ServerConnection.ISettings = ServerConnection.makeSettings(serverConnectionSettings);

    this.logger.info('*** Starting session ...');
    let kernelManagerOptions: KernelManagerIOptions = {};
    kernelManagerOptions.serverSettings = serverSettings;
    const kernelManager = new services.KernelManager(kernelManagerOptions);
    let sessionMgrOptions: SessionManagerIOptions = { kernelManager};
    sessionMgrOptions.serverSettings = serverSettings;
    const sessionManager = new services.SessionManager(sessionMgrOptions);
    let sess: any;
    let codeReadFromNotebook: string;

    // Read contents of the Notebook to get the code section
    let contentManagerOptions: ContentsManager.IOptions= {};
    contentManagerOptions.serverSettings = serverSettings;
    let contents = new ContentsManager(contentManagerOptions);
    let notebookContentJson: any
    contents.get('foo.ipynb').then(model => {
      notebookContentJson = model.content;
      console.log( notebookContentJson )
      this.logger.info(`*** Read contents ...`)
      //this.logger.info( `*** ${notebookContentJson.cells[0].source}`)
      codeReadFromNotebook = notebookContentJson.cells[1].source
      notebookContentJson.cells[0].metadata = { "param1" : 9999}
    });

    // Execute the code section of the Notebook
    sessionManager
      .startNew(sessionOptions)
      .then((session: ISessionConnection) => {
        return session;
      })
      .then( (session: ISessionConnection) => {
        console.log(`*** Kernel: ${session.kernel?.name}`)
        let future: any;
        let meta  = { para1 : "Number one"}
        let ARG1 = `SOME VALUE1-${new Date().toISOString()}`
        let ARG2 = `SOME VALUE2-${new Date().toISOString()}`
        let args = [
          "\n",
          `%env ARG1=${ARG1}`,
          `%env ARG2=${ARG2}`,
          "\n"
        ]
        const codeToExecute = args.concat(codeReadFromNotebook).join("\n")
        console.log( "Code: " + codeToExecute)
        let content = { allow_stdin: false,
          code: codeToExecute,
          silent: false,
          stop_on_error: true,
          store_history: true,
          user_expressions: {},
          metadata: meta
        }
        future = session.kernel?.requestExecute(content, false, meta);
         future.onReply = function (reply: any) {
           console.log('Got execute reply: ' +  JSON.stringify(reply));
           console.log(`*** message ${JSON.stringify(future.msg)}`)
         }
         sess = session
        return future.done
      })
      .then( () =>{
        console.log('*** Shutting down session ...');
        return sess.shutdown();
      })
      .then(() => {
        // console.log('Session shut down');
        // contents.get('foo.ipynb').then(model => {
        //   notebookContentJson = model.content;
        //   this.logger.info(`*** Read contents for results ...`)
        //   this.logger.info( `*** ${notebookContentJson.cells[0].source}`)
        //   let output = notebookContentJson.cells[0].outputs[0]
        //   console.log(`*** Output: ${output.text}`)
        //});
      })
      .catch((err: any) => {
        console.error(err);
      })
  }

}
