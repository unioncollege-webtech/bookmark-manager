uncss = ./node_modules/.bin/uncss
cleancss = ./node_modules/.bin/cleancss

host=https://webtech-c9-barberboy.c9.io

public/styles/kube.un.css : public/styles/kube.css views/*.html
	$(uncss) $(host) $(host)/bookmarks/5 $(host)/bookmarks/5/edit --stylesheets /styles/kube.css | $(cleancss) > $@
