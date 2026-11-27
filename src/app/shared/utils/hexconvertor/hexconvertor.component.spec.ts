import { HexconvertorComponent } from '@src/app/shared/utils/hexconvertor/hexconvertor.component';

describe('HexconvertorComponent', () => {
  let component: HexconvertorComponent;

  beforeEach(() => {
    component = new HexconvertorComponent();
  });

  describe('hexConv', () => {
    it('converts hexadecimal bytes to characters', () => {
      const input = '48656C6c6F21';

      component.hexConv(input);

      expect(component.hexVal).toBe('Hello!');
    });

    it('converts the minimum and maximum byte values', () => {
      const input = '00ff';

      component.hexConv(input);

      expect(component.hexVal).toBe('\u0000\u00ff');
    });

    it('clears the previous result for an empty input', () => {
      component.hexConv('41');

      component.hexConv('');

      expect(component.hexVal).toBe('');
    });

    it('converts a trailing single hex digit', () => {
      const input = '414';

      component.hexConv(input);

      expect(component.hexVal).toBe('A\u0004');
    });

    it('converts invalid pairs using the parsed prefix or a null character', () => {
      const input = '4gzz';

      component.hexConv(input);

      expect(component.hexVal).toBe('\u0004\u0000');
    });
  });

  describe('onClear', () => {
    it('clears both the input and the converted value', () => {
      const input = document.createElement('textarea');
      input.value = '41';
      vi.spyOn(document, 'getElementById').mockReturnValue(input);
      component.hexConv(input.value);

      component.onClear();

      expect(input.value).toBe('');
      expect(component.hexVal).toBe('');
    });

    it('leaves an already empty input and result unchanged', () => {
      const input = document.createElement('textarea');
      vi.spyOn(document, 'getElementById').mockReturnValue(input);

      component.onClear();

      expect(input.value).toBe('');
      expect(component.hexVal).toBe('');
    });
  });
});
