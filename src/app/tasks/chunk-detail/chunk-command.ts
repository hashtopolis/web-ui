/**
 * Builds the hashcat command line needed to re-run a single chunk by hand.
 *
 * Mirrors what the Python agent does in `HashcatCracker.build_command` / `build_pipe_command`:
 * the server hands out the task's attack command plus ` --hash-type=<id> <agent cmdPars>`, and the
 * agent adds `-s <skip> -l <length>` and swaps the hashlist alias for the downloaded hashlist file.
 * Paths are laid out like an agent's data directory (`hashlists/<id>`, `files/<name>`), so the
 * command can be run from an agent's working directory as-is.
 */
export interface ChunkCommandInput {
  skip: number;
  length: number;
  attackCmd: string;
  hashlistAlias: string;
  hashlistId: number | undefined;
  hashTypeId: number | undefined;
  /** File names attached to the task; occurrences in the attack command get the `files/` prefix. */
  fileNames: string[];
  /** Extra command line parameters configured on the agent that ran the chunk. */
  agentCmdPars?: string | undefined;
  /** Use a `--stdout` pipe like the agent does when the task enforces piping. */
  usePipe?: boolean;
  /** Add the flags the agent itself passes (machine readable status, outfile, no potfile...). */
  agentFlags?: boolean;
  statusTimer?: number | undefined;
  binary?: string;
}

const HASHLIST_DIR = 'hashlists';
const FILES_DIR = 'files';

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Prefix every whole-word occurrence of a task file name with the files directory. */
function prefixFiles(attackCmd: string, fileNames: string[]): string {
  return fileNames.reduce((cmd, name) => {
    if (!name) {
      return cmd;
    }
    const pattern = new RegExp(`(^|\\s|["'])${escapeRegExp(name)}(?=$|\\s|["'])`, 'g');
    return cmd.replace(pattern, `$1${FILES_DIR}/${name}`);
  }, attackCmd);
}

function squash(parts: (string | undefined | false)[]): string {
  return parts
    .filter((part): part is string => !!part && part.trim().length > 0)
    .map((part) => part.trim())
    .join(' ');
}

export function buildChunkCommand(input: ChunkCommandInput): string {
  const binary = input.binary ?? 'hashcat';
  const hashlistFile =
    input.hashlistId !== undefined ? `${HASHLIST_DIR}/${input.hashlistId}` : `${HASHLIST_DIR}/<hashlist>`;
  const hashType = input.hashTypeId !== undefined ? `--hash-type=${input.hashTypeId}` : '--hash-type=<type>';
  const timer = input.statusTimer && input.statusTimer > 0 ? input.statusTimer : 5;
  const range = `-s ${input.skip} -l ${input.length}`;
  const attack = prefixFiles(input.attackCmd ?? '', input.fileNames);
  const alias = input.hashlistAlias ? new RegExp(escapeRegExp(input.hashlistAlias), 'g') : null;

  const agentFlags = input.agentFlags
    ? [
        '--machine-readable',
        '--quiet',
        '--status',
        '--restore-disable',
        '--session=hashtopolis',
        `--status-timer ${timer}`,
        `-o "${hashlistFile}.out"`,
        '--outfile-format=1,2,3,4',
        '--potfile-disable'
      ].join(' ')
    : '';

  if (input.usePipe) {
    const generator = alias ? attack.replace(alias, '') : attack;
    const left = squash([binary, '--stdout', range, generator]);
    const right = squash([binary, agentFlags, `"${hashlistFile}"`, hashType, input.agentCmdPars]);
    return `${left} | ${right}`;
  }

  const withHashlist = alias ? attack.replace(alias, `"${hashlistFile}"`) : `"${hashlistFile}" ${attack}`;
  return squash([binary, agentFlags, range, withHashlist, hashType, input.agentCmdPars]);
}
