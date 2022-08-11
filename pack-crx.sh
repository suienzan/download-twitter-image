#!/bin/bash

rm -rf dist/chrome
mkdir -p dist/chrome
pnpm run build:chrome
get_json_value_from_line() {
  head -1 | awk -F: '{ print $2 }' | sed 's/[\",]//g' | tr -d '[:space:]'
}
PACKAGE_VERSION=$(grep <package.json version | get_json_value_from_line)
PACKAGE_NAME=$(grep <package.json name | head -1 | get_json_value_from_line)
npx crx pack extension/chrome -o dist/chrome/"$PACKAGE_NAME"-"$PACKAGE_VERSION".crx -p key.pem
echo "Package created: dist/chrome/$PACKAGE_NAME-$PACKAGE_VERSION.crx"
