import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sorting-visualizer',
  templateUrl: './sorting-visualizer.component.html',
  styleUrls: ['./sorting-visualizer.component.scss']
})
export class SortingVisualizerComponent implements OnInit {
  barHeights: number[] = [];
  inProgress = false;

  ngOnInit() {
    // Generate an array of 100 random heights between 10 and 100
    for (let i = 0; i < 20; i++) {
      this.barHeights.push(Math.floor(Math.random() * 91) + 10);
    }
  }

  stopSorting = false;
  async sort() {
    this.inProgress = true;
    this.stopSorting = false;
    let n = this.barHeights.length;
    let swapped = true;
    const delay = 100;
    const sleep = (ms: number) => {
      return new Promise(resolve => setTimeout(resolve, ms));
    };
  
    // Set all unsorted bars to red
    const setUnsortedToRed = () => {
      for (let i = 0; i < n; i++) {
        this.setBarColor(i, 'red');
      }
    };
  
    while (swapped) {
      swapped = false;
      setUnsortedToRed(); // Set all unsorted bars to red at the beginning of each loop iteration
      for (let i = 0; i < n - 1; i++) {
        if (this.stopSorting) {
          return;
        }
        // if not very first bar
        // Set the color of the bars being compared to blue
        this.setBarColor(i + 1, 'blue');
        await sleep(delay);
        if (i !== 0) {
          this.setBarColor(i-1, 'red');
          }
        // Swap the bars if they're out of order
        if (this.barHeights[i] > this.barHeights[i + 1]) {
          let temp = this.barHeights[i];
          this.barHeights[i] = this.barHeights[i + 1];
          this.barHeights[i + 1] = temp;
          swapped = true;
          this.setBarColor(i, 'yellow');
        }
        this.setBarColor(i + 1, 'red');
      }
      // Set the bar in its final position to green if not very first iteration
      if (n !== this.barHeights.length) {
      this.setBarColor(n, 'green');
      }
      n--;
    }
    this.inProgress = false;
    // Mark all bars as sorted
    for (let i = 0; i < this.barHeights.length; i++) {
      this.setBarColor(i, 'green');
    }
  }
  
  

  setBarColor(index: number, color: string) {
    let bar = document.querySelectorAll('.bar')[index] as HTMLElement;
    bar.style.backgroundColor = color;
  }

  stop(){
    this.inProgress = false;
    this.stopSorting = !this.stopSorting;

  }

  reset(){
    // reset all colors
    for (let i = 0; i < this.barHeights.length; i++) {
      this.setBarColor(i, '');
    }
    this.barHeights = [];
    for (let i = 0; i < 20; i++) {
      this.barHeights.push(Math.floor(Math.random() * 91) + 10);
    }
  }
  
  
}

