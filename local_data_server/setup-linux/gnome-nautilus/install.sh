#!/bin/bash -ex

echo installing nautilus context menu script

DIR=$( dirname "$(readlink -f "$0")" )
pushd "$DIR"
cp VR-Cinema ~/.local/share/nautilus/scripts/
popd

echo done
