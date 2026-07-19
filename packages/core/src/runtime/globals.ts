export interface HFDebugSurface {
  __hfDebug?: boolean;
  __SHIFTCUT_DEBUG?: boolean;
  __hf?: {
    onSwallowed?: (event: { label: string; error: unknown }) => void;
  };
}

export function getDebugSurface(): HFDebugSurface {
  return globalThis as HFDebugSurface;
}
