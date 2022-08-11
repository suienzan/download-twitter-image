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
      API_SERCET=$1
      ;;
    --)
      shift
      break
      ;;
    esac
    shift
  done

  pnpm run build:firefox
  web-ext sign -c web-ext-config.cjs -s extension/firefox -a dist/firefox --channel=unlisted --api-key="$API_KEY" --api-secret="$API_SERCET" --api-proxy="$API_PROXY"
  exit 0

else
  exit 1
fi
