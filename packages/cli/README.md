# shiftcut

CLI for creating, previewing, and rendering HTML video compositions.

## Install

```bash
npm install -g shiftcut
```

Or use directly with npx:

```bash
npx shiftcut <command>
```

**Requirements:** Node.js >= 22, FFmpeg

## Commands

### `init`

Scaffold a new Shiftcut project from a template:

```bash
npx shiftcut init my-video
cd my-video
```

### `preview`

Start the live preview studio in your browser:

```bash
npx shiftcut preview
# Studio running at http://localhost:3002

npx shiftcut preview --port 4567
```

### `render`

Render a composition to MP4. Run from the project directory; the positional
argument is the project directory (not a file), so render the project's
`index.html` directly, or point at a specific composition file with `-c`:

```bash
npx shiftcut render -o output.mp4
npx shiftcut render -c ./my-composition.html -o output.mp4
```

### `lint`

Validate your Shiftcut HTML:

```bash
npx shiftcut lint ./my-composition
npx shiftcut lint ./my-composition --json      # JSON output for CI/tooling
npx shiftcut lint ./my-composition --verbose   # Include info-level findings
```

By default only errors and warnings are shown. Use `--verbose` to also display informational findings (e.g., external script dependency notices). Use `--json` for machine-readable output with `errorCount`, `warningCount`, `infoCount`, and a `findings` array.

### `compositions`

List compositions found in the current project:

```bash
npx shiftcut compositions
```

### `benchmark`

Run rendering benchmarks:

```bash
npx shiftcut benchmark ./my-composition.html
```

### `doctor`

Check your environment for required dependencies (Chrome, FFmpeg, Node.js):

```bash
npx shiftcut doctor
```

### `browser`

Manage the bundled Chrome/Chromium installation:

```bash
npx shiftcut browser
```

### `info`

Print version and environment info:

```bash
npx shiftcut info
```

### `docs`

Open the documentation in your browser:

```bash
npx shiftcut docs
```

### `upgrade`

Check for updates and show upgrade instructions:

```bash
npx shiftcut upgrade
npx shiftcut upgrade --check --json  # machine-readable for agents
```

## Documentation

Full documentation: [shiftcut.verblike.com/packages/cli](https://shiftcut.verblike.com/packages/cli)

## Related packages

- [`@shiftcut/core`](../core) — types, parsers, frame adapters
- [`@shiftcut/engine`](../engine) — rendering engine
- [`@shiftcut/producer`](../producer) — render pipeline
- [`@shiftcut/studio`](../studio) — composition editor UI
