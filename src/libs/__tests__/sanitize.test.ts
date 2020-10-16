import sanitize from '../sanitize';

describe('src.libs.sanitize', (): void => {
  it('Removes empty space', (): void => {
    const foo = sanitize('  foo  ');
    expect(foo).toBe('foo');
  });

  it('Removes \\n \\t \\r', (): void => {
    const foo = sanitize('\n\r\tfoo\n\r\t');
    expect(foo).toBe('foo');
  });
});
