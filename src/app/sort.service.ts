import { Injectable } from '@angular/core';

export const BASE = '#7474B0';     // idle, before sorting
export const UNSORTED = '#c24949'; // not yet in final position
export const COMPARE = '#FEDC56';  // being compared / written
export const ACTIVE = '#229ccb';   // pivot, key, current min/max, etc.
export const SORTED = '#73be73';   // in final position

export interface Algorithm {
  id: string;
  name: string;
  url: string;
}

export const ALGORITHMS: Algorithm[] = [
  { id: 'bubble', name: 'Bubble Sort', url: 'https://www.geeksforgeeks.org/bubble-sort/' },
  { id: 'selection', name: 'Selection Sort', url: 'https://www.geeksforgeeks.org/selection-sort/' },
  { id: 'insertion', name: 'Insertion Sort', url: 'https://www.geeksforgeeks.org/insertion-sort/' },
  { id: 'merge', name: 'Merge Sort', url: 'https://www.geeksforgeeks.org/merge-sort/' },
  { id: 'quick', name: 'Quick Sort', url: 'https://www.geeksforgeeks.org/quick-sort/' },
  { id: 'dualpivot', name: 'Dual-Pivot Quick Sort', url: 'https://www.geeksforgeeks.org/dual-pivot-quicksort/' },
  { id: 'intro', name: 'Introsort', url: 'https://www.geeksforgeeks.org/introsort-or-introspective-sort/' },
  { id: 'heap', name: 'Heap Sort', url: 'https://www.geeksforgeeks.org/heap-sort/' },
  { id: 'radix', name: 'Radix Sort (LSD)', url: 'https://www.geeksforgeeks.org/radix-sort/' },
  { id: 'radixmsd', name: 'Radix Sort (MSD)', url: 'https://www.geeksforgeeks.org/msd-most-significant-digit-radix-sort/' },
  { id: 'bitonic', name: 'Bitonic Sort', url: 'https://www.geeksforgeeks.org/bitonic-sort/' },
  { id: 'cocktail', name: 'Cocktail Shaker', url: 'https://www.geeksforgeeks.org/cocktail-sort/' },
  { id: 'oddeven', name: 'Odd-Even Sort', url: 'https://www.geeksforgeeks.org/odd-even-sort-brick-sort/' },
  { id: 'comb', name: 'Comb Sort', url: 'https://www.geeksforgeeks.org/comb-sort/' },
  { id: 'circle', name: 'Circle Sort', url: 'https://www.geeksforgeeks.org/circle-sort/' },
  { id: 'gnome', name: 'Gnome Sort', url: 'https://www.geeksforgeeks.org/gnome-sort-a-stupid-one/' },
  { id: 'shell', name: 'Shell Sort', url: 'https://www.geeksforgeeks.org/shellsort/' },
  { id: 'cycle', name: 'Cycle Sort', url: 'https://www.geeksforgeeks.org/cycle-sort/' },
  { id: 'counting', name: 'Counting Sort', url: 'https://www.geeksforgeeks.org/counting-sort/' },
  { id: 'strand', name: 'Strand Sort', url: 'https://www.geeksforgeeks.org/strand-sort/' },
  { id: 'pancake', name: 'Pancake Sort', url: 'https://www.geeksforgeeks.org/pancake-sorting/' },
  { id: 'tim', name: 'Tim Sort', url: 'https://www.geeksforgeeks.org/timsort/' },
  { id: 'stooge', name: 'Stooge Sort', url: 'https://www.geeksforgeeks.org/stooge-sort/' },
  { id: 'bogo', name: 'Bogo Sort (random)', url: 'https://www.geeksforgeeks.org/bogosort-permutation-sort/' },
];

export const MAX_BARS = 512;

// Thrown from step() when the user hits Stop, unwinding whatever algorithm is running
const STOPPED = Symbol('stopped');

