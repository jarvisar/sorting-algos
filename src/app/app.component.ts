import { Component, HostListener } from '@angular/core';
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
  rainbowMode = false;
  private readonly konamiCode = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
  private recentKeys: string[] = [];
  private logoTaps = 0;
  private lastLogoTap = 0;

  @ViewChild(InputBarComponent, { static: false }) inputbar!: InputBarComponent;
  constructor( public sortService: SortService) {
    console.log('Application Started');
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const target = event.target;
    if (event.repeat || event.ctrlKey || event.altKey || event.metaKey || event.isComposing ||
        (target instanceof HTMLElement && target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"]'))) {
      this.recentKeys = [];
      return;
    }

    this.recentKeys.push(event.key.toLowerCase());
    this.recentKeys = this.recentKeys.slice(-this.konamiCode.length);

    if (this.recentKeys.every((key, index) => key === this.konamiCode[index]) && event.key.startsWith('Arrow')) {
      event.preventDefault();
    }

    if (this.recentKeys.length === this.konamiCode.length &&
        this.recentKeys.every((key, index) => key === this.konamiCode[index])) {
      this.toggleRainbow();
    }
  }

  onLogoClick() {
    const now = Date.now();
    this.logoTaps = now - this.lastLogoTap <= 2000 ? this.logoTaps + 1 : 1;
    this.lastLogoTap = now;
    if (this.logoTaps === 6) {
      this.toggleRainbow();
    } else {
      this.reset();
    }
  }

  private toggleRainbow() {
    this.rainbowMode = !this.rainbowMode;
    this.recentKeys = [];
    this.logoTaps = 0;
  }

  reset(){
    if (this.sortService.inProgress !== true){
      this.inputbar.reset();
    } else {
      this.inputbar.stop();
    }
  }

  toggleMute() {
    this.sortService.toggleMute();
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
