# site/images

## apex-logo.png  — REQUIRED, and it must be YOUR real file

Save the gold APEX logo you already own here as `site/images/apex-logo.png`.

**Do not generate it.** A regenerated wordmark is a hard-fail defect under
`docs/fidelity-gate.md` — the same rule we apply to client logos applies to
ours. Until the real file is here the nav falls back to a text wordmark, which
is correct behavior, not a placeholder to be filled with a generated image.

## portfolio/

| Folder | Purpose |
|---|---|
| `food/` | Plated and in-process food. Leads the site — strongest founder advantage. |
| `packaged-food/` | Jars, bottles, tins, bags. The primary ICP's category. |
| `beverage/` | Cold brew, cider, soda, cans and bottles. |
| `consumer-products/` | Non-food packaged goods shot to the same standard. |
| `hospitality/` | Kitchens, passes, dining rooms, people working. |

Filenames are referenced directly by `site/index.html`. They are listed in
`docs/portfolio-generation-prompts.md` with the exact prompt for each. Do not
rename a file without updating the site.

## Web optimisation targets

| Use | Longest edge | Target size | Format |
|---|---|---|---|
| Hero (16:9) | 2000px | under 400KB | JPEG q80 |
| Portfolio card (4:5) | 1200px | under 250KB | JPEG q80 |
| Band / about | 1600px | under 300KB | JPEG q80 |

Keep unoptimised originals outside the repo, or in an untracked `originals/`
folder. The repo carries web-ready files only.
