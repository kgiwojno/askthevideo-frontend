#!/usr/bin/env bash
set -e

git pull
npm run build
cp -r dist/* ../askthevideo/frontend/


