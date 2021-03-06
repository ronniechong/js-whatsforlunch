# js-whatsforlunch
Version 2.0

This JS web app is to help me (and my team) to decide where to head off for lunch by randomly choosing one of the regular venues.

The list of venue is retrieved using Firebase API

Venues can be disabled by toggling the item.

## Instructions

###Prequisites
Install NPM (if you do not have one)

Install Gem and Compass

Install dependencies
```
npm install
```

Execute Grunt
```
grunt watch
```

## How to run
Instantiate JS
```
var lunchTime = new LunchTime();
```

You may overwrite settings by parsing:
```
var settings = {
        allowAudio  : true,
        randomise   : true,
        defaultLocation   : "newlocation",
        timer       : {
                        interval: 200
                      }
    },
    lunchTime = new LunchTime(settings);
```

## Settings

| Attributes | Object attribtues | Values | Default
|:---|:---|:---|:---|
| defaultLocation | - | Default location to load the venues | _mulgrave_
| listContainer | idName| lunch list container ID | _lunchList_
| listContainer | classNormal| List item class | _item_
| listContainer | classSelected| Selected list item class | _selected_ 
| listContainer | classDisabled| Disabled list item class | _disabled_ 
| timer | interval | Delay between each random (miliseconds) | _150_
| timer | increment | Increment for each threshold (miliseconds) | _250_
| timer | threshold | Delay before increment (miliseconds in an array)| _[3000,3000,3000]_
| allowAudio | - | Plays audio | _false_
| srcAudio | selection | File source for selection audio | _"audio/beep.mp3"_
| srcAudio | selected | File source for selected audio | _"audio/tadaa.mp3"_
| randomise | - | Randomise lunch list | _false_

### Firebase JSON string
The JSON string should be just a simple list
```
{
	"location1":{
		"item1" : " Cafe A",
	    "item2" : " Cafe B",
	    "item3" : " Cafe C"
	},
		"location2":{
		"item1" : " Cafe X",
	    "item2" : " Cafe Y",
	    "item3" : " Cafe Z"
	}

    
}
```

## Issues & To-Dos
- Automate Firebase installation instead of manual script insertion
- Fix Safari and iOS audio play
- Ogg audio support

## History log
v2.0 (3rd August 2016) - Massive fail. Upgraded Firebase API 2.0 to 3.0