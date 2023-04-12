import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-hashes',
  templateUrl: './hashes.component.html'
})
export class HashesComponent implements OnInit {
  editMode = false;
  editedIndex: number;
  edited: any // Change to Model

  isLoading = false;

  whichView: string;

  constructor(
    private route:ActivatedRoute,
  ) { }

  ngOnInit(): void {

    this.route.data.subscribe(data => {
      switch (data['kind']) {

        case 'chunks-hashes':
          this.whichView = 'chunks-hashes';
        break;

        case 'task-hashes':
          this.whichView = 'task-hashes';
        break;

        case 'hashlist-hashes':
          this.whichView = 'hashlist-hashes';
        break;

      }

    });
  }

}
