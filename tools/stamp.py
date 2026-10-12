#!/usr/bin/env python3
"""Stamp a new version on every page so browsers pick up updates straight away.

Run this before each commit:  python3 tools/stamp.py
It writes version.json and updates the version inside each .html file
(the auto-update check and the common.css / common.js links).
"""
import re, json, pathlib, datetime

root = pathlib.Path(__file__).resolve().parent.parent
ver = datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%d%H%M%S')

CHECK = ('<script id="gc-update">(function(){var cur="%s";try{fetch("version.json?t="+Date.now(),{cache:"no-store"})'
         '.then(function(r){return r.json()}).then(function(j){if(!j||!j.v||j.v===cur)return;var u=new URL(location.href);'
         'if(u.searchParams.get("v")===j.v)return;u.searchParams.set("v",j.v);location.replace(u.toString());})'
         '.catch(function(){});}catch(e){}})();</script>')

for page in sorted(root.glob('*.html')):
    s = page.read_text()
    s = re.sub(r'<script id="gc-update">.*?</script>\n?', '', s, flags=re.S)
    s = s.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n' + (CHECK % ver), 1)
    s = re.sub(r'(href|src)="(common\.(?:css|js))(?:\?v=[^"]*)?"', lambda m: f'{m.group(1)}="{m.group(2)}?v={ver}"', s)
    # links between pages carry the version too, so moving around the site never lands on an old copy
    s = re.sub(r'href="((?:[\w-]+\.html)|\./)(?:\?v=[^"]*)?"', lambda m: f'href="{m.group(1)}?v={ver}"', s)
    page.write_text(s)
    print('stamped', page.name)

(root / 'version.json').write_text(json.dumps({'v': ver}) + '\n')
print('version', ver)