@Injectable({
  providedIn: 'root'
})
export class SortService {
  barHeights: number[] = [];
  barColors: string[] = [];
  maxHeight = 1;
  inProgress = false;
  selectedAlgo = 'bubble';
  alreadySorted = false;
  numBars = 50;
  delay = 20;
  numChanges = 0;
  currentTime = 0;
  isMuted = true;
  volume = 30;
  stopSorting = false;
  private audioContext?: AudioContext;
  private wake?: () => void;

  constructor() {
    const screenWidth = window.innerWidth;
    this.numBars = Math.min(100, Math.max(10, Math.floor((screenWidth - 64) / 24)));
  }

  // ---------- setup ----------

  generateBars() {
    const n = Math.min(MAX_BARS, Math.max(2, Math.floor(this.numBars) || this.barHeights.length || 2));
    this.numBars = n;
    // Distinct random values, so every bar has a unique height and tone
    this.maxHeight = Math.max(100, n);
    const pool = Array.from({ length: this.maxHeight }, (_, i) => i + 1);
    this.shuffle(pool);
    this.barHeights = pool.slice(0, n);
    this.barColors = new Array(n).fill(BASE);
    this.alreadySorted = false;
  }

  resetColors() {
    this.barColors = new Array(this.barHeights.length).fill(BASE);
  }

  // ---------- running ----------

  async sort() {
    if (this.inProgress) return;
    if (this.alreadySorted) this.generateBars();
    const algorithms: Record<string, () => Promise<void>> = {
      bubble: () => this.bubbleSort(),
      selection: () => this.selectionSort(),
      insertion: () => this.insertionSort(),
      merge: () => this.mergeSort(),
      quick: () => this.quickSort(),
      dualpivot: () => this.dualPivotQuickSort(),
      intro: () => this.introSort(),
      heap: () => this.heapSort(),
      radix: () => this.radixSort(),
      radixmsd: () => this.radixMsdSort(),
      bitonic: () => this.bitonicSort(),
      cocktail: () => this.cocktailShakerSort(),
      oddeven: () => this.oddEvenSort(),
      comb: () => this.combSort(),
      circle: () => this.circleSort(),
      gnome: () => this.gnomeSort(),
      shell: () => this.shellSort(),
      cycle: () => this.cycleSort(),
      counting: () => this.countingSort(),
      strand: () => this.strandSort(),
      pancake: () => this.pancakeSort(),
      tim: () => this.timSort(),
      stooge: () => this.stoogeSort(),
      bogo: () => this.bogoSort(),
    };
    const algorithm = algorithms[this.selectedAlgo];
    if (!algorithm) return;

    this.inProgress = true;
    this.stopSorting = false;
    this.numChanges = 0;
    this.currentTime = 0;
    this.barColors = new Array(this.barHeights.length).fill(UNSORTED);
    const start = performance.now();
    const timer = setInterval(() => this.currentTime = (performance.now() - start) / 1000, 10);

    try {
      await algorithm();
      clearInterval(timer);
      this.currentTime = (performance.now() - start) / 1000;
      // Victory sweep. The array is already sorted, so stopping here just skips to the end.
      try {
        const sweepDelay = Math.min(this.delay / 2, 1000 / this.barHeights.length);
        for (let i = 0; i < this.barHeights.length; i++) {
          this.mark(SORTED, i);
          this.tone(i);
          await this.step(sweepDelay);
        }
      } catch (e) {
        if (e !== STOPPED) throw e;
        this.barColors = new Array(this.barHeights.length).fill(SORTED);
      }
      this.alreadySorted = true;
    } catch (e) {
      if (e !== STOPPED) throw e;
      this.resetColors();
      this.numChanges = 0;
      this.currentTime = 0;
    } finally {
      clearInterval(timer);
      this.inProgress = false;
    }
  }

  // ---------- helpers ----------

  // The running algorithm unwinds from its current step() and resets the colors itself
  stop() {
    this.stopSorting = true;
    this.wake?.();
  }

