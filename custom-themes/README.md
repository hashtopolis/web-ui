# Custom Themes

Drop `.css` files in this folder to register custom runtime themes.

No additional JSON or TypeScript changes are required for standard theme creation.

For a complete authoring guide, see `HOW_TO_CREATE_CUSTOM_THEME.md`.

This folder ships two example themes — `rainbow.css` and `fallout.css`.

## Enabling custom themes (opt-in)

No custom theme is loaded by default. The built-in `light` and `dark` themes are
always available; everything in this folder is opt-in.

`HASHTOPOLIS_CUSTOM_THEMES_DIR` is the on/off switch: it names the folder the
container scans for `.css` files on startup. When it is unset, no custom themes
are loaded and the app uses the built-in `light`/`dark` themes only.

To enable themes with Docker Compose, set the variable to the container path the
entrypoint should scan and mount your `.css` folder to that same path by
uncommenting both lines in `docker-compose.yml` (or `.devcontainer/docker-compose.yml`):

```yaml
    environment:
      - HASHTOPOLIS_CUSTOM_THEMES_DIR=/custom-themes
    volumes:
      - ./custom-themes:/custom-themes:ro
```

### Baking themes into the image (no runtime mount)

When building your own production image, pass the `CUSTOM_THEMES_DIR` build arg to
copy a folder of `.css` files into the image (the default bakes nothing):

```bash
docker build --target hashtopolis-web-ui-prod \
  --build-arg CUSTOM_THEMES_DIR=custom-themes -t hashtopolis/web-ui .
```

Baked themes are still opt-in at runtime: set
`HASHTOPOLIS_CUSTOM_THEMES_DIR=/custom-themes` to enable them.

## Naming

- File names are converted to a theme id using lowercase kebab-case.
- Example: `Ocean Glow.css` becomes `ocean-glow`.

## Runtime behavior

- When `HASHTOPOLIS_CUSTOM_THEMES_DIR` is set, `docker-entrypoint.sh` scans that
  folder on container startup (otherwise no custom themes are loaded).
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
