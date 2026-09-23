import { Component, DoCheck, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ACTIVE, COMPARE, SORTED, SortService } from '../sort.service';

@Component({
  selector: 'app-sorting-visualizer',
  templateUrl: './sorting-visualizer.component.html',
  styleUrls: ['./sorting-visualizer.component.scss']
})
export class SortingVisualizerComponent implements OnInit, DoCheck {
  @ViewChild('bars', { static: true }) bars!: ElementRef<HTMLElement>;
  colors = { compare: COMPARE, active: ACTIVE, sorted: SORTED };
  showLabels = true;
  dense = false;
  private width = 0;
  private count = -1;

  constructor(public sortService: SortService) { }

  ngOnInit() {
    this.sortService.generateBars();
  }

  ngDoCheck() {
    const count = this.sortService.barHeights.length;
    if (count === this.count && this.width) return;
    this.count = count;
    this.updateLayout();
  }

  // Only show value labels / gaps between bars when each bar has enough room
  @HostListener('window:resize')
  updateLayout() {
    this.width = this.bars.nativeElement.clientWidth;
    const slot = this.width / Math.max(1, this.sortService.barHeights.length);
    this.showLabels = slot >= 22;
    this.dense = slot < 5;
  }

  trackByIndex(index: number) {
    return index;
  }
}
