#!/usr/bin/env bash

node --version
npm --version

./node_modules/.bin/electron-rebuild

xvfb-run -s "-screen 0 640x480x8" npm run test-travis
