import { ALGORITHMS, BASE, SORTED, SortService } from './sort.service';

describe('SortService', () => {
  let service: SortService;

  beforeEach(() => {
    service = new SortService();
    service.delay = 0;
  });

  const load = (values: number[]) => {
    service.barHeights = values.slice();
    service.maxHeight = Math.max(...values);
    service.barColors = values.map(() => BASE);
    service.alreadySorted = false; // otherwise sort() generates fresh random bars
  };

  for (const algo of ALGORITHMS) {
    it(`${algo.name} sorts distinct values and duplicates`, async () => {
      // Skip the animation pauses so full sorts finish instantly
      spyOn<any>(service, 'step').and.resolveTo();
      const inputs = algo.id === 'bogo'
        ? [[3, 1, 2], [2, 1, 2, 1]]
        : [[5, 3, 9, 1, 7, 2, 8, 4, 6, 10, 15, 12, 11, 14, 13, 20, 17], [4, 1, 4, 2, 2, 9, 1, 4, 3], [2, 1], [1, 2, 3]];
      for (const input of inputs) {
        service.selectedAlgo = algo.id;
        load(input);
        await service.sort();
        expect(service.barHeights).toEqual(input.slice().sort((a, b) => a - b));
        expect(service.barColors.every(c => c === SORTED)).toBeTrue();
        expect(service.inProgress).toBeFalse();
      }
    });
  }

  it('stop resets colors without losing any bars', async () => {
    service.selectedAlgo = 'merge';
    const input = [8, 3, 5, 1, 9, 2, 7, 4, 6];
    load(input);
    const run = service.sort();
    for (let i = 0; i < 20; i++) await Promise.resolve();
    service.stop();
    await run;
    expect(service.barHeights.slice().sort((a, b) => a - b)).toEqual(input.slice().sort((a, b) => a - b));
    expect(service.barColors.every(c => c === BASE)).toBeTrue();
    expect(service.inProgress).toBeFalse();
    expect(service.alreadySorted).toBeFalse();
  });
});
