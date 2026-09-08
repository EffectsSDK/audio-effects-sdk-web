// Entry point for the npm package's type definitions.
//
// Copied to dist/npm/atsvb.d.ts by webpack.mix.js, next to the declaration tree
// that `npm run types` generates into dist/npm/types. Everything a consumer can
// legitimately reference has to be re-exported here: the generated tree is
// reachable only through this barrel.
export { atsvb } from "./types/atsvb";
export { ErrorObject, ErrorType, ErrorCode, ErrorEmitter } from "./types/utils/errorBus";
export {
  ModelType,
  ProcessorType,
  LatencyMode,
  DenoiseStagesOptions,
  DefaultConfig,
  Config,
} from "./types/settings";
export { StudioAudioOptions, EnhancementOptions, EQPreset } from "./types/utils/enhancer/types";
