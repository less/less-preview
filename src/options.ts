// Compile options the playground exposes, gated by the Less version that
// introduced (`min`, inclusive) or dropped (`max`, exclusive) them.
// Only options meaningful for a single-string browser render live here.

export interface OptionStore {
  strictMath: boolean
  math: string
  strictUnits: boolean
  unitMode: string
  collapseNesting: boolean
  compress: boolean
}

type SwitchKey = { [K in keyof OptionStore]: OptionStore[K] extends boolean ? K : never }[keyof OptionStore]
type SelectKey = Exclude<keyof OptionStore, SwitchKey>

export type OptionDescriptor =
  | { key: SwitchKey; label: string; type: 'switch'; min?: string; max?: string }
  | { key: SelectKey; label: string; type: 'select'; values: string[]; min?: string; max?: string }

export const defaultStore: OptionStore = {
  strictMath: false,
  math: 'parens-division',
  strictUnits: false,
  unitMode: 'preserve',
  collapseNesting: false,
  compress: false
}

// Evidence: `math` replaced `strictMath` in less.js 76c10345 (first tag v3.7.0);
// `unitMode` (strictUnits deprecated alias), `collapseNesting` and the rejection
// of `compress` land in 5.0.0-alpha (packages/less/lib/options.js on `alpha`).
const all: OptionDescriptor[] = [
  { key: 'strictMath', label: 'Strict math', type: 'switch', max: '3.7.0' },
  { key: 'math', label: 'Math mode', type: 'select', values: ['always', 'parens-division', 'parens'], min: '3.7.0' },
  { key: 'strictUnits', label: 'Strict units', type: 'switch', max: '5.0.0' },
  { key: 'unitMode', label: 'Unit mode', type: 'select', values: ['loose', 'strict', 'preserve'], min: '5.0.0' },
  { key: 'collapseNesting', label: 'Collapse nesting', type: 'switch', min: '5.0.0' },
  { key: 'compress', label: 'Minify output (deprecated)', type: 'switch', max: '5.0.0' }
]

// Numeric core only: "5.0.0-alpha.2" compares as 5.0.0; "4.x" as 4.0.0.
// (Option gates are keyed on the release line, so an alpha counts as its release.)
const parse = (v: string) =>
  v.split('-')[0].split('.').map(p => Number(p) || 0)

export const compare = (a: string, b: string) => {
  const [x, y] = [parse(a), parse(b)]
  for (let i = 0; i < 3; i++) {
    if ((x[i] ?? 0) !== (y[i] ?? 0)) return (x[i] ?? 0) - (y[i] ?? 0)
  }
  return 0
}

export const supportedOptions = (version: string) =>
  all.filter(o =>
    (!o.min || compare(version, o.min) >= 0) &&
    (!o.max || compare(version, o.max) < 0)
  )

// The only object that reaches less.render: valid keys for `version`, nothing else.
export const renderOptions = (store: OptionStore, version: string) =>
  Object.fromEntries(supportedOptions(version).map(o => [o.key, store[o.key]]))

// Prerelease-aware: same numeric core, then the prerelease number
// ("5.0.0-alpha.3" >= "5.0.0-alpha.3"; "5.0.0-alpha.2" < "5.0.0-alpha.3").
const prereleaseNumber = (v: string) => v.includes('-') ? Number(v.split('-')[1].split('.').pop()) || 0 : Infinity
export const atLeast = (v: string, min: string) => {
  const core = compare(v, min)
  return core !== 0 ? core > 0 : prereleaseNumber(v) >= prereleaseNumber(min)
}
