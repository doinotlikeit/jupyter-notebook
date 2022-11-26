import {Component, OnInit} from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {NotebookServerService} from "../../services/notebook-server.service";
import {environment} from "../../../environments/environment";
import {HubManagementService} from "../../services/hub-management.service";
import {HubUserInfoResponse} from "../../services/hub-user-info-response";
import {MatDialog} from "@angular/material/dialog";
import {ErrorDialogComponent} from "../error-dialog/error-dialog.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
  selector: 'server-operations',
  templateUrl: './server-operations.component.html',
  styleUrls: ['./server-operations.component.css']
})
export class ServerOperationsComponent implements OnInit {
  userId = new FormControl('foo', [Validators.required]);
  hubUrl: string = "";
  userVerifiedResponse: any
  serverManagementResponse: any
  verifiedUserId: string = ""
  userVerified: boolean = false;
  displayWait: boolean = false;
  form: any;
  labUrl: SafeResourceUrl = "";
  labTabUrl: string = ""
  isServerRunning: boolean = false

  constructor(private logger: NGXLogger,
              private gatewayService: NotebookServerService,
              private hubManagementService: HubManagementService,
              private errorDialog: MatDialog,
              private snackbar: MatSnackBar,
              private formBuilder: FormBuilder,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.hubUrl = environment.juypterHubBaseUrl;
    this.form = this.formBuilder.group({
      userId: [environment.userId],
    });
  }

  onTabClick(event: any) {
    if (event.index != 0 && !this.userVerified) {
      this.displayPopupMessage("Please validate user first")
      return
    }
    this.labTabUrl = `${environment.juypterHubBaseUrl}/user/${this.verifiedUserId}/lab`
    this.labUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.labTabUrl)
    this.logger.info(`*** Jupyter Hub base url: ${this.hubUrl}, lab: ${this.labTabUrl}`)
  }

  onFormSubmit(form: any) {
    //!this.userVerified ? this.verifyUser(form.userId) : this.userVerified = true;
    this.verifyUser(form.userId)
  }

  verifyUser(userId: string) {
    this.displaySpinner(true);
    this.hubManagementService.getUserInfo(userId).subscribe({
      next: (rsp: HubUserInfoResponse) => {
        this.userVerifiedResponse = rsp;
        this.logger.info(`*** User info: ${JSON.stringify(rsp)}`)
        this.verifiedUserId = rsp.name;
        this.displayPopupMessage(`User: ${this.verifiedUserId} validated`);
        this.displaySpinner(false);
        this.userVerified = true
        rsp?.server != null ? this.isServerRunning = true : this.isServerRunning = false
      },
      error: (err: Error) => {
        this.displaySpinner(false)
        let errMsg = `Couldn't validate user: ${this.userId}`
        this.displayErrorMessageDialog(errMsg, JSON.stringify(err.message));
        this.logger.error(errMsg)
      },
    })
  }

  startServer(userId: string) {
    this.displaySpinner(true);
    this.hubManagementService.startSever(userId).subscribe({
      next: (rsp: HubUserInfoResponse) => {
        this.serverManagementResponse = rsp;
        this.logger.info(`*** Server info: ${rsp}`)
        this.displaySpinner(false);
        this.displayPopupMessage(`Created server for User: ${this.verifiedUserId}`);
        this.isServerRunning = true
      },
      error: (err: Error) => {
        this.displaySpinner(false)
        let errMsg = `Couldn't create sever for user: ${this.verifiedUserId}; error: [${err.message}]`
        this.serverManagementResponse = errMsg
        this.displayErrorMessageDialog("Error", errMsg);
        this.logger.error(errMsg)
      },
    })
  }

  stopServer(userId: string) {
    this.displaySpinner(true);
    this.hubManagementService.stopSever(userId).subscribe({
      next: (rsp: HubUserInfoResponse) => {
        this.serverManagementResponse = rsp;
        this.logger.info(`*** Server info: ${rsp}`)
        this.displaySpinner(false);
        this.isServerRunning = false
        this.displayPopupMessage(`Stopped server of User: ${this.verifiedUserId}`);
      },
      error: (err: Error) => {
        this.displaySpinner(false)
        let errMsg = `Couldn't stop server of user: ${this.verifiedUserId}; error: [${err.message}]`
        this.serverManagementResponse = errMsg
        this.displayErrorMessageDialog("Error", errMsg);
        this.logger.error(errMsg)
      },
    })
  }

  displaySpinner(status: boolean) {
    this.displayWait = status;
  }

  displayPopupMessage(message: string) {
    this.snackbar.open(message, "", {duration: 2000});
  }

  displayErrorMessageDialog(errorMessageTitle: string, errorMessageContent: any) {
    this.errorDialog.open(ErrorDialogComponent, {
      width: '600px', height: '350px',
      data: {title: errorMessageTitle, content: errorMessageContent}
    })
  }

  launchLabTab() {
    window.open(this.labTabUrl, "_blank")
  }
}

