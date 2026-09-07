#!/bin/bash

Help() {
  echo "Signs an XPI file."
  echo
  echo "Syntax: sign-xpi.sh [options]"
  echo "options:"
  echo "-h                   Print this Help."
  echo "-k, --api-key        Set api key."
  echo "-p, --api-proxy      Set api secret."
  echo "-s, --api-secret     Set proxy."
  echo
}

if options=$(getopt -o hk:p:s: --long help,api-key:,api-proxy:,api-secret: -- "$@"); then
  eval set -- "$options"
  while true; do
    case "$1" in
    -h | --help)
      Help
      ;;
    -k | --api-key)
      shift
      API_KEY=$1
      ;;
    -p | --api-proxy)
      shift
      API_PROXY=$1
      ;;
    -s | --api-secret)
      shift
      API_SECRET=$1
      ;;
    --)
      shift
      break
      ;;
    esac
    shift
  done

  # Use environment variables when arguments are not provided.
  API_KEY="${API_KEY:-${WEB_EXT_API_KEY:-}}"
  API_SECRET="${API_SECRET:-${WEB_EXT_API_SECRET:-}}"

  # API key and secret are required.
  if [[ -z "$API_KEY" ]]; then
    echo "Error: API key is not provided."
    echo "Use --api-key or set WEB_EXT_API_KEY."
    exit 1
  fi

  if [[ -z "$API_SECRET" ]]; then
    echo "Error: API secret is not provided."
    echo "Use --api-secret or set WEB_EXT_API_SECRET."
    exit 1
  fi

  pnpm run build:firefox
  web-ext sign -c web-ext-config.cjs -s extension/firefox -a dist/firefox --channel=unlisted --api-key="$API_KEY" --api-secret="$API_SECRET" --api-proxy="$API_PROXY"
  exit 0

else
  exit 1
fi
