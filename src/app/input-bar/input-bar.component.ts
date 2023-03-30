import { Component, OnInit } from '@angular/core';
import { SortService } from '../sort.service';

@Component({
  selector: 'app-input-bar',
  templateUrl: './input-bar.component.html',
  styleUrls: ['./input-bar.component.scss']
})
export class InputBarComponent implements OnInit {

  constructor(public sortService: SortService) { }

  ngOnInit(): void {
  }

  async sort() {
    if (this.sortService.inProgress) {
      return;
    }
    switch (this.sortService.selectedAlgo) {
      case 'bubble':
        await this.sortService.bubbleSort();
        break;
      case 'selection':
        await this.sortService.selectionSort();
        break;
      case 'insertion':
        await this.sortService.insertionSort();
        break;
      case 'merge':
        await this.sortService.mergeSort();
        break;
      case 'quick':
        await this.sortService.parentQuickSort();
        break;
      case 'heap':
        await this.sortService.heapSort();
        break;
  }
}

  stop(){
    // stop sorting
    this.sortService.stopSorting = true;
    this.sortService.inProgress = false;
    // reset colors AFTER async functions finish
    setTimeout(() => {
      for (let i = 0; i < this.sortService.barHeights.length; i++) {
        this.sortService.setBarColor(i, '');
      }
    }, this.sortService.delay * 2);
  }

  reset(){
    this.sortService.inProgress = false;
    this.sortService.stopSorting = false;
    this.sortService.alreadySorted = false;
    // reset all colors
    this.sortService.generateBars();
    setTimeout(() => {
      for (let i = 0; i < this.sortService.barHeights.length; i++) {
        this.sortService.setBarColor(i, '');
      };
    }, this.sortService.delay);
  }
  
  // reset on algo-select change
  onAlgoSelectChange() {
    if (this.sortService.alreadySorted) {
      this.reset();
    }
  }

}
