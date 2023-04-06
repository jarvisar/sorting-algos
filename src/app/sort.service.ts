import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SortService {
  barHeights: number[] = [];
  inProgress = false;
  selectedAlgo = 'bubble';
  alreadySorted = false;
  numBars = 50;
  delay = 20;
  numChanges = 0;
  currentTime: number = 0;
  audioLength = this.delay;
  isMuted = true;
  volume = 30;
  private audioContext: AudioContext = new AudioContext();

  updateTimer() {
    this.currentTime += 0.01;
  }

  constructor() {
    const barWidth = 10;
    const barMargin = 15;
    const screenWidth = window.innerWidth;
    this.numBars = Math.floor((screenWidth - 100) / (barWidth + barMargin));
    this.audioContext = new AudioContext();
  }

  playTone(frequency: number, duration: number) {
    if (this.isMuted) return;
    try {
      const oscillator = this.audioContext.createOscillator(); // Create sound source
      oscillator.type = 'triangle';
      // scale between frequencies 220 and 880 based on min and max barHeight
      const minFrequency = 200;
      const maxFrequency = 700;
      const minBarHeight = Math.min(...this.barHeights);
      const maxBarHeight = Math.max(...this.barHeights)
      const scaledFrequency = ((frequency - minBarHeight) / (maxBarHeight - minBarHeight)) * (maxFrequency - minFrequency) + minFrequency; // Scale frequency
      const gainNode = this.audioContext.createGain(); // Create gain node
      gainNode.gain.value = this.volume/100; // Set volume
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination); // Connect to speakers
      oscillator.frequency.setValueAtTime(scaledFrequency, this.audioContext.currentTime); // Value in hertz
      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + duration / 1000);
    } catch (error) {
      console.error('Failed to play tone:', error);
    }
  }

  generateBars(){
    this.barHeights = [];
    // Generate an array of random heights
    for (let i = 0; i < this.numBars; i++) {
      // prevent duplicate numbers
      let randomHeight = Math.floor(Math.random() * 90) + 10;
      while (this.barHeights.includes(randomHeight)) {
        randomHeight = Math.floor(Math.random() * this.numBars) + 10;
      }
      this.barHeights.push(randomHeight);
    }
    // get bar-container height
    const barContainer = document.getElementById('bar-container');
    const barContainerHeight = barContainer!.clientHeight - 70;
    // calculate bar heights based on bar-container height
    const maxHeight = Math.max(...this.barHeights);
    this.barHeights = this.barHeights.map(height => {
      return Math.floor((height / maxHeight) * barContainerHeight);
    });
    this.alreadySorted = false;
    // set all to default color
    for (let i = 0; i < this.barHeights.length; i++) {
      this.setBarColor(i, '#7474B0');
    }
  }

  stopSorting = false;
  
  async bubbleSort() {
    const interval = setInterval(() => {
      this.updateTimer();
    }, 10); // 10 milliseconds = 0.01 seconds
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
        this.setBarColor(i, '#c24949');
      }
    };
  
    while (swapped) {
      swapped = false;
      setUnsortedToRed(); // Set all unsorted bars to red at the beginning of each loop iteration
      for (let i = 0; i < n - 1; i++) {
        if (this.stopSorting) {
          clearInterval(interval);
          return;
        }
        // if not very first bar
        // Set the color of the bars being compared to #229ccb
        this.setBarColor(i + 1, '#229ccb');
        if (i !== 0) {
          this.playTone(this.barHeights[i - 1], this.audioLength);
        } else {
          this.playTone(this.barHeights[i], this.audioLength);
        }
        await sleep(this.delay);
        if (i !== 0) {
          this.setBarColor(i-1, '#c24949');
        }
        // Swap the bars if they're out of order
        if (this.barHeights[i] > this.barHeights[i + 1]) {
          let temp = this.barHeights[i];
          this.barHeights[i] = this.barHeights[i + 1];
          this.barHeights[i + 1] = temp;
          this.numChanges++;
          swapped = true;
          this.setBarColor(i, '#FEDC56');
        }
        this.setBarColor(i + 1, '#c24949');
      }
      n--;
    }
    clearInterval(interval);
    this.inProgress = false;
    // Mark all bars as sorted
    for (let i = 0; i < this.barHeights.length; i++) {
      if (this.stopSorting) {
        return;
      }
      this.setBarColor(i, '#73be73');
      this.playTone(this.barHeights[i], this.audioLength);
      await sleep(this.delay/2);
    }
  }

  async selectionSort() {
    const interval = setInterval(() => {
      this.updateTimer();
    }, 10); // 10 milliseconds = 0.01 seconds
    this.inProgress = true;
    this.stopSorting = false;
    const n = this.barHeights.length;
    const sleep = (ms: number) => {
      return new Promise(resolve => setTimeout(resolve, ms));
    };
  
    // set all to red
    for (let i = 0; i < n; i++) {
      this.setBarColor(i, '#c24949');
    }
    for (let i = 0; i < n - 1; i++) {
      if (this.stopSorting) {
          clearInterval(interval);        
          return;
      }
      let minIndex = i;
      this.setBarColor(i, '#229ccb');
      for (let j = i + 1; j < n; j++) {
        if (this.stopSorting) {
          clearInterval(interval)
          return;
        }
        this.setBarColor(j, '#FEDC56');
        this.playTone(this.barHeights[j], this.audioLength);
        await sleep(this.delay);
  
        if (this.barHeights[j] < this.barHeights[minIndex]) {
          this.setBarColor(minIndex, '#c24949');
          minIndex = j;
          this.setBarColor(minIndex, '#229ccb');
        } else {
          this.setBarColor(j, '#c24949');
        }
      }
  
      // Swap the bars
      let temp = this.barHeights[i];
      this.barHeights[i] = this.barHeights[minIndex];
      this.barHeights[minIndex] = temp;
      this.numChanges++;
  
      this.setBarColor(minIndex, '#c24949');
      // if not first one
      if (i !== 0) {
        this.setBarColor(i - 1, '#c24949');
      }
    }
    clearInterval(interval)
    this.inProgress = false;
    // Mark all bars as sorted
    for (let i = 0; i < this.barHeights.length; i++) {
      if (this.stopSorting) {
        return;
      }
      this.setBarColor(i, '#73be73');
      this.playTone(this.barHeights[i], this.audioLength);
      await sleep(this.delay/2);
    }
  }

  async insertionSort() {
    const interval = setInterval(() => {
      this.updateTimer();
    }, 10); // 10 milliseconds = 0.01 seconds
    this.inProgress = true;
    this.stopSorting = false;
    const n = this.barHeights.length;
    const sleep = (ms: number, index: number, color: string) => {
      return new Promise<void>(resolve => {
        setTimeout(() => {
          this.setBarColor(index, color);
          resolve();
        }, ms);
      });
    };
    
    // set all to red
    for (let i = 0; i < n; i++) {
      this.setBarColor(i, '#c24949');
    }
  
    for (let i = 1; i < n; i++) {
      if (this.stopSorting) {
        clearInterval(interval);        
        return;
      }
      let key = this.barHeights[i];
      this.setBarColor(i, '#229ccb');
      this.playTone(this.barHeights[i], this.audioLength);
      await sleep(this.delay, i, '#229ccb');
  
      let j = i - 1;
  
      while (j >= 0 && this.barHeights[j] > key) {
        if (this.stopSorting) {
          clearInterval(interval)
          return;
        }
        for (let k = 0; k < n; k++) {
          if (k !== j && k !== i) {
            this.setBarColor(k, '#c24949');
          }
        }
        this.setBarColor(j, '#FEDC56')
        this.playTone(this.barHeights[j], this.audioLength);
        this.barHeights[j + 1] = this.barHeights[j];
        this.numChanges++;
        this.setBarColor(j + 1, '#c24949');
        await sleep(this.delay, j + 1, '#c24949');
        j--;
        if (j >= 0) {
          this.setBarColor(j, '#229ccb');
        }
      }
      
      this.barHeights[j + 1] = key;
      this.numChanges++;
      await sleep(this.delay, j + 1, '#229ccb');
  
      for (let k = 0; k <= n; k++) {
        this.setBarColor(k, '#c24949');
      }
    }
    clearInterval(interval)
    this.inProgress = false;
    // Mark all bars as sorted
    for (let i = 0; i < this.barHeights.length; i++) {
      if (this.stopSorting) {
        return;
      }
      this.setBarColor(i, '#73be73');
      this.playTone(this.barHeights[i], this.audioLength);
      await sleep(this.delay/2, i, '#73be73');
    }
  }

  async mergeSort() {
    const interval = setInterval(() => {
      this.updateTimer();
    }, 10); // 10 milliseconds = 0.01 seconds
    this.inProgress = true;
    this.stopSorting = false;
    const n = this.barHeights.length;
    const sleep = (ms: number) => {
      return new Promise(resolve => 
        // I even tried to take a color as parameter and set it here using setTimeout. Also same issue. 
        setTimeout(resolve, ms)
        );
    };

    // set all bars to red
    for (let i = 0; i < n; i++) {
      this.setBarColor(i, '#c24949');
    }
  
    const merge = async (left: number, mid: number, right: number) => {
      let i = left;
      let j = mid + 1;
      let temp = [];
  
      while (i <= mid && j <= right) {
        if (this.stopSorting) {
          clearInterval(interval)
          return;
        }
  
        this.setBarColor(i, '#229ccb');
        this.setBarColor(j, '#FEDC56');
        this.playTone(this.barHeights[i], this.audioLength);
        await sleep(this.delay);
  
        if (this.barHeights[i] <= this.barHeights[j]) {
          temp.push(this.barHeights[i]);
          this.setBarColor(i, '#c24949');
          i++;
        } else {
          temp.push(this.barHeights[j]);
          this.setBarColor(j, '#c24949');
          // set color of i to red
          j++;
        }
      }
  
      while (i <= mid) {
        if (this.stopSorting) {
          clearInterval(interval)
          return;
        }
        temp.push(this.barHeights[i]);
        this.setBarColor(i, '#c24949');
        i++;
      }
  
      while (j <= right) {
        if (this.stopSorting) {
          clearInterval(interval)
          return;
        }
        temp.push(this.barHeights[j]);
        this.setBarColor(j, '#c24949');
        j++;
      }
  
      for (let k = left; k <= right; k++) {
        if (this.stopSorting) {
          clearInterval(interval)
          return;
        }
        this.barHeights[k] = temp[k - left];
        this.numChanges++;
        this.setBarColor(k, '#FEDC56');
        this.playTone(this.barHeights[k], this.audioLength);
        await sleep(this.delay);
        this.setBarColor(k, '#c24949');
      }
    };
  
    const mergeSortHelper = async (left: number, right: number) => {
      if (left < right) {
        if (this.stopSorting) {
          clearInterval(interval)
          return;
        }
        let mid = Math.floor((left + right) / 2);
        await mergeSortHelper(left, mid);
        await mergeSortHelper(mid + 1, right);
        await merge(left, mid, right);
      }
    };
  
    await mergeSortHelper(0, n - 1);
    clearInterval(interval)
    this.inProgress = false;
    if (!this.stopSorting) {
      // Mark all bars as sorted
      for (let i = 0; i < this.barHeights.length; i++) {
        if (this.stopSorting) {
          return;
        }
        this.setBarColor(i, '#73be73');
        this.playTone(this.barHeights[i], this.audioLength);
        await sleep(this.delay/2);
      }
    }
  }

  quickInterval: any;
  async parentQuickSort(){
    this.quickInterval = setInterval(() => {
      this.updateTimer();
    }, 10); // 10 milliseconds = 0.01 seconds
    const sleep = (ms: number) => {
      return new Promise(resolve => 
        // I even tried to take a color as parameter and set it here using setTimeout. Also same issue. 
        setTimeout(resolve, ms)
        );
    };
    this.inProgress = true;
    this.stopSorting = false;
    // set all to red
    for (let i = 0; i < this.barHeights.length; i++) {
      this.setBarColor(i, '#c24949');
    }
    await this.quickSort(0, this.barHeights.length - 1);
    this.inProgress = false;
    clearInterval(this.quickInterval)
    if (!this.stopSorting) {
      // Mark all bars as sorted
      for (let i = 0; i < this.barHeights.length; i++) {
        if (this.stopSorting) {
          return;
        }
        this.setBarColor(i, '#73be73');
        this.playTone(this.barHeights[i], this.audioLength);
        await sleep(this.delay/2);
      }
    }
  }

  async quickSort(left: number = 0, right: number = this.barHeights.length - 1) {
    const sleep = (ms: number) => {
      return new Promise(resolve => setTimeout(resolve, ms));
    };
    const partition = async (low: number, high: number) => {
      let pivot = this.barHeights[high];
      this.setBarColor(high, '#229ccb');
      let i = low - 1;
      for (let j = low; j <= high - 1; j++) {
        if (this.stopSorting) {
          clearInterval(this.quickInterval)
          return;
        }
        this.setBarColor(j, '#FEDC56');
        this.playTone(this.barHeights[j], this.audioLength);
        await sleep(this.delay);
        if (this.barHeights[j] < pivot) { 
          i++; 
          this.setBarColor(i, '#c24949'); // Reset i back to red 
          [this.barHeights[i], this.barHeights[j]] = [this.barHeights[j], this.barHeights[i]]; 
          this.numChanges++;
        } 
        this.setBarColor(j, '#c24949'); // Reset j back to red
      }
      [this.barHeights[i + 1], this.barHeights[high]] = [this.barHeights[high], this.barHeights[i + 1]];
      this.numChanges++;
      this.setBarColor(high, '#c24949');
      // set all to red
      for (let i = 0; i < this.barHeights.length; i++) {
        this.setBarColor(i, '#c24949');
      }
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
    const interval = setInterval(() => {
      this.updateTimer();
    }, 10); // 10 milliseconds = 0.01 seconds
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
      this.setBarColor(i, '#c24949');
    }
  
    const heapify = async (size: number, i: number) => {
      let largest = i;
      const l = left(i);
      const r = right(i);
  
    if (l < size) {
      this.setBarColor(l, '#FEDC56');
      await sleep(this.delay);
      this.playTone(this.barHeights[l], this.audioLength);
      if (this.barHeights[l] > this.barHeights[largest]) {
          largest = l; 
      }
      this.setBarColor(l, '#c24949'); // Reset left child back to red 
    }
    if (r < size) {
        this.setBarColor(r, '#FEDC56');
        this.playTone(this.barHeights[r], this.audioLength);
        await sleep(this.delay);
        if (this.barHeights[r] > this.barHeights[largest]) {
            largest = r; 
        }
        this.setBarColor(r, '#c24949');
      }
  
      if (largest !== i) {
        // Set the color of the largest bar to #229ccb before swapping

        // #229ccb if not in final position, else green
        this.setBarColor(largest, '#229ccb');
        this.setBarColor(i, '#FEDC56');
  
        // Swap the bars
        let temp = this.barHeights[i];
        this.barHeights[i] = this.barHeights[largest];
        this.barHeights[largest] = temp;
        this.numChanges++;
  
        // Set the color of the current index to yellow after the swap
        this.setBarColor(i, '#FEDC56');
        this.playTone(this.barHeights[i], this.audioLength);
        await heapify(size, largest);
      }
      this.setBarColor(i, '#c24949');
    };
  
    // Build the max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      if (this.stopSorting) {
        clearInterval(interval);        
        return;
      }
      await heapify(n, i);
    }
  
    // Extract elements from the heap
    for (let i = n - 1; i > 0; i--) {
      if (this.stopSorting) {
        clearInterval(interval);        
        return;
      }

      // Set the color of the largest bar to #229ccb before swapping
      this.setBarColor(0, '#229ccb');
      this.setBarColor(i, '#c24949');

      // Swap the bars
      let temp = this.barHeights[0];
      this.barHeights[0] = this.barHeights[i];
      this.barHeights[i] = temp;
      this.numChanges++;

      // Set the color of the bar at index i to green (final position)
      await heapify(i, 0);
    }
    this.inProgress = false;
    clearInterval(interval);  
    // Mark all bars as sorted
    for (let i = 0; i < this.barHeights.length; i++) {
      if (this.stopSorting) {
        return;
      }
      this.setBarColor(i, '#73be73');
      this.playTone(this.barHeights[i], this.audioLength);
      await sleep(this.delay/2);
    }
  }

  async radixSort() {
    const interval = setInterval(() => {
      this.updateTimer();
    }, 10); // 10 milliseconds = 0.01 seconds
    this.inProgress = true;
    this.stopSorting = false;
    
    const sleep = (ms: number) => {
      return new Promise(resolve => setTimeout(resolve, ms));
    };
    
    // Set initial color of all bars to red
    for (let i = 0; i < this.barHeights.length; i++) {
      this.setBarColor(i, '#c24949');
    }
    
    // Get the maximum number of digits in the bar heights
    const maxDigitCount = Math.max(...this.barHeights).toString().length;
    
    // Sort the bars by each digit position, starting from the least significant
    for (let digitPos = 0; digitPos < maxDigitCount; digitPos++) {
      // Declare the buckets array with a type annotation
      const buckets: number[][] = Array.from({ length: 10 }, () => []);
      for (let i = 0; i < this.barHeights.length; i++) {
        const digit = Math.floor(this.barHeights[i] / Math.pow(10, digitPos)) % 10;
        buckets[digit].push(this.barHeights[i]);
      }
      // Flatten the buckets array and update the bar heights and colors
      let index = 0;
      for (let j = 0; j < buckets.length; j++) {
        for (let k = 0; k < buckets[j].length; k++) {
          if (this.stopSorting) {
            clearInterval(interval); 
            return; 
          }

          // Set the color of the current bar being compared to blue
          if (k > 0) {
            this.setBarColor(index, '#c24949');
            this.setBarColor(index - 1, '#229ccb');
          }
          this.setBarColor(this.barHeights.indexOf(buckets[j][k]), '#c24949');

          // Update the bar height and color
          this.barHeights[index] = buckets[j][k];
          this.numChanges++;
          this.setBarColor(index, '#FEDC56');
          this.playTone(this.barHeights[index], this.audioLength);
          await sleep(this.delay);
          this.setBarColor(this.barHeights.indexOf(buckets[j][k]), '#c24949');
          this.setBarColor(index - 1, '#c24949');
          index++;
        }
      }
    }
    clearInterval(interval);  
    this.inProgress = false;
    // Mark all bars as sorted
    for (let i = 0; i < this.barHeights.length; i++) {
      if (this.stopSorting) {
        clearInterval(interval);  
        return;
      }
      this.setBarColor(i, '#73be73');
      this.playTone(this.barHeights[i], this.audioLength);
      await sleep(this.delay/2);
    }
  }

  //bitonic
  async bitonicSort() {
    const interval = setInterval(() => {
      this.updateTimer();
    }, 10); // 10 milliseconds = 0.01 seconds
    // set this.numBars to closest power of 2 if not already
    if (!Number.isInteger(Math.log2(this.numBars))) {
      this.numBars = Math.pow(2, Math.floor(Math.log2(this.numBars)));
      this.generateBars();
    }
    this.inProgress = true;
    this.stopSorting = false;

    // set all to red
    for (let i = 0; i < this.barHeights.length; i++) {
      this.setBarColor(i, '#c24949');
    }
    
    const sleep = (ms: number) => {
      return new Promise(resolve => setTimeout(resolve, ms));
    };
    
    const compare = async (i: number, j: number, dir: number) => {
      if (this.stopSorting) {
        clearInterval(interval);        
        return;
      }
      this.setBarColor(i, '#FEDC56');
      this.setBarColor(j, '#229ccb');
      this.playTone(this.barHeights[i], this.audioLength);
      await sleep(this.delay);
      if ((this.barHeights[i] > this.barHeights[j] && dir === 1) || (this.barHeights[i] < this.barHeights[j] && dir === 0)) {
        let temp = this.barHeights[i];
        this.barHeights[i] = this.barHeights[j];
        this.barHeights[j] = temp;
        this.numChanges++;
      }
      this.setBarColor(i, '#c24949');
      this.setBarColor(j, '#c24949');
    };
    
    const bitonicMerge = async (low: number, count: number, dir: number) => {
      if (this.stopSorting) {
        clearInterval(interval);        
        return;
      }
      if (count > 1) {
        let k = Math.floor(count / 2);
        for (let i = low; i < low + k; i++) {
          await compare(i, i + k, dir);
        }
        await bitonicMerge(low, k, dir);
        await bitonicMerge(low + k, k, dir);
      }
    };
    
    const bitonicSort = async (low: number, count: number, dir: number) => {
      if (this.stopSorting) {
        clearInterval(interval);        
        return;
      }
      if (count > 1) {
        let k = Math.floor(count / 2);
        await bitonicSort(low, k, 1);
        await bitonicSort(low + k, k, 0);
        await bitonicMerge(low, count, dir);
      }
    };
    
    const n = this.barHeights.length;
    await bitonicSort(0, n, 1);
    clearInterval(interval);  
    this.inProgress = false;
    
    // Mark all bars as sorted
    for (let i = 0; i < this.barHeights.length; i++) {
      if (this.stopSorting) {
        return;
      }
      this.setBarColor(i, '#73be73');
      this.playTone(this.barHeights[i], this.audioLength);
      await sleep(this.delay/2);
    }
  }
  
  // cocktail shaker sort
  async cocktailShakerSort() {
    const interval = setInterval(() => {
      this.updateTimer();
    }, 10); // 10 milliseconds = 0.01 seconds
    this.inProgress = true;
    this.stopSorting = false;

    // set all to red
    for (let i = 0; i < this.barHeights.length; i++) {
      this.setBarColor(i, '#c24949');
    }

    const sleep = (ms: number) => {
      return new Promise(resolve => setTimeout(resolve, ms));
    };

    let swapped = true;
    let start = 0;
    let end = this.barHeights.length - 1;

    while (swapped) {
      swapped = false;

      for (let i = start; i < end; i++) {
        if (this.stopSorting) {
          clearInterval(interval)
          return;
        }
        this.setBarColor(i, '#FEDC56');
        this.setBarColor(i + 1, '#229ccb');
        if (i !== 0){
          this.playTone(this.barHeights[i-1], this.audioLength);
        }
        await sleep(this.delay);
        if (this.barHeights[i] > this.barHeights[i + 1]) {
          let temp = this.barHeights[i];
          this.barHeights[i] = this.barHeights[i + 1];
          this.barHeights[i + 1] = temp;
          this.numChanges++;
          swapped = true;
        }
        // if final positon, set to green
        this.setBarColor(i + 1, '#c24949');
        this.setBarColor(i, '#c24949');
      }

      if (!swapped) {
        break;
      }

      swapped = false;
      end--;

      for (let i = end - 1; i >= start; i--) {
        if (this.stopSorting) {
          clearInterval(interval)
          return;
        }
        this.setBarColor(i, '#FEDC56');
        this.setBarColor(i + 1, '#229ccb');
        this.playTone(this.barHeights[i], this.audioLength);
        await sleep(this.delay);
        if (this.barHeights[i] > this.barHeights[i + 1]) {
          let temp = this.barHeights[i];
          this.barHeights[i] = this.barHeights[i + 1];
          this.barHeights[i + 1] = temp;
          this.numChanges++;
          // if in final position, set to green
          swapped = true;
        }
        this.setBarColor(i, '#c24949');
        this.setBarColor(i + 1, '#c24949');
      }
      
      start++;
    }
    clearInterval(interval);  
    this.inProgress = false;

    // Mark all bars as sorted
    for (let i = 0; i < this.barHeights.length; i++) {
      if (this.stopSorting) {
        return;
      }
      this.setBarColor(i, '#73be73');
      this.playTone(this.barHeights[i], this.audioLength);
      await sleep(this.delay/2);
    }
  }

  // comb sort
  async combSort() {
    const interval = setInterval(() => {
      this.updateTimer();
    }, 10); // 10 milliseconds = 0.01 seconds
    this.inProgress = true;
    this.stopSorting = false;

    // set all to red
    for (let i = 0; i < this.barHeights.length; i++) {
      this.setBarColor(i, '#c24949');
    }

    const sleep = (ms: number) => {
      return new Promise(resolve => setTimeout(resolve, ms));
    };

    let gap = this.barHeights.length;
    let shrink = 1.3;
    let sorted = false;
    
    while (!sorted) {
      gap = Math.floor(gap / shrink);
      if (gap <= 1) {
        gap = 1;
        sorted = true;
      }
      let i = 0;
      while (i + gap < this.barHeights.length) {
        if (this.stopSorting) {
          clearInterval(interval)
          return;
        }
        this.setBarColor(i, '#FEDC56');
        this.setBarColor(i + gap, '#229ccb');
        this.playTone(this.barHeights[i], this.audioLength);
        await sleep(this.delay);
        if (this.barHeights[i] > this.barHeights[i + gap]) {
          let temp = this.barHeights[i];
          this.barHeights[i] = this.barHeights[i + gap];
          this.barHeights[i + gap] = temp;
          this.numChanges++;
          sorted = false;
        }
        this.setBarColor(i + gap, '#c24949');
        this.setBarColor(i, '#c24949');
        i++;
      }
    }
    clearInterval(interval);  
    this.inProgress = false;

    // Mark all bars as sorted
    for (let i = 0; i < this.barHeights.length; i++) {
      if (this.stopSorting) {
        return;
      }
      this.setBarColor(i, '#73be73');
      this.playTone(this.barHeights[i], this.audioLength);
      await sleep(this.delay/2);
    }
  }

  // tim sort
  async timSort() {
    const interval = setInterval(() => {
      this.updateTimer();
    }, 10); // 10 milliseconds = 0.01 seconds

    this.inProgress = true;
    this.stopSorting = false;

    // set all to red
    for (let i = 0; i < this.barHeights.length; i++) {
      this.setBarColor(i, '#c24949');
    }

    const sleep = (ms: number) => {
      return new Promise(resolve => setTimeout(resolve, ms));
    };

    const insertionSort = async (left: number, right: number) => {
      for (let i = left + 1; i <= right; i++) {
        let temp = this.barHeights[i];
        let j = i - 1;
        while (j >= left && this.barHeights[j] > temp) {
          if (this.stopSorting) {
            clearInterval(interval)
            return;
          }
          for (let k = 0; k < n; k++) {
            if (k !== j && k !== i) {
              this.setBarColor(k, '#c24949');
            }
          }
          this.setBarColor(j, '#FEDC56');
          this.setBarColor(j + 1, '#229ccb');
          this.playTone(this.barHeights[j], this.audioLength);
          await sleep(this.delay);
          this.barHeights[j + 1] = this.barHeights[j];
          this.numChanges++;
          this.setBarColor(j, '#c24949');
          this.setBarColor(j + 1, '#c24949');
          j--;
        }
        this.barHeights[j + 1] = temp;
      }
    };

    const merge = async (left: number, mid: number, right: number) => {
      let i = left;
      let j = mid + 1;
      let temp = [];
  
      while (i <= mid && j <= right) {
        if (this.stopSorting) {
          clearInterval(interval)
          return;
        }
  
        this.setBarColor(i, '#229ccb');
        this.setBarColor(j, '#FEDC56');
        this.playTone(this.barHeights[i], this.audioLength);
        await sleep(this.delay);
  
        if (this.barHeights[i] <= this.barHeights[j]) {
          temp.push(this.barHeights[i]);
          this.setBarColor(i, '#c24949');
          i++;
        } else {
          temp.push(this.barHeights[j]);
          this.setBarColor(j, '#c24949');
          // set color of i to red
          j++;
        }
      }
  
      while (i <= mid) {
        if (this.stopSorting) {
          clearInterval(interval)
          return;
        }
        temp.push(this.barHeights[i]);
        this.setBarColor(i, '#c24949');
        i++;
      }
  
      while (j <= right) {
        if (this.stopSorting) {
          clearInterval(interval)
          return;
        }
        temp.push(this.barHeights[j]);
        this.setBarColor(j, '#c24949');
        j++;
      }
  
      for (let k = left; k <= right; k++) {
        if (this.stopSorting) {
          clearInterval(interval)
          return;
        }
        this.barHeights[k] = temp[k - left];
        this.numChanges++;
        this.setBarColor(k, '#FEDC56');
        this.playTone(this.barHeights[k], this.audioLength);
        await sleep(this.delay);
        this.setBarColor(k, '#c24949');
      }
    };


    let minRun = 32;
    let n = this.barHeights.length;
    for (let i = 0; i < n; i += minRun) {
      await insertionSort(i, Math.min((i + 31), (n - 1)));
      // change back to red
      for (let j = i; j < Math.min((i + 31), (n - 1)); j++) {
        this.setBarColor(j, '#c24949');
      }
    }

    for (let size = minRun; size < n; size = 2 * size) {
      for (let left = 0; left < n; left += 2 * size) {
        let mid = left + size - 1;
        let right = Math.min((left + 2 * size - 1), (n - 1));
        await merge(left, mid, right);
      }
    }

    clearInterval(interval);
    this.inProgress = false;

    // Mark all bars as sorted
    for (let i = 0; i < this.barHeights.length; i++) {
      if (this.stopSorting) {
        return;

      }
      this.setBarColor(i, '#73be73');
      this.playTone(this.barHeights[i], this.audioLength);
      await sleep(this.delay/2);
    }
  }
  

  // cycle sort
  async cycleSort() {
    const interval = setInterval(() => {
      this.updateTimer();
    }, 10); // 10 milliseconds = 0.01 seconds
    this.inProgress = true;
    this.stopSorting = false;

    // set all to red
    for (let i = 0; i < this.barHeights.length; i++) {
      this.setBarColor(i, '#c24949');
    }

    const sleep = (ms: number) => {
      return new Promise(resolve => setTimeout(resolve, ms));
    };

    let writes = 0;
    let n = this.barHeights.length;
    for (let cycleStart = 0; cycleStart <= n - 2; cycleStart++) {
      let item = this.barHeights[cycleStart];
      let pos = cycleStart;
      for (let i = cycleStart + 1; i < n; i++) {
        if (this.stopSorting) {
          clearInterval(interval)
          return;
        }
        this.setBarColor(i, '#FEDC56');
        this.setBarColor(pos, '#229ccb');
        this.playTone(this.barHeights[i], this.audioLength);
        await sleep(this.delay);
        this.setBarColor(i, '#c24949');
        this.setBarColor(pos, '#c24949');
        if (this.barHeights[i] < item) {
          pos++;
        }
      }
      if (pos === cycleStart) {
        continue;
      }
      while (item === this.barHeights[pos]) {
        pos += 1;
      }
      if (pos !== cycleStart) {
        let temp = item;
        item = this.barHeights[pos];
        this.barHeights[pos] = temp;
        this.numChanges++;
        writes++;
      }
      while (pos !== cycleStart) {
        pos = cycleStart;
        for (let i = cycleStart + 1; i < n; i++) {
          if (this.stopSorting) {
            return;
          }
          this.setBarColor(i, '#FEDC56');
          this.setBarColor(pos, '#229ccb');
          this.playTone(this.barHeights[i], this.audioLength);
          await sleep(this.delay);
          this.setBarColor(i, '#c24949');
          this.setBarColor(pos, '#c24949');
          if (this.barHeights[i] < item) {
            pos += 1;
          }
        }
        while (item === this.barHeights[pos]) {
          pos += 1;
        }
        if (item !== this.barHeights[pos]) {
          let temp = item;
          item = this.barHeights[pos];
          this.barHeights[pos] = temp;
          // change to green
          this.setBarColor(pos, '#c24949');
          this.numChanges++;
          writes++;
        }
      }
    }
    clearInterval(interval);  
    this.inProgress = false;

    // Mark all bars as sorted
    for (let i = 0; i < this.barHeights.length; i++) {
      if (this.stopSorting) {
        return;
      }
      this.setBarColor(i, '#73be73');
      this.playTone(this.barHeights[i], this.audioLength);
      await sleep(this.delay/2);
    }
  }

  // gnome sort
  async gnomeSort() {
    const interval = setInterval(() => {
      this.updateTimer();
    }, 10); // 10 milliseconds = 0.01 seconds
    this.inProgress = true;
    this.stopSorting = false;
  
    // Set all bars to red
    for (let i = 0; i < this.barHeights.length; i++) {
      this.setBarColor(i, '#c24949');
    }
  
    const sleep = (ms: number) => {
      return new Promise(resolve => setTimeout(resolve, ms));
    };
  
    let i = 0;
    while (i < this.barHeights.length) {
      if (this.stopSorting) {
        clearInterval(interval);        
        return;
      }
      if (i === 0) {
        i++;
      }
      // Set the bars being compared to blue
      this.setBarColor(i, '#FEDC56');
      this.setBarColor(i - 1, '#229ccb');
      this.setBarColor(i - 2, '#c24949');
      // if going down, set i - 1 to red
      if (this.barHeights[i] < this.barHeights[i - 1]) {
        this.setBarColor(i - 1, '#c24949');
      }
      await sleep(this.delay);
      if (this.barHeights[i] >= this.barHeights[i - 1]) {
        this.playTone(this.barHeights[i], this.audioLength);
        i++;
      } else {
        let temp = this.barHeights[i];
        this.barHeights[i] = this.barHeights[i - 1];
        this.barHeights[i - 1] = temp;
        this.numChanges++;
        i--;
        if (i > 0){
          this.playTone(this.barHeights[i - 1], this.audioLength);
        }
      }
      // Set the bars being compared back to red
      this.setBarColor(i, '#c24949');
      this.setBarColor(i - 1, '#c24949');
      this.setBarColor(i - 2, '#c24949');
    }
    clearInterval(interval);  
    this.inProgress = false;
  
    // Mark all bars as sorted
    for (let i = 0; i < this.barHeights.length; i++) {
      if (this.stopSorting) {
        return;
      }
      this.setBarColor(i, '#73be73');
      this.playTone(this.barHeights[i], this.audioLength);
      await sleep(this.delay/2);
    }
  }
  
  // shell sort
  async shellSort() {
    const interval = setInterval(() => {
      this.updateTimer();
    }, 10); // 10 milliseconds = 0.01 seconds
    this.inProgress = true;
    this.stopSorting = false;

    // set all to red
    for (let i = 0; i < this.barHeights.length; i++) {
      this.setBarColor(i, '#c24949');
    }

    const sleep = (ms: number) => {
      return new Promise(resolve => setTimeout(resolve, ms));
    };

    let n = this.barHeights.length;
    let gap = Math.floor(n / 2);
    while (gap > 0) {
      for (let i = gap; i < n; i++) {
        if (this.stopSorting) {
          clearInterval(interval)
          return;
        }
        let temp = this.barHeights[i];
        let j = i;
        while (j >= gap && this.barHeights[j - gap] > temp) {
          if (this.stopSorting) {
            clearInterval(interval)
            return;
          }
          this.setBarColor(j, '#FEDC56');
          this.setBarColor(j - gap, '#229ccb');
          this.playTone(this.barHeights[j], this.audioLength);
          await sleep(this.delay);
          this.barHeights[j] = this.barHeights[j - gap];
          this.setBarColor(j, '#c24949');
          this.setBarColor(j + 1, '#c24949');
          this.setBarColor(j - 1, '#c24949');
          this.setBarColor(j + 2, '#c24949');
          this.setBarColor(j - 2, '#c24949');
          this.setBarColor(j - gap, '#c24949'); // trying to fix bug with leftover yellow bars during sorting
          this.setBarColor(j - gap + 1, '#c24949');
          this.setBarColor(j - gap - 1, '#c24949');
          this.setBarColor(j - gap + 2, '#c24949');
          this.setBarColor(j - gap - 2, '#c24949');
          this.numChanges++;
          j -= gap;
        }
        this.barHeights[j] = temp;
        this.setBarColor(j, '#c24949');
        this.setBarColor(i, '#c24949');
      }
      gap = Math.floor(gap / 2);
    }
    clearInterval(interval); 
    this.inProgress = false;

    // Mark all bars as sorted
    for (let i = 0; i < this.barHeights.length; i++) {
      if (this.stopSorting) {
        return;
      }
      this.setBarColor(i, '#73be73');
      this.playTone(this.barHeights[i], this.audioLength);
      await sleep(this.delay/2);
    }
  }

  // strand/spaghetti Sort
  async strandSort() {
    const interval = setInterval(() => {
      this.updateTimer();
    }, 10); // 10 milliseconds = 0.01 seconds
    this.inProgress = true;
    this.stopSorting = false;

    // set all to red
    for (let i = 0; i < this.barHeights.length; i++) {
      this.setBarColor(i, '#c24949');
    }

    const sleep = (ms: number) => {
      return new Promise(resolve => setTimeout(resolve, ms));
    };

    let n = this.barHeights.length;
    let swapped = true;
    let start = 0;
    let end = n - 1;

    while (swapped) {
      swapped = false;

      for (let i = start; i < end; i++) {
        if (this.stopSorting) {
          clearInterval(interval)
          return;
        }
        this.setBarColor(i, '#FEDC56');
        this.setBarColor(i + 1, '#229ccb');
        this.playTone(this.barHeights[i + 1], this.audioLength);
        await sleep(this.delay);
        if (this.barHeights[i] > this.barHeights[i + 1]) {
          let temp = this.barHeights[i];
          this.barHeights[i] = this.barHeights[i + 1];
          this.barHeights[i + 1] = temp;
          this.numChanges++;
          swapped = true;
        }
        this.setBarColor(i + 1, '#c24949');
        this.setBarColor(i, '#c24949');
      }

      if (!swapped) {
        break;
      }

      swapped = false;
      end--;

      for (let i = end - 1; i >= start; i--) {
        if (this.stopSorting) {
          clearInterval(interval)
          return;
        }
        this.setBarColor(i, '#229ccb');
        this.setBarColor(i + 1, '#FEDC56');
        this.playTone(this.barHeights[i], this.audioLength);
        await sleep(this.delay);
        if (this.barHeights[i] > this.barHeights[i + 1]) {
          let temp = this.barHeights[i];
          this.barHeights[i] = this.barHeights[i + 1];
          this.barHeights[i + 1] = temp;
          this.numChanges++;
          swapped = true;
        }
        this.setBarColor(i, '#c24949');
        this.setBarColor(i + 1, '#c24949');
      }

      start++;
    }
    clearInterval(interval);  
    this.inProgress = false;

    // Mark all bars as sorted
    for (let i = 0; i < this.barHeights.length; i++) {
      if (this.stopSorting) {
        return;
      }
      this.setBarColor(i, '#73be73');
      this.playTone(this.barHeights[i], this.audioLength);
      await sleep(this.delay/2);
    }
  }

  // pancake sort
  async pancakeSort() {
    const interval = setInterval(() => {
      this.updateTimer();
    }, 10); // 10 milliseconds = 0.01 seconds
    this.inProgress = true;
    this.stopSorting = false;
  
    // set all to red
    for (let i = 0; i < this.barHeights.length; i++) {
      this.setBarColor(i, '#c24949');
    }
  
    const sleep = (ms: number) => {
      return new Promise(resolve => setTimeout(resolve, ms));
    };
  
    let n = this.barHeights.length;
    for (let curr_size = n; curr_size > 1; --curr_size) {
      let mi = 0;
      for (let i = 0; i < curr_size; i++) {
        if (this.stopSorting) {
          clearInterval(interval)
          return;
        }
        this.setBarColor(i, '#FEDC56');
        this.setBarColor(mi, '#229ccb');
        this.playTone(this.barHeights[i], this.audioLength);
        await sleep(this.delay);
        this.setBarColor(i, '#c24949');
        this.setBarColor(mi, '#c24949');
        if (this.barHeights[i] > this.barHeights[mi]) {
          mi = i;
        }
      }
      if (mi !== curr_size - 1) {
        let temp = this.barHeights[mi];
        for (let i = mi; i < (curr_size - mi) / 2 + mi; i++) {
          this.setBarColor(i, '#FEDC56');
          this.setBarColor(curr_size - i + mi - 1, '#229ccb');
          this.playTone(this.barHeights[i], this.audioLength);
          await sleep(this.delay);
          this.setBarColor(i, '#c24949');
          this.setBarColor(curr_size - i + mi - 1, '#c24949');
          let t = this.barHeights[i];
          this.barHeights[i] = this.barHeights[curr_size - i + mi - 1];
          this.barHeights[curr_size - i + mi - 1] = t;
          this.numChanges++;
          temp = this.barHeights[mi];
        }
      }
    }
    clearInterval(interval);  
    this.inProgress = false;
  
    // Mark all bars as sorted
    for (let i = 0; i < this.barHeights.length; i++) {
      if (this.stopSorting) {
        return;
      }
      this.setBarColor(i, '#73be73');
      this.playTone(this.barHeights[i], this.audioLength);
      await sleep(this.delay/2);
    }
  }
  
  // stooge sort
  async stoogeSort() {
    const interval = setInterval(() => {
      this.updateTimer();
    }, 10); // 10 milliseconds = 0.01 seconds
    this.inProgress = true;
    this.stopSorting = false;

    // set all to red
    for (let i = 0; i < this.barHeights.length; i++) {
      this.setBarColor(i, '#c24949');
    }

    const sleep = (ms: number) => {
      return new Promise(resolve => setTimeout(resolve, ms));
    };

    const stoogeSort = async (arr: number[], l: number, h: number) => {
      if (this.stopSorting) {
        clearInterval(interval);        
        return;
      }
      if (l >= h) {
        return;
      }
      if (arr[l] > arr[h]) {
        let t = arr[l];
        arr[l] = arr[h];
        arr[h] = t;
        // change color to yellow and blue
        this.setBarColor(l, '#FEDC56');
        this.setBarColor(h, '#229ccb');
        this.playTone(this.barHeights[l], this.audioLength);
        await sleep(this.delay);
        this.numChanges++;
        // back to red
        this.setBarColor(l, '#c24949');
        this.setBarColor(h, '#c24949');
      }
      if (h - l + 1 > 2) {
        let t = Math.floor((h - l + 1) / 3);
        await stoogeSort(arr, l, h - t);
        await stoogeSort(arr, l + t, h);
        await stoogeSort(arr, l, h - t);
      }
    };
    
    await stoogeSort(this.barHeights, 0, this.barHeights.length - 1);
    clearInterval(interval);  
    this.inProgress = false;

    // Mark all bars as sorted
    for (let i = 0; i < this.barHeights.length; i++) {
      if (this.stopSorting) {
        return;
      }
      this.setBarColor(i, '#73be73');
      this.playTone(this.barHeights[i], this.audioLength);
      await sleep(this.delay/2);
    }
  }

  // bogo sort
  async bogoSort() {
    const interval = setInterval(() => {
      this.updateTimer();
    }, 10); // 10 milliseconds = 0.01 seconds
    this.inProgress = true;
    this.stopSorting = false;

    // set all to red
    for (let i = 0; i < this.barHeights.length; i++) {
      this.setBarColor(i, '#c24949');
    }

    const sleep = (ms: number) => {
      return new Promise(resolve => setTimeout(resolve, ms));
    };

    const isSorted = (arr: number[]) => {
      for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] > arr[i + 1]) {
          return false;
        }
      }
      return true;
    };

    const shuffle = (arr: number[]) => {
      for (let i = 0; i < arr.length; i++) {
        let j = Math.floor(Math.random() * arr.length);
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
    };

    while (!isSorted(this.barHeights)) {
      if (this.stopSorting) {
        clearInterval(interval);        
        return;
      }
      shuffle(this.barHeights);
      // play random tone between max and min of barHeights
      this.playTone(this.barHeights[0], this.audioLength);
      this.numChanges++;
      await sleep(this.delay);
    }
    clearInterval(interval);  
    this.inProgress = false;

    // Mark all bars as sorted
    for (let i = 0; i < this.barHeights.length; i++) {
      if (this.stopSorting) {
        return;
      }
      this.setBarColor(i, '#73be73');
      this.playTone(this.barHeights[i], this.audioLength);
      await sleep(this.delay/2);
    }
  }

  // counting sort
  async countingSort() {
    const interval = setInterval(() => {
      this.updateTimer();
    }, 10); // 10 milliseconds = 0.01 seconds
    this.inProgress = true;
    this.stopSorting = false;
  
    // Set all bars to red
    for (let i = 0; i < this.barHeights.length; i++) {
      this.setBarColor(i, "#c24949");
    }
  
    const sleep = (ms: number) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };
  
    let max = Math.max(...this.barHeights);
    let min = Math.min(...this.barHeights);
    let range = max - min + 1;
    let count = new Array(range).fill(0);
    let output = new Array(this.barHeights.length).fill(0);
  
    // Animate the counting process
    for (let i = 0; i < this.barHeights.length; i++) {
      this.setBarColor(i, "#FEDC56"); // Highlight the current bar
      this.setBarColor(i + 1, "#229ccb"); // Highlight the current bar
      this.playTone(this.barHeights[i], this.audioLength);
      await sleep(this.delay); // Pause for a short amount of time
      count[this.barHeights[i] - min]++;
      this.setBarColor(i, "#c24949"); // Set the color back to red
      if (this.stopSorting) {
        clearInterval(interval);        
        return;
      }
    }
  
    // Animate the prefix sum process
    for (let i = 1; i < count.length; i++) {
      count[i] += count[i - 1];
      if (this.stopSorting) {
        clearInterval(interval);        
        return;
      }
    }
  
    // Animate the sorting process
    for (let i = this.barHeights.length - 1; i >= 0; i--) {
      if (this.stopSorting) {
        clearInterval(interval);        
        return;
      }
      this.setBarColor(i, "#FEDC56"); // Highlight the current bar
      this.setBarColor(i - 1, "#229ccb"); // Highlight the current bar
      this.playTone(this.barHeights[i], this.audioLength)
      await sleep(this.delay); // Pause for a short amount of time
      output[count[this.barHeights[i] - min] - 1] = this.barHeights[i];
      count[this.barHeights[i] - min]--;
      this.setBarColor(i, "#c24949"); // Set the color back to red
    }
  
    // Animate the final step
    for (let i = 0; i < this.barHeights.length; i++) {
      if (this.stopSorting) {
        clearInterval(interval);        
        return;
      }
      this.barHeights[i] = output[i];
      this.numChanges++;
      this.setBarColor(i, "#73be73"); // Set the color to green to indicate that the bar is sorted
      this.playTone(this.barHeights[i], this.audioLength)
      await sleep(this.delay); // Pause for a short amount of time
    }
    clearInterval(interval)
    this.inProgress = false;
  }
  
  barColors: string[] = [];
  setBarColor(index: number, color: string) {
    setTimeout(() => {
      let bar = document.querySelectorAll('.bar')[index] as HTMLElement;
    if (bar) { 
      // add important
      bar.style.setProperty('background-color', color, 'important');
      this.barColors[index] = color;
    }
  } , 0);}
}
