/**
 * Files values and label
 **/
import { FileType } from '@models/file.model';

export const fileFormat = [
  { value: FileType.WORDLIST, label: 'Wordlist' },
  { value: FileType.RULES, label: 'Rule' },
  { value: FileType.OTHER, label: 'Other' }
];
