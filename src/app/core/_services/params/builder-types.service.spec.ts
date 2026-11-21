import { RequestParamsIntermediate } from '@services/params/builder-types.service';

describe('RequestParamsIntermediate', () => {
  it('starts empty and holds independent request parameters', () => {
    const params = new RequestParamsIntermediate();
    expect(params.pageSize).toBeUndefined();
    expect(params.includes).toBeUndefined();
    params.pageSize = 25;
    params.includes = ['files'];
    expect(params.pageSize).toBe(25);
    expect(params.includes).toStrictEqual(['files']);
    expect(new RequestParamsIntermediate().includes).toBeUndefined();
  });
});
