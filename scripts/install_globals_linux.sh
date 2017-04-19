#!/bin/bash
echo "Installing global NPM modules required to run Logger..."
echo "In order to install, you need sudo permissions."
while true; do
    read -p "Do you have sudo permissions? (y/n)" yn
    case $yn in
        [Yy]* ) sudo npm install -g babel-cli babel-preset-es2015 nodemon standard eslint eslint-config-standard eslint-plugin-standard eslint-plugin-promise eslint-plugin-import eslint-plugin-node; break;;
        [Nn]* ) exit;;
        * ) echo "Please answer y or n.";;
    esac
done
echo "Module installation ended."
