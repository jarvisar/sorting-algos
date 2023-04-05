import { Component } from '@angular/core';
import { SortService } from './sort.service';
import { ViewChild } from '@angular/core';
import { InputBarComponent } from './input-bar/input-bar.component';
import { trigger, transition, style, animate, state } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('modalState', [
      state('true', style({
        opacity: '1'
      })),
      state('false', style({
        opacity: '0'
      })),
      transition('* => *', animate('200ms ease'))
    ])
  ]
})
export class AppComponent {
  title = 'sorting-algos';
  isShown = false;

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

  toggleMute() {
    this.sortService.isMuted = !this.sortService.isMuted;
  }
  
  openHelp(){
    window.open('https://www.geeksforgeeks.org/sorting-algorithms/');
  }

  openVolume(){
    this.isShown = true;
  }

  closeVolume(){
    this.isShown = false;
  }
  
}
