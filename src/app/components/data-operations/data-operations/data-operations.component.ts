import {Component, OnInit} from '@angular/core';
import {NGXLogger} from "ngx-logger";
import {NotebookServerService} from "../../../services/notebook-server.service";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormBuilder} from "@angular/forms";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'data-operations',
  templateUrl: './data-operations.component.html',
  styleUrls: ['./data-operations.component.css']
})
export class DataOperationsComponent implements  OnInit {
  serverResponse: string = "";
  displayWait: boolean = false;
  form: any;

  constructor(private logger: NGXLogger,
              private notebookServerService: NotebookServerService,
              private errorDialog: MatDialog,
              private snackbar: MatSnackBar,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      notebookUrl: [environment.notebookUrl],
      param1: [environment.arg1],
      param2: [environment.arg2]
    });
  }

  onTabClick(event: any) {
  }

  onProcessDataFileFormSubmit(form: any) {
    this.processDataFile(form)
  }

  processDataFile(form: any ) {
    try {
      this.notebookServerService.executeNotebook(form.notebookUrl, form.param1, form.param2)
      // this.labTabUrl = `${environment.juypterHubBaseUrl}/user/${this.verifiedUserId}/lab`
      // this.logger.info(`*** Jupyter Hub base url: ${this.hubUrl}, lab: ${this.labTabUrl}`)
    } catch (err:any ) {
     this.logger.error("*******************" + err.message)
    }
  }

}
