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
function startHeartAnimation(callback) {
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
			if(callback){callback();}
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
	fade('sign',3000,judgeDay);
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
var diff = 5;
var direction = 1;
function playMoreGarden(){
	var times = 8;
	var timesA = 8;
	function next(){
		if(times){
			times--;
			startHeartAnimation(next);
		}else if(timesA){
			HEARTSIZE+=diff*direction;
			direction*=-1;
			diff+=5;
			timesA--;
			startHeartAnimation(next);
		}
	}
	next();
}

function judgeDay(){
	//情人节
	if(isValentine()&&1){
		processValentine();
	}
	//结婚纪念日
	else if(isWedding()&&1){
		processWedding();
	}
	//七夕
	else if(isQiXi()&&1){
		processQiXi();
	}
	//生日
	else if(isBirthDay()&&1){
		processBirthDay();
	}
}

function isValentine(){
	return checkDate(2,14)||checkDate(2,15,2015);
}
function processValentine(){
	saywords(["哦，对了","今天是情人节哦","祝老婆情人节快乐*^_^*"],
			function(){
				
				$("body").addClass('bodyvalentine');
				playMoreGarden();
			});
}
function isWedding(){
	return checkDate(4,20);
}

function processWedding(){
	var dateObj= new Date();
	var _year = dateObj.getFullYear();
	var t = _year-2014;
	var ct = Utils.numberToChinese(t);
	saywords(["哦，对了","今天是我们的结婚"+ct+"周年纪念日哦","愿我们的婚姻长长久久，白头到老*^_^*"],
	playMoreGarden);
}
function isQiXi(){
	return checkDateLunar(7,7);
}
function processQiXi(){
	saywords(["哦，对了","今天是七夕哦","亲爱的老婆来搭一座鹊桥吧*^_^*"],
			playMoreGarden);
}
function isBirthDay(){
	return checkDate(11,5);
}
function processBirthDay(){
	saywords(["哦，对了","今天是老婆的生日哦","祝老婆生日快乐*^_^*"],
			playMoreGarden);
	
}



var Utils={
    /*
        单位
    */
    units:'个十百千万@#%亿^&~',
    /*
        字符
    */
    chars:'零一二三四五六七八九',
    /*
        数字转中文
        @number {Integer} 形如123的数字
        @return {String} 返回转换成的形如 一百二十三 的字符串             
    */
    numberToChinese:function(number){
        var a=(number+'').split(''),s=[],t=this;
        if(a.length>12){
            throw new Error('too big');
        }else{
            for(var i=0,j=a.length-1;i<=j;i++){
                if(j==1||j==5||j==9){//两位数 处理特殊的 1*
                    if(i==0){
                        if(a[i]!='1')s.push(t.chars.charAt(a[i]));
                    }else{
                        s.push(t.chars.charAt(a[i]));
                    }
                }else{
                    s.push(t.chars.charAt(a[i]));
                }
                if(i!=j){
                    s.push(t.units.charAt(j-i));
                }
            }
        }
        //return s;
        return s.join('').replace(/零([十百千万亿@#%^&~])/g,function(m,d,b){//优先处理 零百 零千 等
            b=t.units.indexOf(d);
            if(b!=-1){
                if(d=='亿')return d;
                if(d=='万')return d;
                if(a[j-b]=='0')return '零'
            }
            return '';
        }).replace(/零+/g,'零').replace(/零([万亿])/g,function(m,b){// 零百 零千处理后 可能出现 零零相连的 再处理结尾为零的
            return b;
        }).replace(/亿[万千百]/g,'亿').replace(/[零]$/,'').replace(/[@#%^&~]/g,function(m){
            return {'@':'十','#':'百','%':'千','^':'十','&':'百','~':'千'}[m];
        }).replace(/([亿万])([一-九])/g,function(m,d,b,c){
            c=t.units.indexOf(d);
            if(c!=-1){
                if(a[j-c]=='0')return d+'零'+b
            }
            return m;
        });
    }
};


function checkDate(month,day,year){
	var dateObj= new Date();
	var _month = dateObj.getMonth() + 1; //months from 1-12
	var _day = dateObj.getDate();
	var _year = dateObj.getFullYear();
	if(_month!=month||_day!=day){
		return false;
	}
	if(year){
		return _year==year;
	}else{
		return true;
	}
}
function checkDateLunar(month,day,year){
	
	var lunar = chineseLunar.solarToLunar(new Date());
	var _month = lunar.month;
	var _day = lunar.day;
	var _year = lunar.year;
	if(_month!=month||_day!=day){
		return false;
	}
	if(year){
		return _year==year;
	}else{
		return true;
	}
}

function saywords(s,callback){
	function next(){
		if(s.length){
			var b = s.shift();
			say(b,next);
		}else{
			if(callback){callback();}
			
		}
	}
	setTimeout(function () {
				next();
			}, 5000);
	
}


function say(words,callback){
	var kk = $("#messages");
	
	fadeOut("messages",3000,function(){
		kk.css("text-align","center");
		kk.html(words);
		fade("messages",3000,callback);
	});
	
}

