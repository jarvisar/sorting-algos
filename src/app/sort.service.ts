import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SortService {
  barHeights: number[] = [];
  inProgress = false;
  selectedAlgo = 'bubble';
  alreadySorted = false;
  numBars = 25;
  delay = 200;

  constructor() { }

  generateBars(){
    this.barHeights = [];
    // calculate number of bars I can fit on screen
    const barWidth = 40;
    const barMargin = 10;
    const screenWidth = window.innerWidth;
    const numBars = Math.floor((screenWidth - 100) / (barWidth + barMargin));

    // Generate an array of 100 random heights between 10 and 100
    for (let i = 0; i < numBars; i++) {
      // prevent duplicate numbers
      let randomHeight = Math.floor(Math.random() * 90) + 10;
      while (this.barHeights.includes(randomHeight)) {
        randomHeight = Math.floor(Math.random() * 90) + 10;
      }
      this.barHeights.push(randomHeight);
    }
    // get bar-container height
    const barContainer = document.getElementById('bar-container');
    const barContainerHeight = barContainer!.clientHeight - 140;
    // calculate bar heights based on bar-container height
    const maxHeight = Math.max(...this.barHeights);
    this.barHeights = this.barHeights.map(height => {
      return Math.floor((height / maxHeight) * barContainerHeight);
    });
    this.alreadySorted = false;
    // set all to default color
    for (let i = 0; i < this.barHeights.length; i++) {
      this.setBarColor(i, '');
    }
  }

  stopSorting = false;
  
  async bubbleSort() {
    this.inProgress = true;
    this.stopSorting = false;
    let n = this.barHeights.length;
    let swapped = true;
    // this.delay should be calculation so it always finishes in 7 seconds based on numBars

    const sleep = (ms: number) => {
      return new Promise(resolve => setTimeout(resolve, ms));
    };
  
    // Set all unsorted bars to red
    const setUnsortedToRed = () => {
      for (let i = 0; i < n; i++) {
        this.setBarColor(i, '#AA3939');
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
        await sleep(this.delay);
        if (i !== 0) {
          this.setBarColor(i-1, '#AA3939');
          }
        // Swap the bars if they're out of order
        if (this.barHeights[i] > this.barHeights[i + 1]) {
          let temp = this.barHeights[i];
          this.barHeights[i] = this.barHeights[i + 1];
          this.barHeights[i + 1] = temp;
          swapped = true;
          this.setBarColor(i, '#FEDC56');
        }
        this.setBarColor(i + 1, '#AA3939');
      }
      // Set the bar in its final position to green if not very first iteration
      if (n !== this.barHeights.length) {
      this.setBarColor(n, '#32CD32');
      }
      n--;
    }
    this.inProgress = false;
    // Mark all bars as sorted
    for (let i = 0; i < this.barHeights.length; i++) {
      this.setBarColor(i, '#32CD32');
    }
  }

  async selectionSort() {
    this.inProgress = true;
    this.stopSorting = false;
    const n = this.barHeights.length;
    const sleep = (ms: number) => {
      return new Promise(resolve => setTimeout(resolve, ms));
    };
  
    // set all to red
    for (let i = 0; i < n; i++) {
      this.setBarColor(i, '#AA3939');
    }
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
        this.setBarColor(j, '#FEDC56');
        await sleep(this.delay);
  
        if (this.barHeights[j] < this.barHeights[minIndex]) {
          this.setBarColor(minIndex, '#AA3939');
          minIndex = j;
          this.setBarColor(minIndex, 'blue');
        } else {
          this.setBarColor(j, '#AA3939');
        }
      }
  
      // Swap the bars
      let temp = this.barHeights[i];
      this.barHeights[i] = this.barHeights[minIndex];
      this.barHeights[minIndex] = temp;
  
      this.setBarColor(minIndex, '#AA3939');
      // if not first one
      if (i !== 0) {
        this.setBarColor(i - 1, '#32CD32');
      }
    }
  
    this.inProgress = false;
    // Mark all as green
    for (let i = 0; i < this.barHeights.length; i++) {
      this.setBarColor(i, '#32CD32');
    }
  }

  async insertionSort() {
    this.inProgress = true;
    this.stopSorting = false;
    const n = this.barHeights.length;
    const sleep = (ms: number) => {
      return new Promise(resolve => setTimeout(resolve, ms));
    };

    // set all to red
    for (let i = 0; i < n; i++) {
      this.setBarColor(i, '#AA3939');
    }
  
    for (let i = 1; i < n; i++) {
      if (this.stopSorting) {
        return;
      }
      let key = this.barHeights[i];
      this.setBarColor(i, 'blue');
      await sleep(this.delay);
  
      let j = i - 1;
  
      while (j >= 0 && this.barHeights[j] > key) {
        if (this.stopSorting) {
          return;
        }
        for (let k = 0; k < n; k++) {
          if (k !== j && k !== i) {
            this.setBarColor(k, '#AA3939');
          }
        }
        this.setBarColor(j, '#FEDC56');
        await sleep(this.delay);
        this.barHeights[j + 1] = this.barHeights[j];
        this.setBarColor(j + 1, '#AA3939');
        j--;
        if (j >= 0) {
          this.setBarColor(j, 'blue');
        }
      }
      
      this.barHeights[j + 1] = key;
      this.setBarColor(j + 1, 'blue');
      await sleep(this.delay);
  
      for (let k = 0; k <= i; k++) {
        this.setBarColor(k, '#AA3939');
      }
    }
  
    this.inProgress = false;
    // Mark remaining bars as sorted
    for (let i = 0; i < n; i++) {
      this.setBarColor(i, '#32CD32');
    }
  }

  async mergeSort() {
    this.inProgress = true;
    this.stopSorting = false;
    const n = this.barHeights.length;
    const sleep = (ms: number) => {
      return new Promise(resolve => setTimeout(resolve, ms));
    };

    // set all bars to red
    for (let i = 0; i < n; i++) {
      this.setBarColor(i, '#AA3939');
    }
  
    const merge = async (left: number, mid: number, right: number) => {
      let i = left;
      let j = mid + 1;
      let temp = [];
  
      while (i <= mid && j <= right) {
        if (this.stopSorting) {
          return;
        }
  
        this.setBarColor(i, 'blue');
        this.setBarColor(j, '#FEDC56');
        await sleep(this.delay);
  
        if (this.barHeights[i] <= this.barHeights[j]) {
          temp.push(this.barHeights[i]);
          this.setBarColor(i, '#AA3939');
          i++;
        } else {
          temp.push(this.barHeights[j]);
          this.setBarColor(j, '#AA3939');
          // set color of i to red
          j++;
        }
      }
  
      while (i <= mid) {
        if (this.stopSorting) {
          return;
        }
        temp.push(this.barHeights[i]);
        this.setBarColor(i, '#AA3939');
        i++;
      }
  
      while (j <= right) {
        if (this.stopSorting) {
          return;
        }
        temp.push(this.barHeights[j]);
        this.setBarColor(j, '#AA3939');
        j++;
      }
  
      for (let k = left; k <= right; k++) {
        if (this.stopSorting) {
          return;
        }
        this.barHeights[k] = temp[k - left];
        this.setBarColor(k, '#AA3939');
        await sleep(this.delay);
      }

    };
  
    const mergeSortHelper = async (left: number, right: number) => {
      if (left < right) {
        if (this.stopSorting) {
          return;
        }
        let mid = Math.floor((left + right) / 2);
        await mergeSortHelper(left, mid);
        await mergeSortHelper(mid + 1, right);
        await merge(left, mid, right);
      }
    };
  
    await mergeSortHelper(0, n - 1);
  
    this.inProgress = false;
    if (!this.stopSorting) {
      for (let i = 0; i < this.barHeights.length; i++) {
        this.setBarColor(i, '#32CD32');
      }
    }
  }

  async parentQuickSort(){
    this.inProgress = true;
    this.stopSorting = false;
    // set all to red
    for (let i = 0; i < this.barHeights.length; i++) {
      this.setBarColor(i, '#AA3939');
    }
    await this.quickSort(0, this.barHeights.length - 1);
    this.inProgress = false;
    if (!this.stopSorting) {
      for (let i = 0; i < this.barHeights.length; i++) {
        this.setBarColor(i, '#32CD32');
      }
    }
  }

  async quickSort(left: number = 0, right: number = this.barHeights.length - 1) {
    const sleep = (ms: number) => {
      return new Promise(resolve => setTimeout(resolve, ms));
    };
    const partition = async (low: number, high: number) => {
      let pivot = this.barHeights[high];
      this.setBarColor(high, 'blue');
      let i = low - 1;
      for (let j = low; j <= high - 1; j++) {
        if (this.stopSorting) {
          return;
        }
        this.setBarColor(j, '#FEDC56');
        await sleep(100);
        if (this.barHeights[j] < pivot) { 
          i++; 
          this.setBarColor(i, '#AA3939'); // Reset i back to red 
          [this.barHeights[i], this.barHeights[j]] = [this.barHeights[j], this.barHeights[i]]; 
        } 
        this.setBarColor(j, '#AA3939'); // Reset j back to red
      }
      [this.barHeights[i + 1], this.barHeights[high]] = [this.barHeights[high], this.barHeights[i + 1]];
      this.setBarColor(high, '#AA3939');
      return i + 1;
    };
    if (left < right && !this.stopSorting) {
      let pivotIndex = await partition(left, right);
      if (pivotIndex !== undefined) {
        await this.quickSort(left, pivotIndex - 1);
        await this.quickSort(pivotIndex + 1, right);
      }
    }
  }

  async heapSort() {
    this.inProgress = true;
    this.stopSorting = false;
    const n = this.barHeights.length;
    const sleep = (ms: number) => {
      return new Promise(resolve => setTimeout(resolve, ms));
    };
    const parent = (i: number) => Math.floor((i - 1) / 2);
    const left = (i: number) => 2 * i + 1;
    const right = (i: number) => 2 * i + 2;
  
    // Set initial color of all bars to red
    for (let i = 0; i < n; i++) {
      this.setBarColor(i, '#AA3939');
    }
  
    const heapify = async (size: number, i: number) => {
      let largest = i;
      const l = left(i);
      const r = right(i);
  
      if (l < size) {
        this.setBarColor(l, '#FEDC56');
        await sleep(this.delay);
        if (this.barHeights[l] > this.barHeights[largest]) {
            largest = l; 
        }
        this.setBarColor(l, '#AA3939'); // Reset left child back to red 
    }
    if (r < size) {
        this.setBarColor(r, '#FEDC56');
        await sleep(this.delay);
        if (this.barHeights[r] > this.barHeights[largest]) {
            largest = r; 
        }
        this.setBarColor(r, '#AA3939');
      }
  
      if (largest !== i) {
        // Set the color of the largest bar to blue before swapping

        // blue if not in final position, else green
        this.setBarColor(largest, 'blue');
        this.setBarColor(i, '#FEDC56');
  
        // Swap the bars
        let temp = this.barHeights[i];
        this.barHeights[i] = this.barHeights[largest];
        this.barHeights[largest] = temp;
  
        // Set the color of the current index to yellow after the swap
        this.setBarColor(i, '#FEDC56');
        await heapify(size, largest);
      }
      this.setBarColor(i, '#AA3939');
    };
  
    // Build the max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      if (this.stopSorting) {
        return;
      }
      await heapify(n, i);
    }
  
    // Extract elements from the heap
    for (let i = n - 1; i > 0; i--) {
      if (this.stopSorting) {
        return;
      }

      // Set the color of the largest bar to blue before swapping
      this.setBarColor(0, 'blue');
      this.setBarColor(i, '#FEDC56');

      // Swap the bars
      let temp = this.barHeights[0];
      this.barHeights[0] = this.barHeights[i];
      this.barHeights[i] = temp;

      // Set the color of the bar at index i to green (final position)
      await heapify(i, 0);
    }
    this.inProgress = false;
  
    // Mark all as green
    for (let i = 0; i < this.barHeights.length; i++) {
      this.setBarColor(i, '#32CD32');
    }
  }

  barColors: string[] = [];
  setBarColor(index: number, color: string) {
    let bar = document.querySelectorAll('.bar')[index] as HTMLElement;
    if (bar)
    bar.style.backgroundColor = color;
    this.barColors[index] = color;
  }
}
