/**
 * Parses a line in hcmask format into the mask and custom charset flags.
 *
 * hcmask format: [charset1,][charset2,][charset3,][charset4,]mask
 * - Up to 4 custom charsets can precede the mask, separated by commas.
 * - The last comma-separated field is always the mask itself.
 * - If there are no commas, the entire line is treated as a plain mask.
 *
 * Examples:
 *   "?d?d?d?d"               → { mask: "?d?d?d?d", charsetFlags: "" }
 *   "?l?d,?1?1?1?1?1"       → { mask: "?1?1?1?1?1", charsetFlags: "-1 ?l?d" }
 *   "?u?s,?l?d,?1?2?1?2"   → { mask: "?1?2?1?2", charsetFlags: "-1 ?u?s -2 ?l?d" }
 */
export function parseHcmaskLine(line: string): {
  mask: string;
  charsetFlags: string;
} {
  const parts = line.split(',');

  if (parts.length <= 1) {
    return { mask: line, charsetFlags: '' };
  }

  // Max 4 custom charsets; last field is the mask
  const maxCharsets = Math.min(parts.length - 1, 4);
  const mask = parts.slice(maxCharsets).join(',');
  const charsetFlags = parts
    .slice(0, maxCharsets)
    .map((cs, i) => `-${i + 1} ${cs}`)
    .join(' ');

  return { mask, charsetFlags };
}
