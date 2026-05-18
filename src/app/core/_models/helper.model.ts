/**
 * Interface definition for a Helper model
 * @prop meta Could be of type RebuildChunkCacheMeta or RescanGlobalFilesMeta
 */
export interface JHelper<TMeta = RebuildChunkCacheMeta | RescanGlobalFilesMeta> {
  meta: TMeta;
}

/**
 * Interface definition for metadata returned by rebuild chunk cache helper
 */
export interface RebuildChunkCacheMeta {
  Rebuild: string;
  correctedChunks: number;
  correctedHashlists: number;
}

/**
 * Interface definition for metadata returned by rescan global files helper
 */
export interface RescanGlobalFilesMeta {
  Rescan: string;
}
