import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SortService } from '../sort.service';

@Component({
  selector: 'app-sorting-visualizer',
  templateUrl: './sorting-visualizer.component.html',
  styleUrls: ['./sorting-visualizer.component.scss']
})
export class SortingVisualizerComponent implements OnInit, AfterViewInit {

  constructor(public sortService: SortService) { }

  ngAfterViewInit() {
    this.sortService.generateBars();
  }


  ngOnInit() {

  }

}