  private async step(ms = this.delay) {
    await new Promise<void>(resolve => {
      const timeout = setTimeout(resolve, ms);
      // lets stop() end the current pause immediately instead of waiting out the delay
      this.wake = () => {
        clearTimeout(timeout);
        resolve();
      };
    });
    this.wake = undefined;
    if (this.stopSorting) throw STOPPED;
  }

  private mark(color: string, ...indices: number[]) {
    for (const i of indices) {
      if (i >= 0 && i < this.barColors.length) this.barColors[i] = color;
    }
  }

  // Back to unsorted, but never un-mark a bar that's already in its final position
  private clear(...indices: number[]) {
    for (const i of indices) {
      if (this.barColors[i] !== SORTED) this.mark(UNSORTED, i);
    }
  }

  private swap(i: number, j: number) {
    const a = this.barHeights;
    [a[i], a[j]] = [a[j], a[i]];
    this.numChanges++;
  }

  private write(i: number, value: number) {
    this.barHeights[i] = value;
    this.numChanges++;
  }

  private shuffle(arr: number[]) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    // Browsers (Safari especially) only let audio start from a user gesture like this click
    if (!this.isMuted) this.getAudioContext()?.resume();
  }

  private getAudioContext() {
    try {
      this.audioContext ??= new AudioContext();
    } catch (error) {
      console.error('Audio not supported:', error);
    }
    return this.audioContext;
  }

  private tone(index: number) {
    const value = this.barHeights[index];
    if (this.isMuted || value === undefined) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;
    try {
      if (ctx.state === 'suspended') ctx.resume();
      const minFrequency = 200;
      const maxFrequency = 700;
      const frequency = minFrequency + (value / this.maxHeight) * (maxFrequency - minFrequency);
      const duration = Math.min(Math.max(this.delay, 30), 120) / 1000;
      const now = ctx.currentTime;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(frequency, now);
      // Quick fade out avoids clicking at the end of each tone
      gainNode.gain.setValueAtTime(this.volume / 100, now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.start(now);
      oscillator.stop(now + duration);
    } catch (error) {
      console.error('Failed to play tone:', error);
    }
  }

  // Compare two bars: highlight, pause, then clear
  private async compare(i: number, j: number) {
    this.mark(COMPARE, i, j);
    this.tone(j);
    await this.step();
    this.clear(i, j);
    return this.barHeights[i] > this.barHeights[j];
  }

  // Write buffered values into [lo..] one bar per step. If stopped midway, the rest are
  // written instantly so no bars are lost. `pointer` optionally highlights another bar per step.
  private async writeBack(lo: number, values: number[], color: string, pointer: number[] = []) {
    const a = this.barHeights;
    for (let t = 0; t < values.length; t++) {
      const k = lo + t;
      const p = pointer[t] ?? -1;
      this.write(k, values[t]);
      this.mark(ACTIVE, p);
      this.mark(color, k);
      this.tone(k);
      try {
        await this.step();
      } catch (e) {
        for (let r = t + 1; r < values.length; r++) a[lo + r] = values[r];
        throw e;
      }
      this.clear(k);
      if (p !== -1) this.clear(p);
    }
  }

  // Merge sorted runs [lo..mid] and [mid+1..hi] via a buffer
  private async mergeRuns(lo: number, mid: number, hi: number) {
    const a = this.barHeights;
    const left = a.slice(lo, mid + 1);
    const right = a.slice(mid + 1, hi + 1);
    const merged: number[] = [];
    const rightPos: number[] = []; // where the right run's next element still sits in the array
    let i = 0, j = 0;
    while (merged.length < left.length + right.length) {
      const takeLeft = j >= right.length || (i < left.length && left[i] <= right[j]);
      merged.push(takeLeft ? left[i++] : right[j++]);
      rightPos.push(j < right.length ? mid + 1 + j : -1);
    }
    const final = lo === 0 && hi === a.length - 1;
    await this.writeBack(lo, merged, final ? SORTED : COMPARE, rightPos);
  }

  // Insertion sort on [lo..hi] using adjacent swaps so the key visibly walks left
  private async insertionRange(lo: number, hi: number) {
    const a = this.barHeights;
    for (let i = lo + 1; i <= hi; i++) {
      let j = i;
      while (j > lo) {
        this.mark(ACTIVE, j);
        this.mark(COMPARE, j - 1);
        this.tone(j);
        await this.step();
        this.clear(j - 1, j);
        if (a[j - 1] <= a[j]) break;
        this.swap(j - 1, j);
        j--;
      }
    }
  }

  // ---------- algorithms ----------

  async bubbleSort() {
    const a = this.barHeights;
    let end = a.length;
    let swapped = true;
    while (swapped) {
      swapped = false;
      for (let i = 0; i < end - 1; i++) {
        if (await this.compare(i, i + 1)) {
          this.swap(i, i + 1);
          swapped = true;
        }
      }
      end--;
      this.mark(SORTED, end); // largest remaining has bubbled to the end
    }
  }

  async selectionSort() {
    const a = this.barHeights;
    const n = a.length;
    for (let i = 0; i < n - 1; i++) {
      let min = i;
      this.mark(ACTIVE, min);
      for (let j = i + 1; j < n; j++) {
        this.mark(COMPARE, j);
        this.tone(j);
        await this.step();
        if (a[j] < a[min]) {
          this.clear(min);
          min = j;
          this.mark(ACTIVE, min);
        } else {
          this.clear(j);
        }
      }
      this.clear(min);
      if (min !== i) this.swap(i, min);
      this.mark(SORTED, i);
    }
    this.mark(SORTED, n - 1);
  }

  async insertionSort() {
    await this.insertionRange(0, this.barHeights.length - 1);
  }

  async mergeSort() {
    const sortRange = async (lo: number, hi: number) => {
      if (lo >= hi) return;
      const mid = Math.floor((lo + hi) / 2);
      await sortRange(lo, mid);
      await sortRange(mid + 1, hi);
      await this.mergeRuns(lo, mid, hi);
    };
    await sortRange(0, this.barHeights.length - 1);
  }

  async quickSort() {
    const sortRange = async (lo: number, hi: number) => {
      if (lo > hi) return;
      if (lo === hi) {
        this.mark(SORTED, lo);
        return;
      }
      const p = await this.partition(lo, hi);
      await sortRange(lo, p - 1);
      await sortRange(p + 1, hi);
    };
    await sortRange(0, this.barHeights.length - 1);
  }

  // Lomuto partition of [lo..hi] around a[hi]. Returns the pivot's final index.
  private async partition(lo: number, hi: number) {
    const a = this.barHeights;
    const pivot = a[hi];
    this.mark(ACTIVE, hi);
    let i = lo;
    for (let j = lo; j < hi; j++) {
      this.mark(COMPARE, j);
      this.tone(j);
      await this.step();
      this.clear(j);
      if (a[j] < pivot) {
        if (i !== j) this.swap(i, j);
        i++;
      }
    }
    this.clear(hi);
    if (i !== hi) this.swap(i, hi);
    this.mark(SORTED, i); // pivot is now in its final spot
    return i;
  }

  async dualPivotQuickSort() {
    // Yaroslavskiy's dual-pivot partition (as used by Java's Arrays.sort): pivots p <= q
    // split the range into < p, between p and q, and > q
    const a = this.barHeights;
    const sortRange = async (lo: number, hi: number) => {
      if (lo > hi) return;
      if (lo === hi) {
        this.mark(SORTED, lo);
        return;
      }
      if (await this.compare(lo, hi)) this.swap(lo, hi);
      const p = a[lo];
      const q = a[hi];
      this.mark(ACTIVE, lo, hi);
      let lt = lo + 1; // a[lo+1 .. lt-1] < p
      let gt = hi - 1; // a[gt+1 .. hi-1] > q
      for (let k = lt; k <= gt; k++) {
        this.mark(COMPARE, k);
        this.tone(k);
        await this.step();
        this.clear(k);
        if (a[k] < p) {
          this.swap(k, lt++);
        } else if (a[k] >= q) {
          // find something from the right that doesn't belong past q
          while (a[gt] > q && k < gt) {
            this.mark(COMPARE, gt);
            this.tone(gt);
            await this.step();
            this.clear(gt);
            gt--;
          }
          this.swap(k, gt--);
          if (a[k] < p) this.swap(k, lt++);
        }
      }
      lt--;
      gt++;
      this.clear(lo, hi);
      // Move both pivots into their final spots
      if (lo !== lt) this.swap(lo, lt);
      if (hi !== gt) this.swap(hi, gt);
      this.mark(SORTED, lt, gt);
      await sortRange(lo, lt - 1);
      await sortRange(lt + 1, gt - 1);
      await sortRange(gt + 1, hi);
    };
    await sortRange(0, a.length - 1);
  }

  async introSort() {
    // Introsort (C++ std::sort): quicksort with a median-of-three pivot, switching to heap sort
    // if recursion gets too deep, and insertion sort for small ranges
    const a = this.barHeights;
    const n = a.length;
    const maxDepth = 2 * Math.floor(Math.log2(Math.max(1, n)));
    const threshold = 16;
    const sortRange = async (lo: number, hi: number, depth: number) => {
      const size = hi - lo + 1;
      if (size <= 0) return;
      if (size <= threshold) {
        await this.insertionRange(lo, hi);
        for (let k = lo; k <= hi; k++) this.mark(SORTED, k);
        return;
      }
      if (depth === 0) {
        await this.heapSortRange(lo, hi);
        return;
      }
      // Median of three: order a[lo], a[mid], a[hi], then use the median as the pivot
      const mid = lo + Math.floor(size / 2);
      if (await this.compare(lo, mid)) this.swap(lo, mid);
      if (await this.compare(lo, hi)) this.swap(lo, hi);
      if (await this.compare(mid, hi)) this.swap(mid, hi);
      this.swap(mid, hi);
      const p = await this.partition(lo, hi);
      await sortRange(lo, p - 1, depth - 1);
      await sortRange(p + 1, hi, depth - 1);
    };
    await sortRange(0, n - 1, maxDepth);
  }

  async heapSort() {
    await this.heapSortRange(0, this.barHeights.length - 1);
  }

  // Heap sort on [lo..hi]. Heap node k lives at array index lo + k.
  private async heapSortRange(lo: number, hi: number) {
    const a = this.barHeights;
    const n = hi - lo + 1;
    const siftDown = async (i: number, size: number) => {
      while (true) {
        const l = 2 * i + 1;
        const r = l + 1;
        if (l >= size) return;
        const children = r < size ? [lo + l, lo + r] : [lo + l];
        this.mark(ACTIVE, lo + i);
        this.mark(COMPARE, ...children);
        this.tone(lo + i);
        await this.step();
        this.clear(lo + i, ...children);
        let largest = i;
        if (a[lo + l] > a[lo + largest]) largest = l;
        if (r < size && a[lo + r] > a[lo + largest]) largest = r;
        if (largest === i) return;
        this.swap(lo + i, lo + largest);
        i = largest;
      }
    };

    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      await siftDown(i, n);
    }
    // Move the max to the end, then restore the heap
    for (let end = n - 1; end > 0; end--) {
      this.mark(ACTIVE, lo, lo + end);
      this.tone(lo);
      await this.step();
      this.swap(lo, lo + end);
      this.clear(lo);
      this.mark(SORTED, lo + end);
      await siftDown(0, end);
    }
    this.mark(SORTED, lo);
  }

  async radixSort() {
    const a = this.barHeights;
    const n = a.length;
    const max = Math.max(...a);
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
      const lastPass = Math.floor(max / (exp * 10)) === 0;
      // Distribute into buckets by the current digit
      const buckets: number[][] = Array.from({ length: 10 }, () => []);
      for (let i = 0; i < n; i++) {
        this.mark(COMPARE, i);
        this.tone(i);
        await this.step();
        this.clear(i);
        buckets[Math.floor(a[i] / exp) % 10].push(a[i]);
      }
      // Collect buckets back into the array
      await this.writeBack(0, buckets.flat(), lastPass ? SORTED : ACTIVE);
    }
  }

  async radixMsdSort() {
    // Most significant digit first: bucket the range by one digit, then recurse into each bucket
    const a = this.barHeights;
    const sortRange = async (lo: number, hi: number, exp: number) => {
      if (lo > hi) return;
      if (lo === hi || exp < 1) {
        for (let k = lo; k <= hi; k++) this.mark(SORTED, k);
        return;
      }
      const buckets: number[][] = Array.from({ length: 10 }, () => []);
      for (let i = lo; i <= hi; i++) {
        this.mark(COMPARE, i);
        this.tone(i);
        await this.step();
        this.clear(i);
        buckets[Math.floor(a[i] / exp) % 10].push(a[i]);
      }
      // On the last digit every bucket is final
      await this.writeBack(lo, buckets.flat(), exp === 1 ? SORTED : ACTIVE);
      let start = lo;
      for (const bucket of buckets) {
        await sortRange(start, start + bucket.length - 1, exp / 10);
        start += bucket.length;
      }
    };
    const digits = String(Math.max(...a)).length;
    await sortRange(0, a.length - 1, Math.pow(10, digits - 1));
  }

  async bitonicSort() {
    // Works for any n (not just powers of 2) using the arbitrary-length bitonic network
    const a = this.barHeights;
    const greatestPowerOfTwoBelow = (n: number) => {
      let k = 1;
      while (k < n) k <<= 1;
      return k >> 1;
    };
    const compareAndSwap = async (i: number, j: number, ascending: boolean) => {
      this.mark(COMPARE, i, j);
      this.tone(i);
      await this.step();
      this.clear(i, j);
      if (ascending ? a[i] > a[j] : a[i] < a[j]) this.swap(i, j);
    };
    const merge = async (lo: number, n: number, ascending: boolean) => {
      if (n <= 1) return;
      const m = greatestPowerOfTwoBelow(n);
      for (let i = lo; i < lo + n - m; i++) {
        await compareAndSwap(i, i + m, ascending);
      }
      await merge(lo, m, ascending);
      await merge(lo + m, n - m, ascending);
    };
    const sortRange = async (lo: number, n: number, ascending: boolean) => {
      if (n <= 1) return;
      const m = Math.floor(n / 2);
      await sortRange(lo, m, !ascending);
      await sortRange(lo + m, n - m, ascending);
      await merge(lo, n, ascending);
    };
    await sortRange(0, a.length, true);
  }

  async cocktailShakerSort() {
    const a = this.barHeights;
    let start = 0;
    let end = a.length - 1;
    let swapped = true;
    while (swapped) {
      swapped = false;
      for (let i = start; i < end; i++) {
        if (await this.compare(i, i + 1)) {
          this.swap(i, i + 1);
          swapped = true;
        }
      }
      this.mark(SORTED, end);
      end--;
      if (!swapped) break;

      swapped = false;
      for (let i = end - 1; i >= start; i--) {
        if (await this.compare(i, i + 1)) {
          this.swap(i, i + 1);
          swapped = true;
        }
      }
      this.mark(SORTED, start);
      start++;
    }
  }

  async combSort() {
    const n = this.barHeights.length;
    let gap = n;
    let sorted = false;
    while (!sorted) {
      gap = Math.floor(gap / 1.3);
      if (gap <= 1) {
        gap = 1;
        sorted = true;
      }
      for (let i = 0; i + gap < n; i++) {
        if (await this.compare(i, i + gap)) {
          this.swap(i, i + gap);
          sorted = false;
        }
      }
    }
  }

  async oddEvenSort() {
    // Alternates between comparing all odd-indexed pairs and all even-indexed pairs.
    // Designed for parallel hardware, where each phase happens at once.
    const n = this.barHeights.length;
    let sorted = false;
    while (!sorted) {
      sorted = true;
      for (const start of [1, 0]) {
        for (let i = start; i < n - 1; i += 2) {
          if (await this.compare(i, i + 1)) {
            this.swap(i, i + 1);
            sorted = false;
          }
        }
      }
    }
  }

  async circleSort() {
    // Compare mirrored pairs from the outside in, recurse into both halves, and repeat
    // whole passes until one makes no swaps
    const circle = async (lo: number, hi: number): Promise<boolean> => {
      if (lo >= hi) return false;
      let swapped = false;
      let i = lo;
      let j = hi;
      while (i < j) {
        if (await this.compare(i, j)) {
          this.swap(i, j);
          swapped = true;
        }
        i++;
        j--;
      }
      // Odd-length range: compare the middle element with its right neighbour
      if (i === j && await this.compare(i, j + 1)) {
        this.swap(i, j + 1);
        swapped = true;
      }
      const mid = lo + Math.floor((hi - lo) / 2);
      const left = await circle(lo, mid);
      const right = await circle(mid + 1, hi);
      return swapped || left || right;
    };
    while (await circle(0, this.barHeights.length - 1)) { }
  }

  async gnomeSort() {
    const a = this.barHeights;
    let i = 1;
    while (i < a.length) {
      this.mark(ACTIVE, i); // the gnome
      this.mark(COMPARE, i - 1);
      this.tone(i);
      await this.step();
      this.clear(i - 1, i);
      if (a[i - 1] <= a[i]) {
        i++;
      } else {
        this.swap(i - 1, i);
        i = Math.max(1, i - 1);
      }
    }
  }

  async shellSort() {
    const a = this.barHeights;
    const n = a.length;
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
      // Gapped insertion sort
      for (let i = gap; i < n; i++) {
        let j = i;
        while (j >= gap) {
          this.mark(ACTIVE, j);
          this.mark(COMPARE, j - gap);
          this.tone(j);
          await this.step();
          this.clear(j - gap, j);
          if (a[j - gap] <= a[j]) break;
          this.swap(j - gap, j);
          j -= gap;
        }
      }
    }
  }

  async cycleSort() {
    // Swap-based cycle sort: the bar at cycleStart is the item "in hand", and each
    // swap drops it directly into its final position.
    const a = this.barHeights;
    const n = a.length;
    for (let cycleStart = 0; cycleStart < n - 1; cycleStart++) {
      while (true) {
        const item = a[cycleStart];
        let pos = cycleStart;
        for (let i = cycleStart + 1; i < n; i++) {
          this.mark(ACTIVE, cycleStart);
          this.mark(COMPARE, i);
          this.tone(i);
          await this.step();
          this.clear(i);
          if (a[i] < item) pos++;
        }
        if (pos === cycleStart) break;
        while (a[pos] === item) pos++; // skip duplicates already in place
        this.swap(cycleStart, pos);
        this.mark(SORTED, pos);
      }
      this.mark(SORTED, cycleStart);
    }
  }

  async countingSort() {
    const a = this.barHeights;
    const n = a.length;
    const min = Math.min(...a);
    const max = Math.max(...a);
    const count = new Array(max - min + 1).fill(0);
    // Count occurrences
    for (let i = 0; i < n; i++) {
      this.mark(COMPARE, i);
      this.tone(i);
      await this.step();
      this.clear(i);
      count[a[i] - min]++;
    }
    // Write values back out in order
    const output = count.flatMap((c, v) => new Array(c).fill(v + min));
    await this.writeBack(0, output, SORTED);
  }

  async strandSort() {
    // In-place strand sort: [0, sortedEnd) holds the merged result so far. Each round pulls an
    // increasing "strand" out of the remaining bars, gathers it right after the sorted region,
    // then merges it in.
    const a = this.barHeights;
    const n = a.length;
    let sortedEnd = 0;
    while (sortedEnd < n) {
      let strandEnd = sortedEnd + 1;
      this.mark(ACTIVE, sortedEnd);
      for (let i = strandEnd; i < n; i++) {
        this.mark(COMPARE, i);
        this.tone(i);
        await this.step();
        this.clear(i);
        if (a[i] >= a[strandEnd - 1]) {
          // Pull a[i] into the strand, shifting the skipped bars right
          const value = a[i];
          for (let k = i; k > strandEnd; k--) a[k] = a[k - 1];
          this.write(strandEnd, value);
          this.mark(ACTIVE, strandEnd);
          strandEnd++;
        }
      }
      if (sortedEnd > 0) {
        await this.mergeRuns(0, sortedEnd - 1, strandEnd - 1);
      }
      for (let k = sortedEnd; k < strandEnd; k++) this.clear(k);
      sortedEnd = strandEnd;
    }
  }

  async pancakeSort() {
    const a = this.barHeights;
    // Reverse the top k+1 pancakes in one flip
    const flip = async (k: number) => {
      const range = Array.from({ length: k + 1 }, (_, i) => i);
      this.mark(COMPARE, ...range);
      this.tone(k);
      await this.step();
      for (let l = 0, r = k; l < r; l++, r--) this.swap(l, r);
      this.tone(0);
      await this.step();
      this.clear(...range);
    };
    for (let size = a.length; size > 1; size--) {
      // Find the largest pancake in the unsorted stack
      let max = 0;
      this.mark(ACTIVE, max);
      for (let i = 1; i < size; i++) {
        this.mark(COMPARE, i);
        this.tone(i);
        await this.step();
        if (a[i] > a[max]) {
          this.clear(max);
          max = i;
          this.mark(ACTIVE, max);
        } else {
          this.clear(i);
        }
      }
      this.clear(max);
      if (max !== size - 1) {
        if (max > 0) await flip(max); // bring it to the top
        await flip(size - 1);         // then flip it to the bottom
      }
      this.mark(SORTED, size - 1);
    }
    this.mark(SORTED, 0);
  }

  async timSort() {
    // Simplified Timsort: insertion-sort fixed-size runs, then merge them bottom-up.
    // Real Timsort uses runs of 32-64; 16 keeps the merge phase visible with fewer bars.
    const n = this.barHeights.length;
    const minRun = 16;
    for (let lo = 0; lo < n; lo += minRun) {
      await this.insertionRange(lo, Math.min(lo + minRun - 1, n - 1));
    }
    for (let size = minRun; size < n; size *= 2) {
      for (let lo = 0; lo < n; lo += 2 * size) {
        const mid = lo + size - 1;
        const hi = Math.min(lo + 2 * size - 1, n - 1);
        if (mid < hi) await this.mergeRuns(lo, mid, hi);
      }
    }
  }

  async stoogeSort() {
    // Stooge sort makes ~n^2.7 comparisons, so only swaps pause the animation
    const a = this.barHeights;
    const sortRange = async (l: number, h: number): Promise<void> => {
      if (this.stopSorting) throw STOPPED;
      if (a[l] > a[h]) {
        this.mark(COMPARE, l, h);
        this.tone(l);
        await this.step();
        this.swap(l, h);
        this.clear(l, h);
      }
      if (h - l + 1 > 2) {
        const t = Math.floor((h - l + 1) / 3);
        await sortRange(l, h - t);
        await sortRange(l + t, h);
        await sortRange(l, h - t);
      }
    };
    await sortRange(0, a.length - 1);
  }

  async bogoSort() {
    const a = this.barHeights;
    const isSorted = () => a.every((v, i) => i === 0 || a[i - 1] <= v);
    while (!isSorted()) {
      this.shuffle(a);
      this.numChanges++;
      this.tone(0);
      await this.step();
    }
  }
}
