import {Injectable} from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {environment} from "../../environments/environment";

import {ContentsManager, KernelManager, ServerConnection, SessionManager} from '@jupyterlab/services';
import {ISessionConnection, ISessionOptions} from "@jupyterlab/services/lib/session/session";
import KernelManagerIOptions = KernelManager.IOptions;
import SessionManagerIOptions = SessionManager.IOptions;

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

  async executeNotebook(notebookUrl: string, param1: string, param2: string): Promise<any> {
    let serverSettings = this.creatServerSettings();
    let sessionManager: any;
    let codeReadFromNotebook: any;
    let sessionCreated: any
    let sessionOptions: ISessionOptions = {
      name: "",
      type: 'notebook',
      path: '',
      kernel: {
        name: 'python'
      }
    };

    // Create a session configuration
    try {
      this.logger.info(`*** Starting session; notebook: ${notebookUrl},
      param1: ${param1}, param2: ${param2}, token: ${this.token} ...`);
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
    let json = await this.readFileContent(notebookUrl)
    codeReadFromNotebook = json.cells[1].source

    // Create a session, execute the code section of the Notebook
    let responseMessage = ""
    return new Promise(() => {
      sessionManager.startNew(sessionOptions).then((session: ISessionConnection) => {
        return session;
      }).then((session: ISessionConnection) => {
        console.log(`*** Session Kernel: ${session.kernel?.name}`)
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
        console.log("Code to execute: " + codeToExecute.toString())
        let content = {
          allow_stdin: false,
          code: codeToExecute,
          silent: false,
          stop_on_error: true,
          store_history: true,
          user_expressions: {},
          metadata: meta
        }
        // Blocked call
        future = session.kernel?.requestExecute(content, false, meta);
        future.onReply = function (reply: any) {
          console.log('*** Got execute reply: ' + JSON.stringify(reply));
          responseMessage = JSON.stringify(future.msg)
          console.log(`*** Got execute response message ${responseMessage}`)
        }
        sessionCreated = session
        return future.done
      }).then(() => {
        console.log('*** Shutting down session ...');
        sessionCreated.shutdown();
        return responseMessage
      }).catch((err: any) => {
        throw new Error(`Couldn't execute Notebook; error: ${err.error.message}`)
      })
    })
  }

  async readFileContent(fileUrl: string) {
    // Read contents of the given file
    let contentManagerOptions: ContentsManager.IOptions = {};
    contentManagerOptions.serverSettings = this.creatServerSettings();
    let contentsManager = new ContentsManager(contentManagerOptions);
    return contentsManager.get(fileUrl).then(model => {
      this.logger.info(`*** Read contents of file: ${fileUrl} ...`)
      return model.content
    }).catch(error => {
      throw new Error(`Couldn't read contents of file: ${fileUrl};
       error: ${error.error.message}; error code: ${error.errorCode}`);
    })
  }

  private creatServerSettings() {
    let serverConnectionSettings: any = {
      baseUrl: `${environment.juypterHubBaseUrl}/user/${environment.userId}`,
      wsUrl: `${environment.wsUrl}/user/${environment.userId}`,
      token: this.token,
      appendToken: true
    }
    let serverSettings: ServerConnection.ISettings = ServerConnection.makeSettings(serverConnectionSettings);
    return serverSettings;
  }
}
