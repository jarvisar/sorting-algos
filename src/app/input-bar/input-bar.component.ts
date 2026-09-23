import { Component } from '@angular/core';
import { ALGORITHMS, MAX_BARS, SortService } from '../sort.service';

@Component({
  selector: 'app-input-bar',
  templateUrl: './input-bar.component.html',
  styleUrls: ['./input-bar.component.scss']
})
export class InputBarComponent {
  algorithms = ALGORITHMS;
  maxBars = MAX_BARS;

  constructor(public sortService: SortService) { }

  sort() {
    this.sortService.sort();
  }

  // The running algorithm unwinds on its next step and resets the colors itself
  stop() {
    this.sortService.stopSorting = true;
  }

  reset() {
    if (this.sortService.inProgress) return;
    this.sortService.numChanges = 0;
    this.sortService.currentTime = 0;
    this.sortService.generateBars();
  }

  // Start fresh when switching algorithms after a completed sort
  onAlgoSelectChange() {
    if (this.sortService.alreadySorted) {
      this.reset();
    }
  }

  onBarCountChange() {
    this.stop();
    this.sortService.numChanges = 0;
    this.sortService.currentTime = 0;
    this.sortService.generateBars();
  }

  openGeeksForGeeks() {
    const algo = this.algorithms.find(a => a.id === this.sortService.selectedAlgo);
    window.open(algo?.url ?? 'https://www.geeksforgeeks.org/sorting-algorithms/');
  }
}
