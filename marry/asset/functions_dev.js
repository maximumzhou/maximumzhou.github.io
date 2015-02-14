// variables
var $window = $(window), gardenCtx, gardenCanvas, $garden, garden;
var clientWidth = $(window).width();
var clientHeight = $(window).height();
var heartX,heartY;
var HEARTSIZE = 270;
var WINDOWSIZE = 554;

function showContent() {
    // setup garden
	//$loveHeart = $("#loveHeart");
    var $garden = $("#garden");
    var gardenCanvas = $garden[0];
	//gardenCanvas.width = $("#loveHeart").width();
    //gardenCanvas.height = $("#loveHeart").height()
    var gardenCtx = gardenCanvas.getContext("2d");
    gardenCtx.canvas.width  = window.innerWidth;
    gardenCtx.canvas.height = window.innerHeight;
    var ws = Math.min(gardenCanvas.width,gardenCanvas.height);
    heartX = gardenCanvas.width/2;
    heartY = gardenCanvas.height/2;

    var scaleFactor = ws/WINDOWSIZE;
    //scaleFactor = 0.3;
	
	var ratio = document.width / window.innerWidth;
	if(isNaN(ratio)){
		ratio = 1;
	}
	
	var sf = scaleFactor;
	var sx = heartX;
	var sy = heartY;
	if (ratio > 1) {
		alert('显示异常！');
		//alert(document.width +' '+ window.innerWidth);
		//window.innerWidth = document.width;
		//window.innerHeight = document.height;
		//alert(document.width +' '+ window.innerWidth);
		//ratio = 1/ratio;
	}

    gardenCtx.translate(sx,sy);
    gardenCtx.scale(sf,sf);
    //alert(window.innerWidth+','+window.innerHeight+','+heartX+','+heartY+','+scaleFactor+','+ws+','+WINDOWSIZE);
    gardenCtx.globalCompositeOperation = "lighter";
    garden = new Garden(gardenCtx, gardenCanvas);

    // renderLoop

    setInterval(function () {
        garden.render();
    }, Garden.options.growSpeed);
	
	
	
	function centerIt(id){
		var kk = $("#"+id);
		var tw = kk.width();
		var th = kk.height();
		var tox = (window.innerWidth-tw)/2;
		var toy = (window.innerHeight-th)/2;
		kk.css('transform','translateX('+tox+'px) translateY('+toy+'px) scale('+scaleFactor+","+scaleFactor+")");
		kk.css('-webkit-transform','translateX('+tox+'px) translateY('+toy+'px) scale('+scaleFactor+","+scaleFactor+")");
		kk.css('-moz-transform','translateX('+tox+'px) translateY('+toy+'px) scale('+scaleFactor+","+scaleFactor+")");		
	}
	
	centerIt('mainDiv');
	centerIt('clickme');
	
	
	function flash(id){
		var kk = $("#"+id);
		var steps = [0.5,1];
		var i = 0;
		function f(){	
			kk.fadeTo(1000,steps[i%steps.length],f);
			i++;
		}
		f();
		
	}
	flash('clickme');
	
	//gardenCtx.fillRect(-2,-2,4,4);
    
}

function getHeartPoint(angle) {
	var t = angle / Math.PI;
	var x = HEARTSIZE * ( Math.pow(Math.sin(t), 3));
	var y = - HEARTSIZE * (13/16 * Math.cos(t) - 5/16 * Math.cos(2 * t) - 2/16 * Math.cos(3 * t) - 1/16* Math.cos(4 * t));
	return new Array(x,  y-50);
}
var maxY = 0;
var minY = 0;
function startHeartAnimation() {
	var interval = 50;
	var angle = 10;
	var heart = new Array();
	var animationTimer = setInterval(function () {
		var bloom = getHeartPoint(angle);
		var draw = true;
		for (var i = 0; i < heart.length; i++) {
			var p = heart[i];
			var distance = Math.sqrt(Math.pow(p[0] - bloom[0], 2) + Math.pow(p[1] - bloom[1], 2));
			if (distance < Garden.options.bloomRadius.max * 1.3) {
				draw = false;
				break;
			}
		}
		maxY = Math.max(maxY,bloom[0]);
		minY = Math.min(minY,bloom[0]);
		if (draw) {
			heart.push(bloom);
			garden.createRandomBloom(bloom[0], bloom[1]);
		}
		if (angle >= 30) {
			clearInterval(animationTimer);
			//alert((maxY+minY)/2+','+heartY);
			
		} else {
			angle += 0.2;
		}
	}, interval);
}

