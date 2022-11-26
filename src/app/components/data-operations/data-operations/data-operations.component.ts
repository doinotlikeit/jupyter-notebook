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
export class DataOperationsComponent implements OnInit {
  fileProcessResponse: string = "";
  fileViewResponse: string = "";
  displayWait: boolean = false;
  processFileInputForm: any;
  viewResultFileInputForm: any;
  outputFileUrl: any

  constructor(private logger: NGXLogger,
              private notebookServerService: NotebookServerService,
              private errorDialog: MatDialog,
              private snackbar: MatSnackBar,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.processFileInputForm = this.formBuilder.group({
      notebookUrl: [environment.notebookUrl],
      param1: [environment.arg1],
      param2: [environment.arg2]
    });
    this.viewResultFileInputForm = this.formBuilder.group( {
      outputFileUrl: [environment.outputFileUrl]
    })
  }

  onTabClick(event: any) {
  }

  async processDataFile(form: any) {
    try {

      console.log("****************** before")
      this.fileProcessResponse = await this.notebookServerService.executeNotebook(
        form.notebookUrl, form.param1, form.param2)
      console.log("*** Process data file response: " + this.fileProcessResponse)
      console.log("******************* after ")

    } catch (err: any) {
      this.logger.error(`*** Error processing data file: ${form.notebookUrl};
      error: ${err.message}`)
    }
  }

  async readDataFile(form: any) {
    try {

      this.outputFileUrl = form.outputFileUrl
      this.fileViewResponse = await this.notebookServerService.readFileContent(form.outputFileUrl)
      console.log("*** Read data file response: " + this.fileViewResponse)

    } catch (err: any) {
      this.logger.error(`*** Error reading result file: ${form.outputFileUrl};
      error: ${err.message}`)
    }
  }

}
