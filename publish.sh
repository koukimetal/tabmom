#!/bin/sh

rm tabmom.zip
rm -rf dist
yarn build
zip -r tabmom.zip dist