function getDaysInMonth(month) {
	var data = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	return data[month];
}

function timeElapse(date, mode) {
	var current = new Date();
	var years = NaN;
	var months = NaN;
	var days = NaN;
	var hours = NaN;
	var minutes = NaN;
	var seconds = NaN;
	seconds = current.getSeconds() - date.getSeconds();
	if (seconds < 0) {
		seconds += 60;
		current.setMinutes(current.getMinutes() - 1);
	}
	minutes = current.getMinutes() - date.getMinutes();
	if (minutes < 0) {
		minutes += 60;
		current.setHours(current.getHours() - 1);
	}
	hours = current.getHours() - date.getHours();
	if (hours < 0) {
		hours += 24;
		current.setDate(current.getDate() - 1);
	}
	if (mode == 1) {
		days = current.getDate() - date.getDate();
		if (days < 0) {
			days += getDaysInMonth(current.getMonth());
			current.setDate(current.getDate() - 1);
		}
		months = current.getMonth() - date.getMonth();
		if (months < 0) {
			months += 12;
			current.setYear(current.getFullYear() - 1);
		}
		years = current.getFullYear() - date.getFullYear();
	} else {
		days = Math.floor((current.getTime() - date.getTime()) / (1000 * 3600 * 24));
	}

	if (hours < 10) {
		hours = "0" + hours;
	}
	if (minutes < 10) {
		minutes = "0" + minutes;
	}
	if (seconds < 10) {
		seconds = "0" + seconds;
	}
	var result = (years > 0 ? "<span class=\"digit\">" + years + "</span> 年 ":"")
	result += (months >= 0 ? "<span class=\"digit\">" + months + "</span> 月 ":"");
	result += "<span class=\"digit\">" + days + "</span> 天 ";
	result += "<span class=\"digit\">" + hours + "</span> 小时 "
	result += "<span class=\"digit\">" + minutes + "</span> 分 "
	result += "<span class=\"digit\">" + seconds + "</span> 秒";
	
	$("#elapseClock").html(result);
}

function showMessages() {
	fade('messages',5000,showClock);
}

function showClock() {
	fade('elapseClock',5000,showLoveU);
}

function showLoveU() {
	fade('loveu',3000,showLoveU2);
}

function showLoveU2(){
	fade('loveu2',3000,showLast);
}

function showLast(){
	fade('sign',3000,saya);
}

function fade(id,time,callback){
	var kk = $("#"+id);
	kk.css('visibility','visible');
	kk.css('display','none');
	kk.fadeIn(time,function(){
		if(callback){callback();}
	});
}

function fadeOut(id,time,callback){
	var kk = $("#"+id);
	kk.fadeOut(time,function(){
		if(callback){callback();}
	});
}

function saya(){
	var s = ["哦，对了","今天是情人节哦","祝老婆情人节快乐*^_^*"];
	function next(){
		if(s.length){
			var b = s.shift();
			say(b,next);
		}else{
			startHeartAnimation();
			startHeartAnimation();
			startHeartAnimation();
			startHeartAnimation();
		}
	}
	next();
}


function say(words,callback){
	var kk = $("#messages");
	
	fadeOut("messages",3000,function(){
		kk.css("text-align","center");
		kk.html(words);
		fade("messages",3000,callback);
	});
	
}

