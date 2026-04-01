#!/bin/bash

rm -rf dist/chrome
mkdir -p dist/chrome
pnpm run build:chrome
PACKAGE_VERSION=$(node -p "require('./package.json').version")
PACKAGE_NAME=$(node -p "require('./package.json').name")
npx crx3 extension/chrome --crx dist/chrome/"$PACKAGE_NAME"-"$PACKAGE_VERSION".crx --key key.pem
echo "Package created: dist/chrome/$PACKAGE_NAME-$PACKAGE_VERSION.crx"
