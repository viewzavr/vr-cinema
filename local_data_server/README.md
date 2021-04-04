# Local data server project

Allows to visualize CinemaScience 3d scenes on local computer.

# Installation

* Install nodejs from https://nodejs.org/en/download/ for linux or windows.
* If you use windows 7, use this [installer](https://nodejs.org/download/release/v13.14.0/node-v13.14.0-x64.msi)

# Usage
Run:
* `npx vr-cinema`
* `npx vr-cinema path-to-dir`

# Integrate with windows explorer / gnome

## Linux
Run `npx -p vr-cinema vr-cinema-setup`
Effect: gnome nautilus will show a `script/vr-cinema` in folders context menu.

## Windows
Download [setup.reg](https://viewzavr.com/apps/vr-cinema/local_data_server/setup-windows/setup.reg) and click it.
Effect: explorer context menu on folders will have `Open with VR-Cinema` menu.

To uninstall, download [setupoff.reg](https://viewzavr.com/apps/vr-cinema/local_data_server/setup-windows/setup.regoff) and click it.

# Idea

Project main idea:
1. Serve specific dir on local machine so web browser may access files on that dir.
2. Be able to run (1) as npx command.
3. Integrate (2) with shell (explorer, gnome).

## Notes

It is currently tied with ../package.json. Actually, client's counterpart is done in ../index.html.
Probably, these all are separate projects - vr-cinema and local-server-powered add-on.
Also, loading side modules should be considered, for example Dubins.

# Notes on integration
We still user npx, probably it is simpler to install vr-cinema once in a form `npm i -g vr-cinema`.
However in that case user have to manually update server.

We integrate with gnome/nautilus using nautilus script feature.
We integrate with explorer using reg files.

# Ideas

* Inspect subdirs to multiple data.csv and show their overview with screenshots?
* Handle file changes and notify client.
Seems simples way is to load ws://...data.csv in current circumstances,
hovewer to handle other files probably it is better to see on notifiers.
Probably, should thing of it.
* Notify server when browser window closes so server may stop?
Probably it may be tied with previous feature - so server stops when
all clients closes connections (probably with some elegant manner so we do not
close server if connection just closed by say hibernation).

# Requirements and features

# R-FRESH-DATA
Data should be displayed fresh, as on disks.

## F-CACHE
Cache should be 0 with e-tags, so new data will.

# R-SAVE-SETTINGS
User should be able to save settings while navigating scene.

## F-AUTOSAVE
Auto-save viewzavr-settings.json (done in ../index.html)

# R-EASY-START
User should have an ability to start our CinemaScience viewer with easy on local data files.
That's why we created this server. However it should be probably integrated with explorer/gnome.
