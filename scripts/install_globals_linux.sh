#!/bin/bash
echo "Installing global NPM modules required to run Logger..."
sudo npm install -g babel-cli babel-preset-es2015 nodemon standard eslint eslint-config-standard eslint-plugin-standard eslint-plugin-promise eslint-plugin-import eslint-plugin-node
echo "Module installation ended."
