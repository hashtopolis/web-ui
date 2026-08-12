import { FileType, JFile } from '@models/file.model';

import { FilesAttackTableComponent } from '@components/tables/files-attack-table/files-attack-table.component';
import { CheckboxChangeEvent } from '@components/tables/ht-table/ht-table.models';

describe('FilesAttackTableComponent', () => {
  const rule = (id: number, filename: string): JFile => ({
    id,
    type: 'file',
    filename,
    size: 0,
    isSecret: false,
    fileType: FileType.RULES,
    accessGroupId: 1,
    lineCount: 0
  });

  const unchecked = (row: JFile): CheckboxChangeEvent => ({
    row,
    columnType: 'CMD',
    checked: false
  });

  // onPrepareAttack is pure, so no Angular fixture is needed for these command transformations.
  const component = Object.create(FilesAttackTableComponent.prototype) as FilesAttackTableComponent;

  it('does not remove another rule flag when the unchecked rule was manually removed', () => {
    const result = component.onPrepareAttack(
      {
        attackCmd: '#HL# -r dive.rule',
        files: [9, 10]
      },
      unchecked(rule(9, 'best66.rule'))
    );

    expect(result.attackCmd).toBe('#HL# -r dive.rule');
    expect(result.files).toEqual([10]);
  });

  it('removes only the flag paired with the unchecked rule', () => {
    const result = component.onPrepareAttack(
      {
        attackCmd: '#HL# -r best66.rule -r dive.rule',
        files: [9, 10]
      },
      unchecked(rule(9, 'best66.rule'))
    );

    expect(result.attackCmd).toBe('#HL# -r dive.rule');
    expect(result.files).toEqual([10]);
  });
});
