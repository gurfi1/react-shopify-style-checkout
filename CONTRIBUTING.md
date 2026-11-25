# Contributing

Issues and pull requests are welcome from anyone. You do not need to ask first for a small fix. For something larger, opening an issue to talk it through saves work on both sides.

## Ways to help that need no code

- **Test it somewhere it has not been tested**: Firefox, a screen reader, a right-to-left language. Report what you find, including "it works".
- **Report a bug.** Say which component, which browser, what you did and what happened. A screenshot helps.
- **Point out a mistake in the docs.**

## Set up

```bash
git clone https://github.com/gurfi1/react-shopify-style-checkout.git
cd react-shopify-style-checkout
npm install
npm run dev
```

You need Node 24 or newer, which is what CI runs.

If you add or update a dependency, regenerate the lockfile from a clean state (`rm -rf node_modules package-lock.json && npm install`). A lockfile updated in place on one operating system can leave out packages another one needs, and `npm ci` then fails in CI.

## How the project is laid out

| Folder | Holds |
|---|---|
| `src/theme` | `Theme`: the design tokens |
| `src/primitives/<Name>` | One building block per folder |
| `src/checkout/<Name>` | One checkout block per folder |
| `src/hooks`, `src/lib` | Behaviour with no interface; `lib` has the unit tests |
| `src/icons` | The icon set |
| `demo` | The demo site and its pretend back end |
| `docs` | Topic pages, written by hand |
| `scripts` | The docs generator and the screenshot script |

Each component folder contains:

| File | Purpose |
|---|---|
| `Name.tsx` | The component, with a doc comment on it and on each prop |
| `Name.module.css` | Its styles. Class names are local to the file |
| `Name.demo.tsx` | Its title, summary, usage code, props table and a live example of every state |
| `README.md` | **Generated.** Do not edit it; edit the demo file and run `npm run docs` |

## The rules of the house

1. **One folder per component.** A component imports only `Theme` tokens and the other components it genuinely needs, so its folder can be copied out on its own.
2. **No new runtime dependencies.** `react` and `react-dom` are the whole list.
3. **Tokens, not values.** Colours, corners, shadows, durations and curves come from the tokens in `src/theme/Theme.module.css`.
4. **Only the states the design has.** Components reproduce the checkout they are modelled on. A new variant (another banner colour, a third button size) needs a reason beyond "it might be useful".
5. **Nothing store-specific in `src/`.** Products, policies and prices belong in `demo/` or in props.
6. **Every word is a label.** Text a shopper reads goes in `src/labels.ts`, so it can be translated.
7. **Both text directions.** Use logical properties (`margin-inline-start`, `inset-inline-end`, `text-align: start`), never `left` or `right`. Wrap text that comes from data (a name, an address, a price) in `<bdi>`. Check your change at `?dir=rtl`.
8. **Keyboard and screen reader first.** Use native elements where one exists. New interactive pieces need a visible focus state and an accessible name.

## Before you open a pull request

```bash
npm run lint
npm run typecheck
npm test
npm run docs        # regenerate component READMEs if you touched a demo file or a doc comment
npm run build
```

CI runs the same commands and fails if a generated README is out of date.

In the pull request, say what changed and how you checked it. If it changes how something looks or moves, include a screenshot or a short recording.

## Adding a component

1. Create `src/primitives/Name/` or `src/checkout/Name/` with the three files above. Copying a small existing folder, such as `Divider`, is the quickest start.
2. Export it from `src/index.ts`.
3. Run `npm run docs`. Its README and its row in the index appear.
4. Check it in the gallery at `#/components` or `#/blocks`.

## Changing wording or adding a translation

Labels live in `src/labels.ts`. Add a key there with its English text, then use it through `useLabels()`. Complete translations are welcome as files in `src/locales/`, following `he.ts`: one object typed as `Labels`, so a missing label is a compile error.

## Licence

By contributing you agree that your contribution is released under the [MIT licence](LICENSE). Do not add artwork, fonts or code you do not have the right to share, and do not copy code or assets from Shopify's checkout.

## Conduct

Be kind and assume good faith. See the [code of conduct](CODE_OF_CONDUCT.md).
