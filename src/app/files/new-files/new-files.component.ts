import { faPlus, faUpload, faDownload, faLink, faFileUpload} from '@fortawesome/free-solid-svg-icons';
import { FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { UploadTUSService } from 'src/app/core/_services/files/files_tus.service';
import { fileSizeValue, validateFileExt } from '../../shared/utils/util';
import { GlobalService } from 'src/app/core/_services/main.service';
import { environment } from './../../../environments/environment';
import { PageTitle } from 'src/app/core/_decorators/autotitle';
import { UploadFileTUS } from '../../core/_models/files';
import { SERV } from '../../core/_services/main.config';

@Component({
  selector: 'app-new-files',
  templateUrl: './new-files.component.html'
})
@PageTitle(['New File'])
export class NewFilesComponent implements OnInit {
  ngOnInit() {
    return;
  }
}
