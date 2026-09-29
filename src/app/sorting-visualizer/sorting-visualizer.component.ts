import { Component, DoCheck, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ACTIVE, COMPARE, SORTED, SortService, UNSORTED } from '../sort.service';

@Component({
  selector: 'app-sorting-visualizer',
  templateUrl: './sorting-visualizer.component.html',
  styleUrls: ['./sorting-visualizer.component.scss']
})
export class SortingVisualizerComponent implements OnInit, DoCheck, OnDestroy {
  @ViewChild('bars', { static: true }) bars!: ElementRef<HTMLElement>;
  colors = { unsorted: UNSORTED, compare: COMPARE, active: ACTIVE, sorted: SORTED };
  showLabels = true;
  dense = false;
  private width = 0;
  private sized = false;
  private observer?: ResizeObserver;

  constructor(public sortService: SortService, private zone: NgZone) { }

  ngOnInit() {
    this.sortService.generateBars();
    // Watches the bars area itself, so it also catches layout changes that aren't a window resize
    this.observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      if (width === this.width) return;
      this.zone.run(() => {
        this.width = width;
        // Pick the starting bar count from the real space available, about 24px per bar
        if (!this.sized && width > 0 && !this.sortService.inProgress) {
          this.sized = true;
          this.sortService.numBars = Math.min(100, Math.max(10, Math.floor(width / 24)));
          this.sortService.generateBars();
        }
        this.updateLayout();
      });
    });
    this.observer.observe(this.bars.nativeElement);
  }

  // Bar count can change from the input bar without the element resizing
  ngDoCheck() {
    this.updateLayout();
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  // Only show value labels / gaps between bars when each bar has enough room
  private updateLayout() {
    if (!this.width) return;
    const slot = this.width / Math.max(1, this.sortService.barHeights.length);
    this.showLabels = slot >= 22;
    this.dense = slot < 5;
  }

  trackByIndex(index: number) {
    return index;
  }
}
