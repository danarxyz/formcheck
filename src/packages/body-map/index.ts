/**
 * Entry point of the body-map package: how Target Muscles become coloured
 * regions. Server-safe. The React component lives in the `BodyMap.tsx`
 * entry point so this file stays importable from tests and server code.
 */
export { highlightFor, MUSCLE_REGIONS, type Region, type RegionHighlight } from "./lib/regions";
