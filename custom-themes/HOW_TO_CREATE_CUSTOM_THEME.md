# Custom Theme Authoring Guide

This project supports runtime custom themes from CSS files.

For normal usage, custom theme creation is intentionally low-complexity: add one CSS file and recreate the container.

## 1) Add a CSS file

Place a `.css` file in the `custom-themes` folder.

Examples:

- `custom-themes/ocean.css`
- `custom-themes/cyber-night.css`

The file name is converted to the theme id using lowercase kebab-case.

- `Ocean Night.css` -> `ocean-night`

## 2) Define your theme scope

Use the generated id as a body class in the format `.<theme-id>-theme`.

Example for `ocean.css`:

```css
.ocean-theme {
  --background: #07131f;
  --foreground: #d9f2ff;
  --primary: #4db5ff;
  --border: rgba(77, 181, 255, 0.35);
  color-scheme: dark;
}
```

At minimum, define the color tokens your components rely on.

## 3) Recreate container

When the container starts, `docker-entrypoint.sh` scans `custom-themes`, copies CSS files into served assets, and generates a manifest.

Apply changes with:

```bash
docker compose up -d --build --force-recreate
```

If your stack is already running and mounted correctly, a restart may be enough:

```bash
docker compose restart
```

## 4) Verify in browser

Open:

- `/assets/themes/custom-themes.json`
- `/assets/custom-themes/<theme-id>.css`

If both are available, the theme appears in theme selectors.

## Notes

- Custom theme ids must match `^[a-z0-9-]+$`.
- Built-in ids are reserved and ignored in custom manifest: `light`, `dark`.
- Use absolute URLs in CSS for assets, for example `/assets/img/...`.
- Custom menu icons are currently generated as `style` by default.
- Do not add JavaScript or TypeScript to create a theme unless you are extending platform behavior.

## LLM Prompt Template

Copy and adapt this prompt when asking an LLM to generate a new theme CSS file.

```text
Generate a single CSS file for a Hashtopolis custom theme.

Requirements:
- Output CSS only, no markdown.
- Use this class selector exactly: .<theme-id>-theme
- Define all variables below with visually coherent values:
  --background
  --muted
  --well
  --card
  --card-hover
  --input
  --sidebar
  --foreground
  --muted-foreground
  --subtle-foreground
  --heading-foreground
  --primary
  --primary-hover
  --primary-muted
  --primary-foreground
  --secondary
  --border
  --border-strong
  --border-faint
  --surface-faint
  --surface-soft
  --surface-soft-hover
  --cell-hover
  --success
  --warning
  --destructive
  --info
  --link
  --link-hover
  --success-bg
  --destructive-bg
  --info-bg
  --header
  --shell-frame-image
  --brand-backdrop
  --shadow-sm
  --shadow-md
  --shadow-lg
  --gradient-accent
- Include color-scheme: dark; or color-scheme: light; to match the palette.
- Keep contrast accessible for body text and headings.
- Avoid changing any selector outside .<theme-id>-theme.

Theme request:
- Theme id: <theme-id>
- Mood/style: <describe visual direction>
- Preferred primary hue: <color>
- Dark or light: <dark|light>
```

## Example Output

This is the kind of CSS structure the prompt should generate.

```css
.ocean-night-theme {
  --background: #06131f;
  --muted: #0d1d2c;
  --well: #10263a;
  --card: rgba(255, 255, 255, 0.05);
  --card-hover: rgba(255, 255, 255, 0.09);
  --input: rgba(255, 255, 255, 0.06);
  --sidebar: #081520;

  --foreground: #e6f4ff;
  --muted-foreground: rgba(230, 244, 255, 0.75);
  --subtle-foreground: rgba(230, 244, 255, 0.55);
  --heading-foreground: #ffffff;

  --primary: #4db5ff;
  --primary-hover: #7ac8ff;
  --primary-muted: rgba(77, 181, 255, 0.2);
  --primary-foreground: #04111b;
  --secondary: #7df9ff;

  --border: rgba(77, 181, 255, 0.25);
  --border-strong: rgba(77, 181, 255, 0.45);
  --border-faint: rgba(77, 181, 255, 0.15);

  --surface-faint: rgba(255, 255, 255, 0.03);
  --surface-soft: rgba(255, 255, 255, 0.06);
  --surface-soft-hover: rgba(255, 255, 255, 0.1);

  --cell-hover: rgba(77, 181, 255, 0.16);

  --success: #76e39b;
  --warning: #ffd26a;
  --destructive: #ff7f96;
  --info: #7df9ff;
  --link: #7df9ff;
  --link-hover: #b7fdff;

  --success-bg: color-mix(in oklch, var(--success) 18%, var(--well));
  --destructive-bg: color-mix(in oklch, var(--destructive) 18%, var(--well));
  --info-bg: color-mix(in oklch, var(--info) 18%, var(--well));

  --header: rgba(6, 19, 31, 0.72);
  --shell-frame-image: linear-gradient(135deg, rgba(77, 181, 255, 0.18), rgba(125, 249, 255, 0.08));
  --brand-backdrop: #4db5ff;

  --shadow-sm: none;
  --shadow-md: 0 3px 12px rgba(3, 11, 20, 0.42);
  --shadow-lg: 0 10px 30px rgba(3, 11, 20, 0.58);

  --gradient-accent: linear-gradient(130deg, #4db5ff 0%, #7df9ff 100%);

  color-scheme: dark;
}
```
