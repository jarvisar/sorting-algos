import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sorting-visualizer',
  templateUrl: './sorting-visualizer.component.html',
  styleUrls: ['./sorting-visualizer.component.scss']
})
export class SortingVisualizerComponent implements OnInit {
  barHeights: number[] = [];

  ngOnInit() {
    // Generate an array of 100 random heights between 10 and 100
    for (let i = 0; i < 100; i++) {
      this.barHeights.push(Math.floor(Math.random() * 91) + 10);
    }
  }

  stopSorting = false;
  async sort() {
    let n = this.barHeights.length;
    let swapped = true; // Set to true to enter the loop
    const delay = 10; // delay in milliseconds between iterations
  
    const sleep = (ms: number) => {
      return new Promise(resolve => setTimeout(resolve, ms));
    };
  
    while (swapped) {
      swapped = false;
      for (let i = 0; i < n - 1; i++) {
        // Check if sorting should be stopped
        if (this.stopSorting) {
          return;
        }
        // Set the color of the bars being compared to red
        this.setBarColor(i, 'red');
        this.setBarColor(i + 1, 'red');
  
        await sleep(delay);
  
        // Swap the bars if they're out of order
        if (this.barHeights[i] > this.barHeights[i + 1]) {
          let temp = this.barHeights[i];
          this.barHeights[i] = this.barHeights[i + 1];
          this.barHeights[i + 1] = temp;
          swapped = true;
        }
  
        // Set the color of the bars being compared back to their default color
        this.setBarColor(i, '');
        this.setBarColor(i + 1, '');
      }
      n--;
    }
  
    // Mark all bars as sorted
    for (let i = 0; i < this.barHeights.length; i++) {
      this.setBarColor(i, 'green');
    }
  }
  
  

  setBarColor(index: number, color: string) {
    let bar = document.querySelectorAll('.bar')[index] as HTMLElement;
    bar.style.backgroundColor = color;
  }

  stop() {
    // Set all bar colors to green to indicate sorting is stopped
    for (let i = 0; i < this.barHeights.length; i++) {
      this.setBarColor(i, 'green');
    }
  }
  
  
}

