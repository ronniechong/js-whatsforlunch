function LunchTime(newSettings) {
    
  
    this.version    = "2.0";
    this.settings   = {
                        mainContainer   : "container",
                        selectContainer : "location",                                   //Select container ID
                        defaultLocation : "mulgrave",
                        listContainer   : {
                                            idName          : "lunchList",              //List container ID
                                            classNormal     : "item",                   //List class
                                            classSelected   : "selected",               //Selected list class
                                            classDisabled   : "disabled"                //Disabled list class
                                          },
                        timer           : {
                                            interval    : 150,                          //time between beeps
                                            increment   : 250,                          //time increment for each threshold
                                            threshold   : [3000,3000,3000]              //miliseconds for each threshold
                                          },            
                        allowAudio      : false,                                        //Play sound
                        srcAudio        : {
                                            selection   : "audio/beep.mp3",             //Selection sound
                                            selected    : "audio/tadaa.mp3"             //Chosen item sound
                                          },
                        randomise       : false                                         //Randomise list
                    };
    this.fbioConfig = {
        apiKey: "AIzaSyCZfaiSTO_Uv3l0U2T6CwsXv7l72MRGr6E",
        authDomain: "js-whatsforlunch.firebaseapp.com",
        databaseURL: "https://js-whatsforlunch.firebaseio.com",
        storageBucket: "js-whatsforlunch.appspot.com",
    };
    
    //Local
    var mode            = ["start","disabled","loading"],   
        intCounter      = 0, 
        intTimeCount    = 0,
        intIndex        = 0, 
        intTimer        = this.settings.timer.interval,
        intThreshold    = this.settings.timer.threshold[intIndex],
        prevRand        = 0,
        sound           = null,
        arrAudio        = {},
        _this           = this,
        fbRef           = firebase,
        select          = document.getElementById(_this.settings.selectContainer),
        arrToggled      = [],
        chosenLocation  = '';

    this.init  = function(arr){

        this.setMode(mode[2]);

        //Check of settings overwrite
        if (typeof newSettings !== "undefined"){
            for (var prop in this.settings) {
                if(this.settings.hasOwnProperty(prop)){
                    if (typeof (newSettings[prop]) !== "undefined"){
                        this.settings[prop] = newSettings[prop];
                    }
                }
            }
        }
        
        fbRef.initializeApp(this.fbioConfig);

        //Populate location list
	    fbRef.database().ref().on('value', function(snapshot) {
            var fbItems     = snapshot.val();

            chosenLocation = _this.settings.defaultLocation.toLowerCase();

            //remove all
            while(select.options.length > 0) select.remove(0);

            for (var prop in fbItems) {
                var opt = document.createElement('option');

                opt.value = prop;
                opt.innerHTML = prop + ' (' + _.size(fbItems[prop]) + ' yums)';
                if (prop.match(chosenLocation)){
                    opt.setAttribute('selected', 'selected');
                }
                select.appendChild(opt);
            }
            _this.updateLunchVenue(chosenLocation);
        });


        //Init audio
        if (this.settings.allowAudio){
            for (var prop in this.settings.srcAudio) {
                arrAudio[prop] = this.audioTrack(prop, this.settings.srcAudio[prop], 1, false);
            }
        }
        
        //Init trigger
        document.getElementById("button").addEventListener("click", this.buttonStart, false);
        select.addEventListener("change", this.changeLocation);
    
    };

    this.updateLunchVenue = function(location){
        //Firebase API
        var fbChild = fbRef.database().ref(location);
	    fbRef.database().ref(location).on('value', function(snapshot) {
            var arr         = [],
                container   = document.getElementById(_this.settings.listContainer.idName),
                body        = document.getElementsByTagName("body")[0],
                isStart     = ((body.className).indexOf(mode[0])>=0)?true:false,
                isLoading   = ((body.className).indexOf(mode[2])>=0)?true:false,
                fbItems     = snapshot.val();

            if (isStart || isLoading) {
                for (var prop in fbItems) {
                    arr.push(fbItems[prop]);
                }
                _this.settings.items = arr;

                _this.setMode(mode[0]);

                //Build markup
                while(container.firstChild){
                    container.removeChild(container.firstChild);
                }
                container.appendChild(
                            _this.buildList(
                                (_this.settings.randomise)? _this.getRandomiseList(_this.settings.items): _this.settings.items
                            )
                        );

                container.addEventListener('click', _this.toggleLocationItem, false);

            }

        });
    };

    this.intervalRandomise = function(){
        
        this.intCounter = setTimeout(function(){
                        
            var rand            = _this.getRandomiseIndex(),
                classNormal     = _this.settings.listContainer.classNormal,
                classSelected   = _this.settings.listContainer.classSelected,
                classDisabled   = _this.settings.listContainer.classDisabled,
                listContainer   = document.getElementById(_this.settings.listContainer.idName),
                list            = listContainer.getElementsByTagName("li"),
                className;

            for (var i=0; i < list.length; i++){
                (
                    (rand === i)
                    ? list[i].classList.contains(classDisabled) ? list[i].classList.remove(classSelected) : list[i].classList.add(classSelected)
                    : list[i].classList.remove(classSelected)
                );
            }

            intTimeCount += intTimer;

            if (intIndex < _this.settings.timer.threshold.length){
                _this.playAudio("selection");
                _this.intervalRandomise();
            } else{
                _this.intCounter = null;
                _this.displayOutcome();
            }

            if (intTimeCount > intThreshold ){
                intIndex++;
                intThreshold += _this.settings.timer.threshold[intIndex];
                intTimer += _this.settings.timer.increment;
            }
        }
        , Math.round(intTimer));
    };

    this.getRandomiseIndex = function(){
        var rand = Math.floor(Math.random() * (_this.settings.items.length));

        while (prevRand == rand || arrToggled.indexOf(rand) >= 0){
            rand = Math.floor(Math.random() * (_this.settings.items.length));
            if (rand !==prevRand && arrToggled.indexOf(rand) < 0){
                prevRand  = rand;
                break;
            }
        }
        return rand;
    };

    this.getRandomiseList = function(arr){
        
        for (var i = arr.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
        return arr;
    };

    this.buildList = function(arr){
        var list = document.createElement("ul");

        for(var i = 0; i < arr.length; i++) {
            var item    = document.createElement("li"),
                span    = document.createElement("span"),
                a    = document.createElement("a");
            span.appendChild(document.createTextNode(arr[i]));
            a.appendChild(span);
            item.appendChild(a);
            item.className = _this.settings.listContainer.classNormal;
            list.appendChild(item);
        }

        return list;
    };

    this.setMode = function (m){
        var body = document.getElementsByTagName("body")[0];
        body.className =  m;
    };

    this.buttonStart = function(){
        this.disabled = true;
        _this.setMode(mode[1]); 
        _this.intervalRandomise();
    };

    this.changeLocation = function(){
        _this.setMode(mode[2]);
        chosenLocation = this.options[this.selectedIndex].value;
        _this.updateLunchVenue(chosenLocation);
    };

    this.toggleLocationItem = function(event){
        if (event.target.tagName === 'SPAN') {
            var a               = event.target.parentElement,
                parent          = a.parentElement,
                clsDisabled     = _this.settings.listContainer.classDisabled,
                listContainer   = document.getElementById(_this.settings.listContainer.idName),
                list            = listContainer.getElementsByTagName("li");

            arrToggled = [];

            (parent.classList.contains(clsDisabled) ? parent.classList.remove(clsDisabled) : parent.classList.add(clsDisabled) );

            //Store all toggled/disabled
            for (var i=0; i < list.length; i++){
                if (list[i].classList.contains(clsDisabled)){
                    arrToggled.push(i);
                }
            }
        }
    };

    this.displayOutcome = function(){
        this.playAudio("selected");
        this.reset();
    };

    this.reset = function(){
        //reset
        var btn = document.getElementById("button");
        btn.disabled = false;
        _this.setMode(mode[0]);
        intTimeCount = 0;
        intIndex = 0;
        intTimer  = this.settings.timer.interval;
        intThreshold = this.settings.timer.threshold[intIndex];
        
    };

    this.playAudio = function(str){
        if (arrAudio.hasOwnProperty(str) && this.settings.allowAudio){
            arrAudio[str].pause();
            arrAudio[str].currentTime = 0;
            arrAudio[str].play();
         }
    };

    this.audioTrack = function (name,src,volume,loop) {
        var  audio = document.createElement("audio");
        audio.name      = name;
        audio.src       = src;
        audio.volume    = volume;
        audio.loop      = loop;
        audio.preload   = "auto";

        return audio;
    };

    //Initialise
    this.init();
};