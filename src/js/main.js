function LunchTime(newSettings) {

	this.version  	= "1.0",
	this.settings	= {
						items 			: ["Centro", "Kebab", "Corlam", "Pi", "Kmart","Burma","Macacs","Ikea"],
						mainContainer	: "container",								//Main container ID
						listContainer	: {
											idName 			: "lunchList",			//List container ID
											classNormal		: "item",				//List Class
											classSelected	: "selected"
										  },
						timer			: {
											interval 	: 150,						//time between beeps
											increment	: 250,						//time increment for each threshold
											threshold	: [3000,3000,4000]			//miliseconds for each threshold
										  },			
						allowAudio		: false,									//Play sound
						srcAudio		: {
											selection	: "audio/beep.mp3",			//Selection sound
											selected 	: "audio/tadaa.mp3"			//Chosen item sound
										  },
						randomise		: true										//Randomise list
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
		_this			= this;

	this.init  = function(arr){

		if (typeof newSettings !== "undefined"){

			for (var prop in this.settings) {
		    	if(this.settings.hasOwnProperty(prop)){
		    		if (typeof (newSettings[prop]) !== "undefined"){
		    			this.settings[prop] = newSettings[prop];
		    		}
		      	}
		   	}
		}

		this.setMode(mode[0]); 

		//Build markup
		document
			.getElementById(this.settings.listContainer.idName)
			.appendChild(
				this.buildList(
					(this.settings.randomise)? this.randomiseItems(this.settings.items): this.settings.items
				)
			);

		//Init audio
		if (this.settings.allowAudio){
			for (var prop in this.settings.srcAudio) {
		    	arrAudio[prop] = this.audioTrack(prop, this.settings.srcAudio[prop], 1, false);
		   	}
			// for (var i=0; i <this.settings.srcAudio.length;i++){
			// 	var name = "audio" + (i + 1);
			// 	arrAudio.push(
			// 		this.audioTrack(name, this.settings.srcAudio[i], 1, false)
			// 	);
			// }
		}
		
		//Init triggers
		document.getElementById("button").addEventListener("click", this.buttonStart, false);
		document.getElementById("replay").addEventListener("click", this.reset, false);

	}

	

	this.intervalRandomise = function(){
		
		this.intCounter = setTimeout(function(){
						
			var rand 			= Math.floor(Math.random() * (_this.items.length - 1  + 1)),
				classNormal		= _this.settings.listContainer.classNormal,
				classSelected	= _this.settings.listContainer.classSelected,
				listContainer 	= document.getElementById(_this.settings.listContainer.idName),
				list 			= listContainer.getElementsByTagName("li"),
				className;

			for (var i=0; i < list.length; i++){
				className =  (rand === i)? classNormal.concat(" ", classSelected):classNormal;
				list[i].className=className;	
			};
			

			console.log(Math.round(intTimer), " == ",intTimeCount);

			intTimeCount += intTimer;

			if (intIndex < _this.settings.timer.threshold.length){
			 	arrAudio["selection"].pause();
				arrAudio["selection"].currentTime = 0;
			 	arrAudio["selection"].play();
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
	        var item = document.createElement("li");
	        item.appendChild(document.createTextNode(arr[i]));
	        item.className = _this.settings.listContainer.classNormal;
	        list.appendChild(item);
	    }

		return list;
	}

	this.setMode = function (m){

		var container = document.getElementById(this.settings.mainContainer);

		container.className =  "container " + m;

		switch(m){
			case mode[0]: break;
			case mode[1]: break;
			case mode[2]: break;
			case mode[3]: break;
		}
	}

	this.buttonStart = function(){
		this.disabled = true;
		_this.setMode(mode[1]); 
		_this.intervalRandomise();
	}

	this.displayOutcome = function(){
		//display outcome
	}

	this.reset = function(){
		//reset
		console.log('RESET');
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