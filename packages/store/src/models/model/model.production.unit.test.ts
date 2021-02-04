import { MockStore, tracker, mockPostgres } from './__mock__/mock-store';

jest.mock('six__server__global', () => ({
  NODE_ENV: 'production',
}));

let mockStore: MockStore;

describe(`
  Package: store
  Module: model
  Class: model
  Environment: production
`, () => {
  beforeEach(() => {
    tracker.install();
  });

  afterEach(() => {
    tracker.uninstall();
  });

  /**
   * Model._blockInProduction method returns a boolean depending on the
   * value of the current app NODE_ENV config. Note that the class
   * doesn't listen to process.env, it listens to the NODE_ENV variable
   * from {@link six__server__global}
   *
   * This test checks whether the said method returns false and hence
   * blocks the actions that shouldn't be allowed in production
   *
   * This test has a "test" environment counterpart in the module
   * model.test.ts
   */
  it('Blocks risky actions in production mode', () => {
    const originalWarn = console.warn;
    console.warn = jest.fn();

    mockStore = new MockStore({
      singular: 'singular',
      plural: 'plural',
      connector: mockPostgres,
    });
    mockStore.createTable();

    const blockResponse = mockStore.blockInProductionWrapper();
    // In test this should equal to true instead of false
    expect(blockResponse).toEqual(false);
    expect(console.warn).toHaveBeenCalledTimes(1);

    console.warn = originalWarn;
  });
});
