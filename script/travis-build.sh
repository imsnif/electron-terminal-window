#!/usr/bin/env bash

if [[ "$TRAVIS_OS_NAME" == "linux" ]]; then
  export DISPLAY=:99.0
  sleep 3
fi

node --version
npm --version

xvfb-run npm test
