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
    let swapped = true;
    const delay = 500;
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
        // Set the color of the bars being compared to blue
        this.setBarColor(i + 1, 'blue');
        await sleep(delay);
        // Swap the bars if they're out of order
        if (this.barHeights[i] > this.barHeights[i + 1]) {
          let temp = this.barHeights[i];
          this.barHeights[i] = this.barHeights[i + 1];
          this.barHeights[i + 1] = temp;
          swapped = true;
          this.setBarColor(i, 'yellow');
          this.setBarColor(i + 1, 'red');
        } else {
          // Set the color of the bars being compared back to red if they are not swapped
          this.setBarColor(i, 'red');
          this.setBarColor(i + 1, 'red');
        }
      }
      // Set the bar in its final position to green
      this.setBarColor(n - 1, 'green');
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

  stop(){
    //toggle
    this.stopSorting = !this.stopSorting;

  }
  
  
}

