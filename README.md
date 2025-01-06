# museum_touch_kiosk
Media station for an exhibition showing very large image scans. 

- add ./js/ndl8ohc.js from https://use.typekit.net/ndl8ohc.js

- add images from https://geoportal.thueringen.de/gdi-th/download-offene-geodaten/download-luftbilder-und-orthophotos
and process them using [deepzoom](https://github.com/openzoom/deepzoom.py).
Deepzoom has to be modified to work properly with modern python libs.


## Kiosk-PC preparation

I used Fedora 40 (KDE). However a standard fedora would have worked similarly (and other distributions too).

- Install httpd (Apache service), chromium and LightDM (GDM or similar would work too).
- Copy this project to `/var/www/http/`.
- Create a user for the museum display task. (here: `ausstellung`)
- Make sure, that chromium does not lock itself by editing the chrome-tab and adding the following line:

	`@reboot rm -f /home/ausstellung/.config/chromium/Singleton*`
- add a new desktop environment

	`sudo nano /usr/share/xsessions/chrome-kiosk.desktop`

```	
[Desktop Entry]
Name=chrome-kiosk
Comment=Chrome in fullscreen kiosk mode
Exec=/usr/share/xsessions/chrome-kiosk.sh
Type=Application
```	
- add the script to start chromium. 
	
	`unclutter -b -idle 0.1` hides the cursor after .1 seconds and -b pushes the process in the background.

	The single `&` makse sure, that unclutter does not hinder the start of chromium.

	Chromium is then started in kiosk mode, without cache and in incognito mode to ensure, that allways the current version of the site is loaded.
	The window size is equal to the resolution +1 px, since there was still a pixel line on the right and the bottom for some reason

	`&& pkill unclutter` completly kills the process to be able to get back to the login screen after pressing `ALT+F4`.
```	
#!/bin/bash
(unclutter -b -idle 0.1 & chromium-browser --incognito --disk-cache-dir=/dev/null --disk-cache-size=1 --kiosk --window-size=2561,1441 --window-position=0,0 --start-fullscreen 'http://localhost/') && pkill unclutter
```	

- edit the lightDM settings to auto-login the user `ausstellung`:

	`sudo nano /etc/lightdm/lightdm.conf`
```	
[Seat:*]
greeter-session=lightdm-greeter
user-session=chrome-kiosk
autologin-user=ausstellung
autologin-user-timeout=0
autologin-session=chrome-kiosk
```
- disable [energy saving/screen blanking](https://wiki.archlinux.org/title/Display_Power_Management_Signaling#Configuration)