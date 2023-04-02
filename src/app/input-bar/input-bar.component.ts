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
    this.sortService.numChanges = 0;
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
      case 'radix':
        await this.sortService.radixSort();
        break;
      case 'bitonic':
        await this.sortService.bitonicSort();
        break;
      case 'cocktail':
        await this.sortService.cocktailShakerSort();
        break;
      case 'comb':
        await this.sortService.combSort();
        break;
      case 'gnome':
        await this.sortService.gnomeSort();
        break;
      case 'shell':
        await this.sortService.shellSort();
        break;
      case 'cycle':
        await this.sortService.cycleSort();
        break;
      case 'counting':
        await this.sortService.countingSort();
        break;
      case 'pancake':
        await this.sortService.pancakeSort();
        break;
      case 'bogo':
        await this.sortService.bogoSort();
        break;
      case 'stooge':
        await this.sortService.stoogeSort();
        break;
  }
}

  stop(){
    // stop sorting
    this.sortService.stopSorting = true;
    this.sortService.inProgress = false;
    // reset colors AFTER async functions finish
    // if heap sort, reset colors after 2x delay
    if (this.sortService.selectedAlgo === 'heap') {
      setTimeout(() => {
        for (let i = 0; i < this.sortService.barHeights.length; i++) {
          this.sortService.setBarColor(i, '#7474B0');
          this.sortService.numChanges = 0;
        };
      }, this.sortService.delay + 100);
    } else {
      setTimeout(() => {
        for (let i = 0; i < this.sortService.barHeights.length; i++) {
          this.sortService.setBarColor(i, '#7474B0');
          this.sortService.numChanges = 0;
        };
      }, this.sortService.delay + 50);
    }
  }

  reset(){
    this.sortService.inProgress = false;
    this.sortService.stopSorting = false;
    this.sortService.alreadySorted = false;
    this.sortService.numChanges = 0;
    // reset all colors
    this.sortService.generateBars();
    setTimeout(() => {
      for (let i = 0; i < this.sortService.barHeights.length; i++) {
        this.sortService.setBarColor(i, '#7474B0');
      };
    }, this.sortService.delay);
  }
  
  // reset on algo-select change
  onAlgoSelectChange() {
    if (this.sortService.alreadySorted) {
      this.reset();
    }
  }

  onBarCountChange() {
    if (this.sortService.inProgress || this.sortService.numBars > 512) {
      return;
    } else {
      this.reset();
    }
  }

  onDelayChange() {
  }

}
