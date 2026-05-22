#!/bin/bash

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
  app_cfg_base="$1"
  source_dir="${HASHTOPOLIS_CUSTOM_THEMES_DIR:-/custom-themes}"
  target_css_dir="${app_cfg_base}/assets/custom-themes"
  manifest_dir="${app_cfg_base}/assets/themes"
  manifest_file="${manifest_dir}/custom-themes.json"

  mkdir -p "$target_css_dir"
  mkdir -p "$manifest_dir"

  rm -f "$target_css_dir"/*.css

  echo "[" > "$manifest_file"

  if [ ! -d "$source_dir" ]; then
    echo "]" >> "$manifest_file"
    echo "Custom theme source directory not found: $source_dir"
    return
  fi

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

    cp "$css_path" "$target_css_dir/${theme_id}.css"
    theme_label="$(echo "$base_name" | sed -E 's/[_-]+/ /g; s/\"//g')"

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
    "icon": "style"
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