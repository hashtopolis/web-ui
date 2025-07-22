/**
 * Section for Estimated Keyspace and Attack Runtime
 *
 * Used in Edit supertask, table column estimated keyspace and attack runtime
 */
declare let options: any;
declare let defaultOptions: any;
declare let parser: any;

/**
 * This function calculates the keyspace using the asset files optparse located in assets folder
 * @param value - Object
 * @param name - files object to extract line count
 * @param cmd - Attack
 * @param attcktype - If true, returns attack type
 * @returns number
 **/
export function calculateKeyspace(
  value: any[],
  name: string,
  cmd: any,
  attcktype?: boolean
): number | number[] | string {
  if (!cmd || !name) {
    return 'Wrong Command';
  }

  // Extract line count values from the array of objects
  const arr = [];
  let mpow = 0;
  if (value.length !== 0) {
    for (let i = 0; i < value.length; i++) {
      arr.push(Number(value[i][name]));
    }
    mpow = arr.reduce((a, i) => a * i);
  } else {
    return '';
  }

  // Reset options to default values
  options = defaultOptions;
  options.ruleFiles = [];
  options.posArgs = [];
  options.unrecognizedFlag = [];

  // Parse the attack command using the specified parser
  let args: any = cmd.replace('hashcat', '');
  args = args.replace(/(-a)(\d)(\s)/, '-a $2 ');
  args = args.replace(/(-\d)(\S+)(\s)/, '$1 $2 ');
  args = args.replace(/\s+/g, ' ');
  args = args.trim();
  args = args.split(/ |=/g);
  parser.parse(args);

  // Helper function: Calculate options for custom character set
  function customCharsetToOptions(mask: string) {
    const numA = (mask.match(/\?a/g) || []).length;
    const numD = (mask.match(/\?d/g) || []).length;
    const numL = (mask.match(/\?l/g) || []).length;
    const numU = (mask.match(/\?u/g) || []).length;
    const numS = (mask.match(/\?s/g) || []).length;
    const numLH = (mask.match(/\?h/g) || []).length;
    const numUH = (mask.match(/\?H/g) || []).length;
    const numB = (mask.match(/\?b/g) || []).length;
    let charsetOptions = 95 * Math.min(1, numA);
    charsetOptions = charsetOptions + 10 * Math.min(1, numD);
    charsetOptions = charsetOptions + 26 * Math.min(1, numL);
    charsetOptions = charsetOptions + 26 * Math.min(1, numU);
    charsetOptions = charsetOptions + 33 * Math.min(1, numS);
    charsetOptions = charsetOptions + 16 * Math.min(1, numLH);
    charsetOptions = charsetOptions + 16 * Math.min(1, numUH);
    charsetOptions = charsetOptions + 256 * Math.min(1, numB);
    // Add single characters that are part of the custom charset
    // we assume no duplicate single characters are present in the custom charset!
    //       i.e. -1 abbc is considered to be a charset of 4 different characters in the calculation
    charsetOptions = charsetOptions + mask.length - 2 * (numA + numD + numL + numU + numS + numLH + numUH + numB);
    return charsetOptions;
  }

  // Helper function: Calculate keyspace based on the mask
  function maskToKeyspace(mask: string) {
    let keyspaceCustomMask = 1;
    // The size of the custom charset equals the result of customCharsetToOptions.
    // This number is multiplied by the number occurrences of the custom mask to get the size of the keyspace formed by the custom masks alone
    if (options.customCharset1 !== '') {
      keyspaceCustomMask =
        keyspaceCustomMask *
        Math.pow(customCharsetToOptions(options.customCharset1), (mask.match(/\?1/g) || []).length);
    }
    if (options.customCharset2 !== '') {
      keyspaceCustomMask =
        keyspaceCustomMask *
        Math.pow(customCharsetToOptions(options.customCharset2), (mask.match(/\?2/g) || []).length);
    }
    if (options.customCharset3 !== '') {
      keyspaceCustomMask =
        keyspaceCustomMask *
        Math.pow(customCharsetToOptions(options.customCharset3), (mask.match(/\?3/g) || []).length);
    }
    if (options.customCharset4 !== '') {
      keyspaceCustomMask =
        keyspaceCustomMask *
        Math.pow(customCharsetToOptions(options.customCharset4), (mask.match(/\?4/g) || []).length);
    }

    let keyspaceRegularMask = 1;

    // compute the keyspace size for the custom charsets separately, and multiply with the keyspace size formed by the regular mask part
    keyspaceRegularMask = Math.pow(95, (mask.match(/\?a/g) || []).length);
    keyspaceRegularMask = keyspaceRegularMask * Math.pow(10, (mask.match(/\?d/g) || []).length);
    keyspaceRegularMask = keyspaceRegularMask * Math.pow(26, (mask.match(/\?l/g) || []).length);
    keyspaceRegularMask = keyspaceRegularMask * Math.pow(26, (mask.match(/\?u/g) || []).length);
    keyspaceRegularMask = keyspaceRegularMask * Math.pow(33, (mask.match(/\?s/g) || []).length);
    keyspaceRegularMask = keyspaceRegularMask * Math.pow(16, (mask.match(/\?h/g) || []).length);
    keyspaceRegularMask = keyspaceRegularMask * Math.pow(16, (mask.match(/\?H/g) || []).length);
    keyspaceRegularMask = keyspaceRegularMask * Math.pow(256, (mask.match(/\?b/g) || []).length);

    return keyspaceRegularMask * keyspaceCustomMask;
  }

  let keyspace: number;
  // Check if it's a bruteforce attack and calculate keyspace accordingly
  if (options.attackType === 3 && mpow >= 0) {
    // compute keyspace for bruteforce attacks
    for (let i = 0; i < options.posArgs.length; i++) {
      const posArg = options.posArgs[i];
      if (posArg.includes('?')) {
        const mask = posArg;
        keyspace = maskToKeyspace(mask);
        // return [keyspace, options.attackType]; // return also attack type
        if (attcktype == true) {
          keyspace = options.attackType;
        }
        return [keyspace];
      }
    }
  }
  // Check if it's a non-bruteforce attack with a positive mpow
  if (mpow > 0 && options.attackType !== 3) {
    if (attcktype == true) {
      mpow = options.attackType;
    }
    return mpow;
  } else {
    // Return null if conditions are not met
    let result = null;
    if (attcktype == true) {
      result = options.attackType;
    }
    return result;
  }
}
