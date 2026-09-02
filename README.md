# less-preview

> Less Preview

## Build Setup

``` bash
# install dependencies
$ pnpm install

# serve with hot reload at localhost:3000
$ pnpm dev

# build for production and launch server
$ pnpm build
$ pnpm preview
```

## Deployment

Deployment is automated. Merging to `master` triggers the
[Deploy to GitHub Pages](.github/workflows/deploy.yml) workflow, which builds
the site and publishes it to GitHub Pages via GitHub Actions.

**Do not hand-build or commit the `docs/` output.** The workflow rebuilds it on
every push to `master`.

Every pull request also runs [CI](.github/workflows/ci.yml) (`pnpm build`, which
includes `vue-tsc` type checking) as a required gate.

### One-time maintainer step

The automated deploy publishes through the **GitHub Actions** Pages source, but
the repo is still configured for the legacy "deploy from a branch" (`/docs`)
source. A maintainer must flip it once, in **Settings → Pages → Build and
deployment → Source → GitHub Actions**, or via the API:

``` bash
gh api -X PUT repos/less/less-preview/pages -f build_type=workflow
```

Until that flip happens the committed `docs/` folder is left in place so the
live site keeps serving. Once the flip is done and a deploy has gone green, a
follow-up change should stop tracking build output:

``` bash
echo "docs/" >> .gitignore
git rm -r --cached docs
```
