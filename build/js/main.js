function LunchTime(a){this.version="1.0",this.settings={items:["Centro","Kebab","Corlam","Pi","Kmart","Burma","Macacs","Ikea"],mainContainer:"container",listContainer:{idName:"lunchList",classNormal:"item",classSelected:"selected"},timer:{interval:150,increment:250,threshold:[3e3,3e3,4e3]},allowAudio:!1,srcAudio:{selection:"audio/beep.mp3",selected:"audio/tadaa.mp3"},randomise:!0};var b=["start","disabled","outcome","loading"],c=0,d=0,e=this.settings.timer.interval,f=this.settings.timer.threshold[d],g={},h=this;this.init=function(){if("undefined"!=typeof a)for(var c in this.settings)this.settings.hasOwnProperty(c)&&"undefined"!=typeof a[c]&&(this.settings[c]=a[c]);if(this.setMode(b[0]),document.getElementById(this.settings.listContainer.idName).appendChild(this.buildList(this.settings.randomise?this.randomiseItems(this.settings.items):this.settings.items)),this.settings.allowAudio)for(var c in this.settings.srcAudio)g[c]=this.audioTrack(c,this.settings.srcAudio[c],1,!1);document.getElementById("button").addEventListener("click",this.buttonStart,!1),document.getElementById("replay").addEventListener("click",this.reset,!1)},this.intervalRandomise=function(){this.intCounter=setTimeout(function(){for(var a,i=Math.floor(Math.random()*(h.items.length-1+1)),j=h.settings.listContainer.classNormal,k=h.settings.listContainer.classSelected,l=document.getElementById(h.settings.listContainer.idName),m=l.getElementsByTagName("li"),n=0;n<m.length;n++)a=i===n?j.concat(" ",k):j,m[n].className=a;console.log(Math.round(e)," == ",c),c+=e,d<h.settings.timer.threshold.length?(g.selection.pause(),g.selection.currentTime=0,g.selection.play(),h.intervalRandomise()):(h.intCounter=null,h.setMode(b[2]),h.displayOutcome()),c>f&&(d++,f+=h.settings.timer.threshold[d],e+=h.settings.timer.increment)},Math.round(e))},this.randomiseItems=function(a){for(var b=a.length-1;b>0;b--){var c=Math.floor(Math.random()*(b+1)),d=a[b];a[b]=a[c],a[c]=d}return a},this.buildList=function(a){for(var b=document.createElement("ul"),c=0;c<a.length;c++){var d=document.createElement("li");d.appendChild(document.createTextNode(a[c])),d.className=h.settings.listContainer.classNormal,b.appendChild(d)}return b},this.setMode=function(a){var c=document.getElementById(this.settings.mainContainer);switch(c.className="container "+a,a){case b[0]:break;case b[1]:break;case b[2]:break;case b[3]:}},this.buttonStart=function(){this.disabled=!0,h.setMode(b[1]),h.intervalRandomise()},this.displayOutcome=function(){},this.reset=function(){console.log("RESET")},this.audioTrack=function(a,b,c,d){var e=document.createElement("audio");return e.name=a,e.src=b,e.volume=c,e.loop=d,e.preload="auto",e},this.init()}