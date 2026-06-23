# Custom Themes

Drop `.css` files in this folder to register custom runtime themes.

No additional JSON or TypeScript changes are required for standard theme creation.

For a complete authoring guide, see `HOW_TO_CREATE_CUSTOM_THEME.md`.

This folder ships two example themes — `rainbow.css` and `fallout.css`.

## Enabling custom themes (opt-in)

No custom theme is loaded by default. The built-in `light` and `dark` themes are
always available; everything in this folder is opt-in. To enable it, mount this
folder into the container at `/custom-themes` by uncommenting the volume line in
`docker-compose.yml` (or `.devcontainer/docker-compose.yml`):

```yaml
    volumes:
      - ${HASHTOPOLIS_CUSTOM_THEMES_DIR:-./custom-themes}:/custom-themes:ro
```

Set `HASHTOPOLIS_CUSTOM_THEMES_DIR` to load themes from any host folder instead of
the bundled `./custom-themes`, without editing the compose file:

```bash
HASHTOPOLIS_CUSTOM_THEMES_DIR=/srv/my-themes docker compose up -d
```

### Baking themes into the image (no runtime mount)

When building your own production image, pass the `CUSTOM_THEMES_DIR` build arg to
copy a folder of `.css` files into the image; they are registered on startup just
like a mounted folder:

```bash
docker build --target hashtopolis-web-ui-prod \
  --build-arg CUSTOM_THEMES_DIR=custom-themes -t hashtopolis/web-ui .
```

A runtime `/custom-themes` mount, if present, takes precedence over baked themes.

## Naming

- File names are converted to a theme id using lowercase kebab-case.
- Example: `Ocean Glow.css` becomes `ocean-glow`.

## Runtime behavior

- When mounted, `docker-entrypoint.sh` scans this folder on container startup.
- Valid CSS files are copied to `/assets/custom-themes/`.
- A manifest is generated at `/assets/themes/custom-themes.json`.
- The frontend reads the manifest and adds the themes to the selectors.
- Theme menu icons are currently auto-set to `style` for custom themes.
- A theme whose CSS declares `color-scheme: dark` is flagged dark, so the app uses
  its dark-mode logo, icon colors, and chart palettes.

## Reserved IDs

These ids are built-in and cannot be overridden by custom files:

- `light`
- `dark`

## Need help generating a theme?

Use the prompt template at the end of `HOW_TO_CREATE_CUSTOM_THEME.md` with your favorite LLM.
