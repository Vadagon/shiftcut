export function studioProxyEnv(
  autoProxy: boolean,
  baseEnv: NodeJS.ProcessEnv = process.env,
): NodeJS.ProcessEnv {
  return {
    ...baseEnv,
    SHIFTCUT_AUTO_PROXY: autoProxy ? "true" : "false",
  };
}
