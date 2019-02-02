# How to use the AGL reference application

---
## Navigation

**Navigation app uses mapbox as a provider of map.  You need to create an account on mapbox and get own access token.**

Signup page :

https://www.mapbox.com/signup/


### How to set the access token

**There are two ways to set the access token.**

#### Set in build time

Add your access token to localconf before building AGL.

```
MAPBOX_ACCESS_TOKEN = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
```


#### Set in run time

When you did not configure localconf before building AGL, /etc/naviconfig.ini in target rootfs is as follows.

```
{
	"mapAccessToken":"Please set mapbox access token",
	"speed":60,
	"interval":100,
	"latitude":36.1363,
	"longitute":-115.151,
	"mapStyleUrls":"mapbox://styles/mapbox/dark-v9"
}
```

Please set your access token to mapAccessToken.

### How to use navigation

Connect wifi or ether before launching navigation from homescreen.




---

## POI app

**POI app uses yelp as a provider of poi.  You need to create an developer account on yelp and get own appID.**

yelp developer page :

https://www.yelp.com/developers

TBD.


---



