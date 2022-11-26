import {Injectable} from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {environment} from "../../environments/environment";

import {
  ContentsManager,
  Kernel,
  KernelAPI,
  KernelManager,
  ServerConnection,
  SessionManager
} from '@jupyterlab/services';
import {ISessionConnection, ISessionOptions} from "@jupyterlab/services/lib/session/session";
import KernelManagerIOptions = KernelManager.IOptions;
import SessionManagerIOptions = SessionManager.IOptions;
import {throwError} from "rxjs";

'use strict';
const services = require('@jupyterlab/services');

@Injectable({
  providedIn: 'root'
})
export class NotebookServerService {
  baseUrl = environment.juypterHubBaseUrl;
  wsUrl = environment.wsUrl;
  token = environment.authToken

  constructor(private logger: NGXLogger) {
  }

  startNewKernel() {
    let options: Kernel.IModel = {
      id: "111",
      name: "python"
    };
    let settings: any = {
      //baseUrl: 'http://localhost:8000/user/rcooray',
      //wsUrl: 'ws://localhost:8000/user/rcooray',
      baseUrl: 'http://localhost:8000',
      wsUrl: 'ws://localhost:8000',
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

  executeNotebook(notebookUrl: string, param1: string, param2: string) {
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
      baseUrl: `${environment.juypterHubBaseUrl}/user/${environment.userId}`,
      wsUrl: `${environment.wsUrl}/user/${environment.userId}`,
      token: this.token,
      appendToken: true
    }
    let serverSettings: ServerConnection.ISettings = ServerConnection.makeSettings(serverConnectionSettings);
    let sessionManager: any;
    let codeReadFromNotebook: any;
    let sess: any;

    try {
      this.logger.info(`*** Starting session; notebook: ${notebookUrl},
      param1: ${param1}, param2: ${param2} ${this.token} ...`);
      let kernelManagerOptions: KernelManagerIOptions = {};
      kernelManagerOptions.serverSettings = serverSettings;
      const kernelManager = new services.KernelManager(kernelManagerOptions);
      let sessionMgrOptions: SessionManagerIOptions = {kernelManager};
      sessionMgrOptions.serverSettings = serverSettings;
      sessionManager = new services.SessionManager(sessionMgrOptions);
    } catch (error) {
      throw new Error("Couldn't create session")
    }

    // Read contents of the Notebook to get the code section
    let contentManagerOptions: ContentsManager.IOptions = {};
    contentManagerOptions.serverSettings = serverSettings;
    let contents = new ContentsManager(contentManagerOptions);
    let notebookContentJson: any
    contents.get(notebookUrl).then(model => {
      notebookContentJson = model.content;
      console.log(notebookContentJson)
      this.logger.info(`*** Read contents ...`)
      //this.logger.info( `*** ${notebookContentJson.cells[0].source}`)
      codeReadFromNotebook = notebookContentJson.cells[1].source
      notebookContentJson.cells[0].metadata = {"param1": param1}
    }).catch(error => {
      throwError(() => new Error(`Couldn't read contents`));
    });

    // Execute the code section of the Notebook
    sessionManager
      .startNew(sessionOptions)
      .then((session: ISessionConnection) => {
        return session;
      })
      .then((session: ISessionConnection) => {
        console.log(`*** Kernel: ${session.kernel?.name}`)
        let future: any;
        let meta = {para1: "Number one"}
        let ARG1 = `SOME VALUE1-${param1}`
        let ARG2 = `SOME VALUE2-${param2}`
        let args = [
          "\n",
          `%env ARG1=${ARG1}`,
          `%env ARG2=${ARG2}`,
          "\n"
        ]
        const codeToExecute = args.concat(codeReadFromNotebook).join("\n")
        console.log("Code: " + codeToExecute)
        let content = {
          allow_stdin: false,
          code: codeToExecute,
          silent: false,
          stop_on_error: true,
          store_history: true,
          user_expressions: {},
          metadata: meta
        }
        future = session.kernel?.requestExecute(content, false, meta);
        future.onReply = function (reply: any) {
          console.log('Got execute reply: ' + JSON.stringify(reply));
          console.log(`*** message ${JSON.stringify(future.msg)}`)
        }
        sess = session
        return future.done
      })
      .then(() => {
        console.log('*** Shutting down session ...');
        return sess.shutdown();
      })
      .then(() => {
      })
      .catch((err: any) => {
        console.error(err);
        throw err;
      })
  }

}
