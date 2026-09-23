import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AppComponent } from './app.component';
import { InputBarComponent } from './input-bar/input-bar.component';
import { SortingVisualizerComponent } from './sorting-visualizer/sorting-visualizer.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NoopAnimationsModule,
        FormsModule,
        MatButtonModule,
        MatIconModule,
        MatSliderModule,
        MatTooltipModule
      ],
      declarations: [
        AppComponent,
        InputBarComponent,
        SortingVisualizerComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'sorting-algos'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('sorting-algos');
  });

  it('should render title and bars', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.header-title')?.textContent).toContain('Sorting Algorithm Visualizer');
    expect(compiled.querySelectorAll('.bar').length).toBeGreaterThan(0);
  });
});
