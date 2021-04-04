#!/bin/bash -ex

echo installing nautilus context menu script

DIR=$( dirname "$(readlink -f "$0")" )
pushd "$DIR"
cp vr-cinema.sh ~/.local/share/nautilus/scripts/
popd

echo done
