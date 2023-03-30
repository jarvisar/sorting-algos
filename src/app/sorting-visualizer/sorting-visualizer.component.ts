import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sorting-visualizer',
  templateUrl: './sorting-visualizer.component.html',
  styleUrls: ['./sorting-visualizer.component.scss']
})
export class SortingVisualizerComponent implements OnInit {
  barHeights: number[] = [];
  inProgress = false;
  selectedAlgo = 'bubble';

  ngOnInit() {
    // Generate an array of 100 random heights between 10 and 100
    for (let i = 0; i < 20; i++) {
      this.barHeights.push(Math.floor(Math.random() * 91) + 10);
    }
  }

  stopSorting = false;
  async sort() {
    if (this.inProgress) {
      return;
    }
    switch (this.selectedAlgo) {
      case 'bubble':
        await this.bubbleSort();
        break;
      case 'selection':
        await this.selectionSort();
        break;
      // case 'insertion':
      //   await this.insertionSort();
      //   break;
      // case 'merge':
      //   await this.mergeSort();
      //   break;
      // case 'quick':
      //   await this.quickSort();
      //   break;
  }
}
  
  async bubbleSort() {
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

  async selectionSort() {
    this.inProgress = true;
    this.stopSorting = false;
    const n = this.barHeights.length;
    const delay = 100;
    const sleep = (ms: number) => {
      return new Promise(resolve => setTimeout(resolve, ms));
    };
  
    for (let i = 0; i < n - 1; i++) {
      if (this.stopSorting) {
        return;
      }
      let minIndex = i;
      this.setBarColor(i, 'blue');
  
      for (let j = i + 1; j < n; j++) {
        if (this.stopSorting) {
          return;
        }
        this.setBarColor(j, 'yellow');
        await sleep(delay);
  
        if (this.barHeights[j] < this.barHeights[minIndex]) {
          this.setBarColor(minIndex, 'red');
          minIndex = j;
          this.setBarColor(minIndex, 'blue');
        } else {
          this.setBarColor(j, 'red');
        }
      }
  
      // Swap the bars
      let temp = this.barHeights[i];
      this.barHeights[i] = this.barHeights[minIndex];
      this.barHeights[minIndex] = temp;
  
      this.setBarColor(minIndex, 'red');
      // if not first one
      if (i !== 0) {
        this.setBarColor(i - 1, 'green');
      }
    }
  
    this.inProgress = false;
    // Mark all as green
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

