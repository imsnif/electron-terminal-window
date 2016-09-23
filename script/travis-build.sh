#!/usr/bin/env bash

if [[ "$TRAVIS_OS_NAME" == "linux" ]]; then
  export DISPLAY=:99.0
fi

node --version
npm --version

./node_modules/.bin/electron-rebuild

xvfb-run -s "-screen 0 640x480x8" npm run test-travis
