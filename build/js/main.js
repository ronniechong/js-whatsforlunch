function LunchTime(a){this.version="1.0",this.settings={srcFile:"https://js-whatsforlunch.firebaseio.com/",items:["Item 1","Item 2","Item 3","Item 4"],mainContainer:"container",selectContainer:"location",defaultLocation:"mulgrave",listContainer:{idName:"lunchList",classNormal:"item",classSelected:"selected",classDisabled:"disabled"},timer:{interval:150,increment:250,threshold:[3e3,3e3,3e3]},allowAudio:!1,srcAudio:{selection:"audio/beep.mp3",selected:"audio/tadaa.mp3"},randomise:!1};var b=["start","disabled","loading"],c=0,d=0,e=this.settings.timer.interval,f=this.settings.timer.threshold[d],g=0,h={},i=this,j=new Firebase(this.settings.srcFile),k=document.getElementById(i.settings.selectContainer),l=[],m="";this.init=function(){if(this.setMode(b[2]),"undefined"!=typeof a)for(var c in this.settings)this.settings.hasOwnProperty(c)&&"undefined"!=typeof a[c]&&(this.settings[c]=a[c]);if(j.on("value",function(a){var b=a.val();for(m=i.settings.defaultLocation.toLowerCase();k.options.length>0;)k.remove(0);for(var c in b){var d=document.createElement("option");d.value=c,d.innerHTML=c+" ("+_.size(b[c])+" yums)",c.match(m)&&d.setAttribute("selected","selected"),k.appendChild(d)}i.updateLunchVenue(m)}),this.settings.allowAudio)for(var c in this.settings.srcAudio)h[c]=this.audioTrack(c,this.settings.srcAudio[c],1,!1);document.getElementById("button").addEventListener("click",this.buttonStart,!1),k.addEventListener("change",this.changeLocation)},this.updateLunchVenue=function(a){j.child(a).on("value",function(a){var c=[],d=document.getElementById(i.settings.listContainer.idName),e=document.getElementsByTagName("body")[0],f=e.className.indexOf(b[0])>=0?!0:!1,g=e.className.indexOf(b[2])>=0?!0:!1,h=a.val();if(d.addEventListener("click"),f||g){for(var j in h)c.push(h[j]);for(i.settings.items=c,i.setMode(b[0]);d.firstChild;)d.removeChild(d.firstChild);d.appendChild(i.buildList(i.settings.randomise?i.getRandomiseList(i.settings.items):i.settings.items)),d.addEventListener("click",i.toggleLocationItem,!1)}})},this.intervalRandomise=function(){this.intCounter=setTimeout(function(){for(var a=i.getRandomiseIndex(),b=(i.settings.listContainer.classNormal,i.settings.listContainer.classSelected),g=i.settings.listContainer.classDisabled,h=document.getElementById(i.settings.listContainer.idName),j=h.getElementsByTagName("li"),k=0;k<j.length;k++)a===k?j[k].classList.contains(g)?j[k].classList.remove(b):j[k].classList.add(b):j[k].classList.remove(b);c+=e,d<i.settings.timer.threshold.length?(i.playAudio("selection"),i.intervalRandomise()):(i.intCounter=null,i.displayOutcome()),c>f&&(d++,f+=i.settings.timer.threshold[d],e+=i.settings.timer.increment)},Math.round(e))},this.getRandomiseIndex=function(){for(var a=Math.floor(Math.random()*i.settings.items.length);g==a||l.indexOf(a)>=0;)if(a=Math.floor(Math.random()*i.settings.items.length),a!==g&&l.indexOf(a)<0){g=a;break}return a},this.getRandomiseList=function(a){for(var b=a.length-1;b>0;b--){var c=Math.floor(Math.random()*(b+1)),d=a[b];a[b]=a[c],a[c]=d}return a},this.buildList=function(a){for(var b=document.createElement("ul"),c=0;c<a.length;c++){var d=document.createElement("li"),e=document.createElement("span"),f=document.createElement("a");e.appendChild(document.createTextNode(a[c])),f.appendChild(e),d.appendChild(f),d.className=i.settings.listContainer.classNormal,b.appendChild(d)}return b},this.setMode=function(a){var b=document.getElementsByTagName("body")[0];b.className=a},this.buttonStart=function(){this.disabled=!0,i.setMode(b[1]),i.intervalRandomise()},this.changeLocation=function(){i.setMode(b[2]),m=this.options[this.selectedIndex].value,i.updateLunchVenue(m)},this.toggleLocationItem=function(a){if("SPAN"===a.target.tagName){var b=a.target.parentElement,c=b.parentElement,d=i.settings.listContainer.classDisabled,e=document.getElementById(i.settings.listContainer.idName),f=e.getElementsByTagName("li");l=[],c.classList.contains(d)?c.classList.remove(d):c.classList.add(d);for(var g=0;g<f.length;g++)f[g].classList.contains(d)&&l.push(g)}},this.displayOutcome=function(){this.playAudio("selected"),this.reset()},this.reset=function(){var a=document.getElementById("button");a.disabled=!1,i.setMode(b[0]),c=0,d=0,e=this.settings.timer.interval,f=this.settings.timer.threshold[d]},this.playAudio=function(a){h.hasOwnProperty(a)&&this.settings.allowAudio&&(h[a].pause(),h[a].currentTime=0,h[a].play())},this.audioTrack=function(a,b,c,d){var e=document.createElement("audio");return e.name=a,e.src=b,e.volume=c,e.loop=d,e.preload="auto",e},this.init()}