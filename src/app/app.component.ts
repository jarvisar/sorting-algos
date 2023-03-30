import { Component } from '@angular/core';
import { SortService } from './sort.service';
import { ViewChild } from '@angular/core';
import { InputBarComponent } from './input-bar/input-bar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'sorting-algos';

  @ViewChild(InputBarComponent, { static: false }) inputbar!: InputBarComponent;
  constructor( public sortService: SortService) {
    console.log('Application Started');
  }

  reset(event: Event){
    if (this.sortService.inProgress !== true){
      this.inputbar.reset();
    } else {
      this.inputbar.stop();
    }
  }
}
