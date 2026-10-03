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
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  const enterCode = (target: EventTarget = document.body, keys = konamiCode) => {
    for (const key of keys) {
      target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
    }
  };

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

  it('toggles the rainbow with the Konami code without changing the bars or sort state', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    const compiled = fixture.nativeElement as HTMLElement;
    const heights = app.sortService.barHeights.slice();
    const colors = app.sortService.barColors.slice();
    app.sortService.inProgress = true;

    enterCode();
    fixture.detectChanges();
    expect(compiled.querySelector('.bar-container')?.classList.contains('rainbow-mode')).toBeTrue();
    expect(compiled.querySelector('.spectrum-badge')?.textContent).toContain('Spectrum unlocked');
    expect(compiled.querySelector('.logo-button')?.classList.contains('rainbow-mode')).toBeTrue();

    enterCode();
    fixture.detectChanges();
    expect(compiled.querySelector('.bar-container')?.classList.contains('rainbow-mode')).toBeFalse();
    expect(compiled.querySelector('.spectrum-badge')).toBeNull();
    expect(app.sortService.barHeights).toEqual(heights);
    expect(app.sortService.barColors).toEqual(colors);
    expect(app.sortService.inProgress).toBeTrue();
    expect(app.sortService.stopSorting).toBeFalse();
  });

  it('recognizes the code after stray keys and with uppercase B and A', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    enterCode(document.body, ['x', 'ArrowUp', ...konamiCode.slice(0, 8), 'B', 'A']);
    expect(fixture.componentInstance.rainbowMode).toBeTrue();
  });

  it('ignores the code while editing text and rejects incomplete or interrupted sequences', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const input = document.createElement('textarea');
    const editable = document.createElement('div');
    editable.contentEditable = 'true';
    const nested = document.createElement('span');
    editable.appendChild(nested);
    fixture.nativeElement.append(input, editable);

    enterCode(input);
    enterCode(nested);
    enterCode(document.body, konamiCode.slice(0, -1));
    expect(fixture.componentInstance.rainbowMode).toBeFalse();
    enterCode(document.body, ['x', 'a']);
    expect(fixture.componentInstance.rainbowMode).toBeFalse();

    for (const options of [{ repeat: true }, { ctrlKey: true }, { altKey: true }, { metaKey: true }, { isComposing: true }]) {
      enterCode(document.body, konamiCode.slice(0, -1));
      document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true, ...options }));
      expect(fixture.componentInstance.rainbowMode).toBeFalse();
    }
  });

  it('toggles the rainbow on every sixth logo tap and keeps the normal reset action', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    const reset = spyOn(app, 'reset');
    const logo = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('.logo-button')!;

    for (let i = 0; i < 5; i++) logo.click();
    expect(app.rainbowMode).toBeFalse();
    expect(reset).toHaveBeenCalledTimes(5);
    logo.click();
    expect(app.rainbowMode).toBeTrue();
    for (let i = 0; i < 6; i++) logo.click();
    expect(app.rainbowMode).toBeFalse();
    expect(reset).toHaveBeenCalledTimes(10);
  });

  it('starts a fresh tap sequence after a pause', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    spyOn(app, 'reset');
    const logo = (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('.logo-button')!;
    let now = 10000;
    spyOn(Date, 'now').and.callFake(() => now);

    for (let i = 0; i < 5; i++) logo.click();
    now += 2001;
    logo.click();
    expect(app.rainbowMode).toBeFalse();
    for (let i = 0; i < 5; i++) logo.click();
    expect(app.rainbowMode).toBeTrue();
  });

  it('keeps the rainbow enabled when the bars are regenerated', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    enterCode();
    app.sortService.numBars = 100;
    app.reset();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.bar').length).toBe(100);
    expect(compiled.querySelector('.bar-container')?.classList.contains('rainbow-mode')).toBeTrue();
  });
});
