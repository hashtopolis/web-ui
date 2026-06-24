#!/bin/bash

set -e

environment=${1:-"production"}

# Check if environment variable HASHTOPOLIS_BACKEND_URL is set
# and use it with envsubst to set the backend url in the $app_cfg_base/config.json
function update_app_config {
  app_cfg_base="$1"
  if [ -n "$HASHTOPOLIS_BACKEND_URL" ]; then
    echo "Using HASHTOPOLIS_BACKEND_URL: $HASHTOPOLIS_BACKEND_URL"
    envsubst < ${app_cfg_base}/assets/config.json.example > ${app_cfg_base}/assets/config.json
  fi

  echo "Done configuring up Hashtopolis frontend (env=$environment) at $app_cfg_base/assets/config.json"
}

function sync_custom_themes {
  # Custom themes are opt-in. When HASHTOPOLIS_CUSTOM_THEMES_DIR is unset, do
  # nothing: no manifest is written and the frontend falls back to the built-in
  # light/dark themes when it 404s on the (absent) manifest.
  if [ -z "$HASHTOPOLIS_CUSTOM_THEMES_DIR" ]; then
    return
  fi

  app_cfg_base="$1"
  source_dir="$HASHTOPOLIS_CUSTOM_THEMES_DIR"
  target_css_dir="${app_cfg_base}/assets/custom-themes"
  manifest_dir="${app_cfg_base}/assets/themes"
  manifest_file="${manifest_dir}/custom-themes.json"

  mkdir -p "$target_css_dir"
  mkdir -p "$manifest_dir"

  if [ ! -d "$source_dir" ]; then
    echo "Custom theme source directory not found: $source_dir"
    echo "[]" > "$manifest_file"
    return
  fi

  echo "[" > "$manifest_file"

  first=true
  seen_ids=","

  while IFS= read -r -d '' css_path; do

    file_name="$(basename "$css_path")"
    base_name="${file_name%.*}"
    theme_id="$(echo "$base_name" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+//; s/-+$//')"

    if [ -z "$theme_id" ]; then
      echo "Skipping invalid theme file: $file_name"
      continue
    fi

    if echo "$seen_ids" | grep -q ",$theme_id,"; then
      echo "Skipping duplicate theme id: $theme_id"
      continue
    fi
    seen_ids="${seen_ids}${theme_id},"

    if [ "$css_path" != "$target_css_dir/${theme_id}.css" ]; then
      cp "$css_path" "$target_css_dir/${theme_id}.css"
    fi
    theme_label="$(echo "$base_name" | sed -E 's/[_-]+/ /g; s/[\\"]//g')"

    # Mark the theme dark when its CSS declares a dark color-scheme, so the app
    # can pick dark-mode assets (logo, icon colors, charts) for it.
    if grep -Eiq 'color-scheme[[:space:]]*:[^;]*dark' "$css_path"; then
      is_dark=true
    else
      is_dark=false
    fi

    if [ "$first" = true ]; then
      first=false
    else
      echo "," >> "$manifest_file"
    fi

    cat >> "$manifest_file" <<EOF
  {
    "value": "$theme_id",
    "description": "$theme_label",
    "href": "/assets/custom-themes/${theme_id}.css",
    "icon": "style",
    "isDark": $is_dark
  }
EOF
  done < <(find "$source_dir" -type f -iname '*.css' -print0 | sort -z)

  echo "]" >> "$manifest_file"
  echo "Custom themes synced to $target_css_dir"
}

if [ "$environment" = "development" ]; then
  # Ensure workspace is mounted
  echo -n "Waiting for workspace to be mounted..."
  until [ -f /app/package.json ]
  do
        sleep 5
  done
  echo "DONE"

  # Install/Update required Node.js packages
  export PUPPETEER_SKIP_DOWNLOAD='true'
  npm install

  # Prepare configuration
  update_app_config "/app/src"
  sync_custom_themes "/app/src"

  # Start worker instance
  echo "Starting worker npm..."
  npm start
else
  # Prepare configuration
  update_app_config "/usr/share/nginx/html"
  sync_custom_themes "/usr/share/nginx/html"

  # Start worker instance
  echo "Starting worker nginx..."
  nginx -g 'daemon off;'
fi