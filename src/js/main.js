function LunchTime(newSettings) {

	this.version  	= "1.0",
	this.settings	= {
						srcFile			: "https://js-whatsforlunch.firebaseio.com/",	//Default JSON string
						items 			: ["Item 1", "Item 2", "Item 3", "Item 4"],
						mainContainer	: "container",									//Main container ID
						listContainer	: {
											idName 			: "lunchList",				//List container ID
											classNormal		: "item",					//List class
											classSelected	: "selected"				//Selected list class
										  },
						timer			: {
											interval 	: 150,							//time between beeps
											increment	: 250,							//time increment for each threshold
											threshold	: [3000,3000,3000]				//miliseconds for each threshold
										  },			
						allowAudio		: false,										//Play sound
						srcAudio		: {
											selection	: "audio/beep.mp3",				//Selection sound
											selected 	: "audio/tadaa.mp3"				//Chosen item sound
										  },
						randomise		: false											//Randomise list
					}
	//Local
	var mode 			= ["start","disabled","outcome","loading"],	
		intCounter		= 0, 
		intTimeCount 	= 0,
		intIndex		= 0, 
		intTimer 		= this.settings.timer.interval,
		intThreshold	= this.settings.timer.threshold[intIndex],
		sound			= null,
		arrAudio		= {},
		_this			= this,
		fbRef			= new Firebase(this.settings.srcFile);

	this.init  = function(arr){

		this.setMode(mode[3]); 

		//Firebase API
		fbRef.on("value", function(snapshot) {
		  	var arr 		= [],
		  		container 	= document.getElementById(_this.settings.listContainer.idName),
		  		body 		= document.getElementsByTagName("body")[0],
		  		isStart		= ((body.className).indexOf(mode[0])>=0)?true:false,
		  		isLoading	= ((body.className).indexOf(mode[3])>=0)?true:false,
		  		fbItems 	= snapshot.val();

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
								(_this.settings.randomise)? _this.randomiseItems(_this.settings.items): _this.settings.items
							)
						);
			}
		  	
		});

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

		//Init audio
		if (this.settings.allowAudio){
			for (var prop in this.settings.srcAudio) {
		    	arrAudio[prop] = this.audioTrack(prop, this.settings.srcAudio[prop], 1, false);
		   	}
		}
		
		//Init trigger
		document.getElementById("button").addEventListener("click", this.buttonStart, false);
	
	}

	this.intervalRandomise = function(){
		
		this.intCounter = setTimeout(function(){
						
			var rand 			= Math.floor(Math.random() * (_this.settings.items.length - 1  + 1)),
				classNormal		= _this.settings.listContainer.classNormal,
				classSelected	= _this.settings.listContainer.classSelected,
				listContainer 	= document.getElementById(_this.settings.listContainer.idName),
				list 			= listContainer.getElementsByTagName("li"),
				className;

			for (var i=0; i < list.length; i++){
				className =  (rand === i)? classNormal.concat(" ", classSelected):classNormal;
				list[i].className=className;	
			};

			intTimeCount += intTimer;

			if (intIndex < _this.settings.timer.threshold.length){
				_this.playAudio("selection");
				_this.intervalRandomise();
			} else{
				_this.intCounter = null;
				_this.setMode(mode[2]); 
				_this.displayOutcome();
			}

			if (intTimeCount > intThreshold ){
				intIndex++;
				intThreshold += _this.settings.timer.threshold[intIndex];
				intTimer += _this.settings.timer.increment;
			}
		}
		, Math.round(intTimer));
	}

	this.randomiseItems = function(arr){
		
		for (var i = arr.length - 1; i > 0; i--) {
	        var j = Math.floor(Math.random() * (i + 1));
	        var temp = arr[i];
	        arr[i] = arr[j];
	        arr[j] = temp;
	    }
	    return arr;
	}

	this.buildList = function(arr){
		var list = document.createElement("ul");

		for(var i = 0; i < arr.length; i++) {
	        var item 	= document.createElement("li"),
	        	span	= document.createElement("span");
	        span.appendChild(document.createTextNode(arr[i]));	
	        item.appendChild(span);
	        item.className = _this.settings.listContainer.classNormal;
	        list.appendChild(item);
	    }

		return list;
	}

	this.setMode = function (m){
		var body = document.getElementsByTagName("body")[0];
		body.className =  m;
	}

	this.buttonStart = function(){
		this.disabled = true;
		_this.setMode(mode[1]); 
		_this.intervalRandomise();
	}

	this.displayOutcome = function(){
		this.playAudio("selected");
		this.reset();
	}

	this.reset = function(){
		//reset
		var btn = document.getElementById("button");
		btn.disabled = false;
		_this.setMode(mode[0]);
		intTimeCount = 0;
		intIndex = 0, 
		intTimer  = this.settings.timer.interval,
		intThreshold = this.settings.timer.threshold[intIndex];
		
	}

	this.playAudio = function(str){
		if (arrAudio.hasOwnProperty(str) && this.settings.allowAudio){
			arrAudio[str].pause();
			arrAudio[str].currentTime = 0;
		 	arrAudio[str].play();
		 }
	}

	this.audioTrack = function (name,src,volume,loop) {
		var  audio = document.createElement("audio");
		audio.name 		= name;
		audio.src 		= src;
		audio.volume 	= volume;
		audio.loop 		= loop;
		audio.preload	= "auto";

		return audio;
    }

	//Initialise
	this.init();
};