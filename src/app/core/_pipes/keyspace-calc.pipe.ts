import {
  PipeTransform,
  Pipe
} from '@angular/core';

/**
 * This function calculates the keyspace using the asset files optparse located in assets folder
 * @param value - Object
 * @param object - files object to extract line count
 * @param cmd - Attack
 * Usage:
 *   object | keyspace:'objectname':'cmd'
 * Example:
 *   {{ object | keyspace:'lineCount':'cmd' }}
 * @returns number
**/
declare var options: any;
declare var defaultOptions: any;
declare var parser: any;

@Pipe({
  name: 'keyspace'
})

export class KeyspaceCalcPipe implements PipeTransform {

  transform(value: any[], name: string , cmd: any) {
      if (value.length === 0 || !name) {
        return 'No data';
      }
      // Iterate over files and get file count
      var arr = [];
      for(let i=0; i < value.length; i++){
        arr.push(+value[i][name]);
      }
      var mpow = arr.reduce((a, i) => a * i);
      // resetting the options
      options = defaultOptions;
      options.ruleFiles = [];
      options.posArgs = [];
      options.unrecognizedFlag = [];
      // example cmd = "hashcat #HL# -a3 ?d?d?d?d"
      // Ideally the opt-parser itself works for '-a3' instead of requiring a space as in '-a 3' to parse attackType
      let args: any = cmd.replace('hashcat', '');
      args = args.replace(/(-a)(\d)(\s)/,"-a $2 "); // ensures that "-a3" becomes a valid attack mode: the opt-parser does not approve it (yet)
      args = args.replace(/(-\d)(\S+)(\s)/,"$1 $2 "); // ensures that "-1?l?d" becomes a valid customCharset: the opt-parser does not approve it (yet)
      args = args.replace(/\s+/g, ' '); // ensures that multiple consecutive spaces are reduced to a single space
      args = args.trim();
      args = args.split(/ |=/g);
      parser.parse(args);
      function customCharsetToOptions(mask: string) {
          let numA  = (mask.match(/\?a/g) || []).length;
          let numD  = (mask.match(/\?d/g) || []).length;
          let numL  = (mask.match(/\?l/g) || []).length;
          let numU  = (mask.match(/\?u/g) || []).length;
          let numS  = (mask.match(/\?s/g) || []).length;
          let numLH = (mask.match(/\?h/g) || []).length;
          let numUH = (mask.match(/\?H/g) || []).length;
          let numB  = (mask.match(/\?b/g) || []).length;
          var charsetOptions = 95 * Math.min(1, numA);
          charsetOptions = charsetOptions + 10 * Math.min(1, numD);
          charsetOptions = charsetOptions + 26 * Math.min(1, numL);
          charsetOptions = charsetOptions + 26 * Math.min(1, numU);
          charsetOptions = charsetOptions + 33 * Math.min(1, numS);
          charsetOptions = charsetOptions + 16 * Math.min(1, numLH);
          charsetOptions = charsetOptions + 16 * Math.min(1, numUH);
          charsetOptions = charsetOptions + 256 * Math.min(1, numB);
          // add single characters that are part of the custom charset
          // we assume no duplicate single characters are present in the custom charset!
          //       i.e. -1 abbc is considered to be a charset of 4 different characters in the calculation
          charsetOptions = charsetOptions + mask.length - 2 * (numA + numD + numL + numU + numS + numLH + numUH + numB);
          // console.log("mask = " + mask + " this is " + charsetOptions+ " many options")
          return charsetOptions;
      }

      function maskToKeyspace(mask: string) {
          var keyspaceCustomMask = 1;
          // The size of the custom charset equals the result of customCharsetToOptions.
          // This number is multiplied by the number occurrences of the custom mask to get the size of the keyspace formed by the custom masks alone
          if (options.customCharset1 !== "")
              {
                  keyspaceCustomMask = keyspaceCustomMask * Math.pow(customCharsetToOptions(options.customCharset1), (mask.match(/\?1/g) || []).length);}
          if (options.customCharset2 !== "")
              {
                  keyspaceCustomMask = keyspaceCustomMask * Math.pow(customCharsetToOptions(options.customCharset2), (mask.match(/\?2/g) || []).length);}
          if (options.customCharset3 !== "")
              {
                  keyspaceCustomMask = keyspaceCustomMask * Math.pow(customCharsetToOptions(options.customCharset3), (mask.match(/\?3/g) || []).length);}
          if (options.customCharset4 !== "")
              {
                  keyspaceCustomMask = keyspaceCustomMask * Math.pow(customCharsetToOptions(options.customCharset4), (mask.match(/\?4/g) || []).length);}

          var keyspaceRegularMask = 1;

          // compute the keyspace size for the custom charsets separately, and multiply with the keyspace size formed by the regular mask part
          keyspaceRegularMask = Math.pow(95, (mask.match(/\?a/g) || []).length);
          keyspaceRegularMask = keyspaceRegularMask * Math.pow(10, (mask.match(/\?d/g) || []).length);
          keyspaceRegularMask = keyspaceRegularMask * Math.pow(26, (mask.match(/\?l/g) || []).length);
          keyspaceRegularMask = keyspaceRegularMask * Math.pow(26, (mask.match(/\?u/g) || []).length);
          keyspaceRegularMask = keyspaceRegularMask * Math.pow(33, (mask.match(/\?s/g) || []).length);
          keyspaceRegularMask = keyspaceRegularMask * Math.pow(16, (mask.match(/\?h/g) || []).length);
          keyspaceRegularMask = keyspaceRegularMask * Math.pow(16, (mask.match(/\?H/g) || []).length);
          keyspaceRegularMask = keyspaceRegularMask * Math.pow(256, (mask.match(/\?b/g) || []).length);
          // console.log("total keyspace: "+keyspaceRegularMask +" * "+ keyspaceCustomMask);

          return keyspaceRegularMask * keyspaceCustomMask;
      }

      var keyspace: number;
      if (options.attackType === 3 && mpow > 1) {
          // compute keyspace for bruteforce attacks
          for (var i = 0; i < options.posArgs.length; i++) {
              let posArg = options.posArgs[i];
              if (posArg.includes("?")) {
                  let mask = posArg;
                  keyspace = maskToKeyspace(mask);
                  // return [keyspace, options.attackType]; // return also attack type
                  return [keyspace];
              }
          }
      }
      if(mpow > 0 && options.attackType !== 3){
        return mpow;
      }else{
        return [null]
      }
  }
}
