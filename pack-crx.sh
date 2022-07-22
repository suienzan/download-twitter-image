#!/bin/bash

rm -rf dist
mkdir -p dist
pnpm run build
PACKAGE_VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[\",]//g' | tr -d '[[:space:]]') &&
npx crx pack extension -o dist/download-twitter-image-"$PACKAGE_VERSION".crx -p key.pem
