import { ChunkCommandInput, buildChunkCommand } from '@src/app/tasks/chunk-detail/chunk-command';

describe('buildChunkCommand', () => {
  const base: ChunkCommandInput = {
    skip: 100,
    length: 50,
    attackCmd: '#HL# -a0 rockyou.txt -r best64.rule',
    hashlistAlias: '#HL#',
    hashlistId: 7,
    hashTypeId: 1000,
    fileNames: ['rockyou.txt', 'best64.rule']
  };

  it('replaces the hashlist alias, prefixes files and adds the chunk range', () => {
    expect(buildChunkCommand(base)).toBe(
      'hashcat -s 100 -l 50 "hashlists/7" -a0 files/rockyou.txt -r files/best64.rule --hash-type=1000'
    );
  });

  it('appends the agent command line parameters', () => {
    expect(buildChunkCommand({ ...base, agentCmdPars: '-w 3' })).toMatch(/--hash-type=1000 -w 3$/);
  });

  it('adds the flags the agent passes when requested', () => {
    const cmd = buildChunkCommand({ ...base, agentFlags: true, statusTimer: 10 });
    expect(cmd).toContain('--status-timer 10');
    expect(cmd).toContain('--potfile-disable');
    expect(cmd).toContain('-o "hashlists/7.out"');
  });

  it('builds a stdout pipe for tasks that enforce piping', () => {
    expect(buildChunkCommand({ ...base, usePipe: true })).toBe(
      'hashcat --stdout -s 100 -l 50 -a0 files/rockyou.txt -r files/best64.rule | hashcat "hashlists/7" --hash-type=1000'
    );
  });

  it('does not prefix partial file name matches', () => {
    const cmd = buildChunkCommand({ ...base, attackCmd: '#HL# -a0 my-rockyou.txt', fileNames: ['rockyou.txt'] });
    expect(cmd).toContain(' my-rockyou.txt');
  });
});
