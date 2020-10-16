import sanitize from '../sanitize';

describe('sanitize', (): void => {
  it('Removes empty space', (): void => {
    const title = sanitize('  foo  ');
    expect(title).toBe('foo');
  });
});
