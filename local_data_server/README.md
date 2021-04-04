# Local data server project

Run:
* `npx vr-cinema`
* `npx vr-cinema path-to-dir`

# Integrate with windows explorer / gnome

Run `npx -p vr-cinema vr-cinema-setup`

# Idea

Project main idea:
1. Serve specific dir on local machine so web browser may access files on that dir.
2. Be able to run (1) as npx command.
3. Integrate (2) with shell (explorer, gnome).

## Notes

It is currently tied with ../package.json. Actually, client's counterpart is done in ../index.html.
Probably, these all are separate projects - vr-cinema and local-server-powered add-on.
Also, loading side modules should be considered, for example Dubins.

# Ideas

* Inspect subdirs to multiple data.csv and show their overview with screenshots?
* Handle file changes and notify client.
Seems simples way is to load ws://...data.csv in current circumstances,
hovewer to handle other files probably it is better to see on notifiers.
Probably, should thing of it.

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