import { JCrackerBinaryType, isHashcatCrackerBinary } from '@models/cracker-binary.model';

function type(typeName: string): JCrackerBinaryType {
  return { id: 1, type: 'crackerBinaryType', typeName, crackerVersions: [] };
}

describe('isHashcatCrackerBinary', () => {
  it('is true for versions of the hashcat type', () => {
    expect(isHashcatCrackerBinary({ crackerBinaryType: type('hashcat') })).toBeTrue();
  });

  it('is false for other types and when the type is not included', () => {
    expect(isHashcatCrackerBinary({ crackerBinaryType: type('generic') })).toBeFalse();
    expect(isHashcatCrackerBinary({})).toBeFalse();
  });
});
