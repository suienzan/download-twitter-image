#!/bin/bash

rm -rf dist
mkdir -p dist
pnpm run build
get_json_value_from_line() {
  head -1 | awk -F: '{ print $2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]'
}
PACKAGE_VERSION=$(cat package.json | grep version | get_json_value_from_line)
PACKAGE_NAME=$(cat package.json | grep name | head -1 | get_json_value_from_line)
npx crx pack extension -o dist/"$PACKAGE_NAME"-"$PACKAGE_VERSION".crx -p key.pem
echo "Package created: dist/$PACKAGE_NAME-$PACKAGE_VERSION.crx"
