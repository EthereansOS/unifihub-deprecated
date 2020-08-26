#! /bin/bash

sed -i -E 's/(\(#.*)/\L\1\E/g' md-build/stableCoin/**/*.md
