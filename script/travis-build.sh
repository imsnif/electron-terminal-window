#!/usr/bin/env bash

node --version
npm --version

xvfb-run -s "-screen 0 640x480x8" npm test
