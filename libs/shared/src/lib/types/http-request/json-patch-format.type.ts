export interface JsonPatchFormat {
  op: 'add' | 'remove' | 'replace' | 'move' | 'copy' | 'test';
  path: string;
  value: unknown;
}
