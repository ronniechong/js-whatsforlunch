function LunchTime(newSettings) {

	this.version  	= "1.0",
	this.items 		= ["Centro", "Kebab", "Corlam", "Pi", "Kmart","Burma","Macacs","Ikea"],
	this.mode 		= ["start","disabled","outcome","loading"],
	this.settings	= {
						containerID		: "container",	
						listID			: "lunchList",			//ID
						timer			: {
											interval 	: 150,
											increment	: 250,
											threshold	: [2000,5000,8000]
										  },		
						//allowWildcard	: false,				// Allow wildcards
						//wildcardItems	: [],					//future feature 	
						allowAudio		: false,					//Play sound
						srcAudio		: ["audio/beep-22.mp3","audio/beep-23.mp3","audio/beep-25.mp3"],	//Play sound
						randomise		: true,			//Randomise list
					}


	
	var intCounter		= 0, 
		intTimeCount 	= 0,
		intIndex		= 0, 
		intTimer 		= this.settings.timer.interval,
		intThreshold	= this.settings.timer.threshold[intIndex],
		sound			= null,
		arrAudio		= [],
		_this			= this;

	this.init  = function(arr){
		console.log(this.version);

		if (typeof newSettings !== "undefined"){

			for (var prop in this.settings) {
		    	if(this.settings.hasOwnProperty(prop)){
		    		if (typeof (newSettings[prop]) !== "undefined"){
		    			this.settings[prop] = newSettings[prop];
		    		}
		      	}
		   	}
		}

		this.setMode(this.mode[0]); 

		//Build markup
		document
			.getElementById(this.settings.listID)
			.appendChild(
				this.buildList(
					(this.settings.randomise)? this.randomiseItems(this.items): this.items
				)
			);
		
		

		//Init audio
		if (this.settings.allowAudio){
			for (var i=0; i <this.settings.srcAudio.length;i++){
				var name = "audio" + (i + 1);
				arrAudio.push(
					this.audioTrack(name, this.settings.srcAudio[i], 1, false)
				);
			}
		}
		
		//Init trigger
		document.getElementById("button").addEventListener("click", this.buttonStart, false);

	}

	

	this.intervalRandomise = function(){
		
		this.intCounter = setTimeout(function(){
						
			var rand 			= Math.floor(Math.random() * (_this.items.length - 1  + 1)),
				listContainer 	= document.getElementById(_this.settings.listID),
				list 			= listContainer.getElementsByTagName("li"),
				className;

			for (var i=0; i < list.length; i++){
				className =  (rand === i)? "item selected":"item";
				list[i].className=className;	
			};
			

			console.log(Math.round(intTimer), " == ",intTimeCount);

			intTimeCount += intTimer;

			if (intTimeCount > intThreshold ){
				intIndex++;
				intThreshold = _this.settings.timer.threshold[intIndex];
				intTimer += _this.settings.timer.increment;
			}

			if (intIndex < _this.settings.timer.threshold.length){
				//arrAudio[Math.floor(Math.random() * 2)].play();
			 	arrAudio[0].pause();
				arrAudio[0].currentTime = 0;
			 	arrAudio[0].play();
				_this.intervalRandomise();
			} else{
				_this.intCounter = null;
				_this.setMode(_this.mode[2]); 
				_this.displayOutcome();
				console.log("chosen!");
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
	        var item = document.createElement("li");
	        item.appendChild(document.createTextNode(arr[i]));
	        item.className = "item";
	        list.appendChild(item);
	    }

		return list;
	}

	this.setMode = function (mode){

		var container = document.getElementById(this.settings.containerID);

		container.className =  "container " + mode;

		switch(mode){
			case this.mode[0]: break;
			case this.mode[1]: break;
			case this.mode[2]: break;
			case this.mode[3]: break;
		}

		// if (mode === this.mode[0]){

		// } else if (mode === this.mode[1]){

		// }
	}

	this.buttonStart = function(){
		this.disabled = true;
		_this.setMode(_this.mode[1]); 
		_this.intervalRandomise();
	}

	this.displayOutcome = function(){
		//display outcome
	}

	this.reset = function(){
		//reset
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

	this.init();
};