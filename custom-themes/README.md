# Custom Themes

Drop `.css` files in this folder to register custom runtime themes.
You can also place related assets here (for example `.png`, `.svg`, `.jpg`, `.webp`, `.woff2`).

No additional JSON or TypeScript changes are required for standard theme creation.

For a complete authoring guide, see `HOW_TO_CREATE_CUSTOM_THEME.md`.

## Naming

- File names are converted to a theme id using lowercase kebab-case.
- Example: `Ocean Glow.css` becomes `ocean-glow`.

## Runtime behavior

- On container startup, `docker-entrypoint.sh` scans this folder.
- Valid CSS files are copied to `/assets/custom-themes/`.
- Non-CSS files are also copied to `/assets/custom-themes/` unchanged.
- A manifest is generated at `/assets/themes/custom-themes.json`.
- The frontend reads the manifest and adds the themes to the selectors.
- Theme menu icons are currently auto-set to `style` for custom themes.

## Referencing assets in theme CSS

- Put the asset file next to your theme CSS in this folder.
- Reference it with an absolute URL in CSS:
	- `/assets/custom-themes/<file-name>`
- Example:
	- `--shell-frame-image: url('/assets/custom-themes/europol_logo.png');`

## Reserved IDs

These ids are built-in and cannot be overridden by custom files:

- `light`
- `dark`
- `fallout`

## Need help generating a theme?

Use the prompt template at the end of `HOW_TO_CREATE_CUSTOM_THEME.md` with your favorite LLM.
