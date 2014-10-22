host=https://webtech-c9-barberboy.c9.io
urls=\
  $(host) \
  $(host)/bookmarks/add \
  $(host)/bookmarks/542d4747937a681041c1c452/edit \
  $(host)/search?q=Bookmarks

public/styles/kube.un.css : public/styles/kube.css views/*.html
	uncss $(urls) --stylesheets /styles/kube.css \
	| cleancss > $@
