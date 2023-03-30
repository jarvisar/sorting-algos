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
  alreadySorted = false;

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
      case 'insertion':
        await this.insertionSort();
        break;
      case 'merge':
        await this.mergeSort();
        break;
      case 'quick':
        await this.parentQuickSort();
        break;
      case 'heap':
        await this.heapSort();
        break;
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
        console.log(this.stopSorting)
        if (this.stopSorting) {
          console.log(this.stopSorting)
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

  async insertionSort() {
    this.inProgress = true;
    this.stopSorting = false;
    const n = this.barHeights.length;
    const delay = 100;
    const sleep = (ms: number) => {
      return new Promise(resolve => setTimeout(resolve, ms));
    };
  
    for (let i = 1; i < n; i++) {
      if (this.stopSorting) {
        return;
      }
      let key = this.barHeights[i];
      this.setBarColor(i, 'blue');
      await sleep(delay);
  
      let j = i - 1;
  
      while (j >= 0 && this.barHeights[j] > key) {
        if (this.stopSorting) {
          return;
        }
        this.setBarColor(j, 'yellow');
        await sleep(delay);
  
        this.barHeights[j + 1] = this.barHeights[j];
        this.setBarColor(j + 1, 'red');
        j--;
  
        if (j >= 0) {
          this.setBarColor(j, 'yellow');
        }
      }
  
      this.barHeights[j + 1] = key;
      this.setBarColor(j + 1, 'blue');
      await sleep(delay);
  
      for (let k = 0; k <= i; k++) {
        this.setBarColor(k, 'green');
      }
    }
  
    this.inProgress = false;
    // Mark remaining bars as sorted
    for (let i = 0; i < n; i++) {
      this.setBarColor(i, 'green');
    }
  }

  async mergeSort() {
    this.inProgress = true;
    this.stopSorting = false;
    const n = this.barHeights.length;
    const delay = 100;
    const sleep = (ms: number) => {
      return new Promise(resolve => setTimeout(resolve, ms));
    };

    // set all bars to red
    for (let i = 0; i < n; i++) {
      this.setBarColor(i, 'red');
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
        this.setBarColor(j, 'yellow');
        await sleep(delay);
  
        if (this.barHeights[i] <= this.barHeights[j]) {
          temp.push(this.barHeights[i]);
          this.setBarColor(i, 'red');
          i++;
        } else {
          temp.push(this.barHeights[j]);
          this.setBarColor(j, 'red');
          j++;
        }
      }
  
      while (i <= mid) {
        if (this.stopSorting) {
          return;
        }
        temp.push(this.barHeights[i]);
        this.setBarColor(i, 'red');
        i++;
      }
  
      while (j <= right) {
        if (this.stopSorting) {
          return;
        }
        temp.push(this.barHeights[j]);
        this.setBarColor(j, 'red');
        j++;
      }
  
      for (let k = left; k <= right; k++) {
        if (this.stopSorting) {
          return;
        }
        this.barHeights[k] = temp[k - left];
        this.setBarColor(k, 'green');
        await sleep(delay);
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
        this.setBarColor(i, 'green');
      }
    }
  }

  async parentQuickSort(){
    this.inProgress = true;
    this.stopSorting = false;
    // set all to red
    for (let i = 0; i < this.barHeights.length; i++) {
      this.setBarColor(i, 'red');
    }
    await this.quickSort(0, this.barHeights.length - 1);
    this.inProgress = false;
    if (!this.stopSorting) {
      for (let i = 0; i < this.barHeights.length; i++) {
        this.setBarColor(i, 'green');
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
        this.setBarColor(j, 'yellow');
        await sleep(100);
        if (this.barHeights[j] < pivot) {
          i++;
          this.setBarColor(i, 'red');
          [this.barHeights[i], this.barHeights[j]] = [this.barHeights[j], this.barHeights[i]];
          this.setBarColor(i, 'green');
        }
        this.setBarColor(j, 'red');
      }
      [this.barHeights[i + 1], this.barHeights[high]] = [this.barHeights[high], this.barHeights[i + 1]];
      this.setBarColor(high, 'red');
      this.setBarColor(i + 1, 'green');
      return i + 1;
    };
    if (left < right && !this.stopSorting) {
      let pivotIndex = await partition(left, right);
      if (pivotIndex !== undefined) {
        await this.quickSort(left, pivotIndex - 1);
        await this.quickSort(pivotIndex + 1, right);
      }
    } else {
      for (let i = left; i <= right; i++) {
        this.setBarColor(i, 'green');
      }
    }
  }

  async heapSort() {
    this.inProgress = true;
    this.stopSorting = false;
    const n = this.barHeights.length;
    const delay = 100;
    const sleep = (ms: number) => {
      return new Promise(resolve => setTimeout(resolve, ms));
    };
  
    const parent = (i: number) => Math.floor((i - 1) / 2);
    const left = (i: number) => 2 * i + 1;
    const right = (i: number) => 2 * i + 2;
  
    const heapify = async (size: number, i: number) => {
      let largest = i;
      const l = left(i);
      const r = right(i);
  
      this.setBarColor(i, 'blue');
  
      if (l < size) {
        this.setBarColor(l, 'yellow');
        await sleep(delay);
        if (this.barHeights[l] > this.barHeights[largest]) {
          largest = l;
        }
        this.setBarColor(l, 'red');
      }
  
      if (r < size) {
        this.setBarColor(r, 'yellow');
        await sleep(delay);
        if (this.barHeights[r] > this.barHeights[largest]) {
          largest = r;
        }
        this.setBarColor(r, 'red');
      }
  
      if (largest !== i) {
        // Swap the bars
        let temp = this.barHeights[i];
        this.barHeights[i] = this.barHeights[largest];
        this.barHeights[largest] = temp;
  
        this.setBarColor(largest, 'red');
        await heapify(size, largest);
      }
  
      this.setBarColor(i, 'red');
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
      // Swap the bars
      let temp = this.barHeights[0];
      this.barHeights[0] = this.barHeights[i];
      this.barHeights[i] = temp;
  
      this.setBarColor(i, 'green');
      await heapify(i, 0);
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
    this.stopSorting = true;

  }

  reset(){
    this.inProgress = false;
    this.stopSorting = false;
    this.alreadySorted = false;
    // reset all colors
    for (let i = 0; i < this.barHeights.length; i++) {
      this.setBarColor(i, '');
    }
    this.barHeights = [];
    for (let i = 0; i < 20; i++) {
      this.barHeights.push(Math.floor(Math.random() * 91) + 10);
    }
  }
  
  // reset on algo-select change
  onAlgoSelectChange() {
    if (this.alreadySorted) {
      this.reset();
    }
  }
}

