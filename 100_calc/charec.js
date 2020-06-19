//キャッシュ更新の確認
function CacheChk(){
	window.applicationCache.update(); 
	if(window.applicationCache.status ==window.applicationCache.UPDATEREADY){
		window.applicationCache.swapCache(); 
		window.location.reload();
	}
}

//配列の合計
function sum(arr) {
    var sum = 0;
    for (var i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum;
}

//X～Yの間で、指定個数のランダム数値が入った配列を生成
function rand_aryy(minNum, maxNum, CreateNum){
	//等差数列の配列を作る
	var numbersArray = [];
	for( var i=minNum; numbersArray.push(i++) <= maxNum-minNum; );
	
	//Fisher–Yates shuffle
	var n = numbersArray.length, t, i;
	while (n) {
		i = Math.floor(Math.random() * n--);
		t = numbersArray[n];
		numbersArray[n] = numbersArray[i];
		numbersArray[i] = t;
	}
	
	return numbersArray.slice(0, CreateNum);
}

//文字列の差をチェック
function editdist(str1, str2) {
    var i, j;
    var matrix = [];

    for (i = 0; i <= str1.length; i++) {
        matrix[i] = [i];
    }
    for (j = 0; j <= str2.length; j++) {
        matrix[0][j] = j;
    }

    for (j = 0; j < str2.length; j++) {
        for (i = 0; i < str1.length; i++) {
            if (str1.charAt(i) === str2.charAt(j)) {
                matrix[i + 1][j + 1] = matrix[i][j];
            } else {
                matrix[i + 1][j + 1] = Math.min(
                    matrix[i][j + 1],
                    matrix[i + 1][j],
                    matrix[i][j]
                ) + 1;
            }
        }
    }
    return matrix[i - 1][j - 1];
}

//移動平均
function movingAverage(arr, size) {
    var tmp = sum(arr.slice(0, size));
    var res = [tmp / size];
    for (var i = size; i < arr.length; i++) {
        tmp += arr[i] - arr[i - size];
        res.push(tmp / size);
    }
    return res;
}

//極点チェック
function findpeek(head, mid, tail) {
    if (arguments.length !== 3) return 0;

    if (head < mid && mid > tail) {
        return 1;
    }
    if (head > mid && mid < tail) {
        return 2;
    }
    return 0;
}

//極点パターンの登録
var MODEL = {
    'du' : 1,
    'dyu': 1,
    'dyXxYu' : 2,
    'dXxYu' : 2,
    'dyXxu' : 2,
    'dXxYyXu': 3,
    'dXxXu': 3,
    'dyXxXu': 3,
    'dyXYxyXu': 3,
    'dyXxYyXYu': 3,
    'dyXxXYu': 3,
    'dxYudu': 4,
    'dxyu': 4,
    'dYudu': 4,
    'dyxu': 4,
    'dudYyXu': 5,
    'dxYXyu': 6,
    'dxYXu': 6,
    'dyXu': 7,
    'dxyXu': 7,
    'dyXudu': 7,
    'dXu': 7,
    'dyxXYxu': 8,
    'dxXYxXu': 8,
    'dyxYyXu': 9,
    'dyxYyu': 9,
    'dyxYudu': 9,
    'dxYyXu': 9,
//追加判定
    'dudxXu': 5,
    'dXudu': 5,
    'dYyXudu': 5,
    'dxXudu': 5,
    'dudXu': 7,

};

//メイン処理
function Charlec($field, $output, $input, $reset) {
    this.$field = $field;
    this.$output = $output;
    this.$reset = $reset;
    this.$input = $input;
    this.$quest = document.getElementById('quest');
    this.canvas;
    this.ctx;
    this.ones = "";
    this.tesn = "";
    this.targetChk = "";
    this.questNo = 0;
    this.score = 0;
    this.Xarry = [];
    this.Yarry = [];
    this.first = 0;
    this.second = 0;
    this.init();
    this.reset();
    this.mekeQuest();
}

Charlec.prototype = {

    THRESHOLD: 10,

    MOVINGAVG: 5,
    
    QUESTION: 10,

	//初期設定
    init: function() {
    	//タッチイベントがあるか
        if ("ontouchstart" in window) {
            window.addEventListener('touchmove', function(event) {
              event.preventDefault();
            },false);
	        this.$field.addEventListener('touchstart', this.onTouchstart.bind(this));
	        this.$field.addEventListener('touchmove', this.onTouchmove.bind(this));
	        this.$field.addEventListener('touchend', this.onTouchend.bind(this));
	    }else{
	        this.$field.addEventListener('mouseup', this.onMouseUp.bind(this));
	        this.$field.addEventListener('mousedown', this.onMouseDown.bind(this));
	        this.$field.addEventListener('mousemove', this.onMouseMove.bind(this));
	    }
        this.$reset.addEventListener('click', this.reset.bind(this));
        this.$input.addEventListener('click', this.input.bind(this));
        this.score = 0;
        this.questNo = 0;
    },
    
    //問題作成
    mekeQuest: function(){
        //入力内容から問題を生成
        var set_quest = prompt("もんだいの　すうじを　いれてください\n「OK」をおすと　はじまります","1-10");
        while(set_quest === null){
        	set_quest = prompt("！「キャンセル」は　ダメです！\nもんだいの　すうじを　いれてください\n「OK」をおすと　はじまります","1-10");
        }
        set_quest = set_quest.split("-");
    	this.Xarry = rand_aryy(set_quest[0],set_quest[1],this.QUESTION);
    	this.Yarry = rand_aryy(set_quest[0],set_quest[1],this.QUESTION);
    	this.first = this.Yarry[Math.floor(this.questNo/this.QUESTION)];
    	this.second = this.Xarry[this.questNo%this.QUESTION];
    	this.$quest.innerHTML = "だい"+(this.questNo+1)+"もん："+this.first+" + "+this.second+" = ?";
    },

    reset: function() {
        this.res = "";
        this.traced = false;
        this.ones = "";
        this.tens = "";
        var canvas = document.getElementById('board1');
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        canvas = document.getElementById('board2');
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        this.$output.innerHTML = "";
    },

    input: function() {
    	if(this.tens*10 + this.ones == this.first + this.second){
    		alert("こたえ："+(this.first + this.second)+"\n〇 せいかい！");
    		this.score++;
    	}else{
    		alert("ざんねん…\n× まちがい");
    	}
		this.questNo++;
    	if(this.questNo >= this.QUESTION*this.QUESTION){
    		alert("ぜんぶの　もんだい　おわり！\n"+this.questNo+"もん　のうち　"+this.score+"もん　せいかい");
		    this.init();
		    this.reset();
		    this.mekeQuest();
    	}
    	else{
	    	this.first = this.Yarry[Math.floor(this.questNo/this.QUESTION)];
	    	this.second = this.Xarry[this.questNo%this.QUESTION];
	    	this.$quest.innerHTML = "だい"+(this.questNo+1)+"もん："+this.first+" + "+this.second+" = ?";
	    	this.reset();
    	}
    },

//============mouse==========================
    onMouseDown: function(evt) {
        this.traced = true;
        if(evt.target.id !== this.targetChk && evt.target.id === "board1"){
          this.canvas = document.getElementById('board1');
          this.ctx = this.canvas.getContext('2d');
          this.targetChk = evt.target.id
          if(this.res != ""){
             this.ones = this.guess();
             this.$output.innerHTML = this.result();;
             this.res = "";
          }
        }else if(evt.target.id !== this.targetChk && evt.target.id === "board2"){
          this.canvas = document.getElementById('board2');
          this.ctx = this.canvas.getContext('2d');
          this.targetChk = evt.target.id
          if(this.res != ""){
             this.tens = this.guess();
             this.$output.innerHTML = this.result();;
             this.res = "";
          }
        }

        var x = evt.pageX - this.canvas.offsetLeft;
        var y = evt.pageY - this.canvas.offsetTop;

        this.res += 'd';
        this.dataX = [x];
        this.dataY = [y];

        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
    },

    onMouseUp: function(evt) {
        this.traced = false;

        this.res += this.encode();
        this.res += 'u';
        setTimeout(function(){
        	if(!this.traced){
		        //数字合成
		        if(evt.target.id === "board1"){
		          this.tens = this.guess();
		        }else if(evt.target.id === "board2"){
		          this.ones = this.guess();
		        }
		        this.$output.innerHTML = this.result();;
		        this.res = "";
		    }
	    }.bind(this),500);
    },

    onMouseMove: function(evt) {
        if (!this.traced) return;

        var x = evt.pageX - this.canvas.offsetLeft;
        var y = evt.pageY - this.canvas.offsetTop;

        this.dataX.push(x);
        this.dataY.push(y);

        this.ctx.lineTo(x, y);
        this.ctx.stroke();
    },
//============mouse==========================
//============touch==========================
    onTouchstart: function(evt) {
        this.traced = true;
        if(evt.target.id !== this.targetChk && evt.target.id === "board1"){
          this.canvas = document.getElementById('board1');
          this.ctx = this.canvas.getContext('2d');
          this.targetChk = evt.target.id
          if(this.res != ""){
             this.ones = this.guess();
             this.$output.innerHTML = this.result();;
             this.res = "";
          }
        }else if(evt.target.id !== this.targetChk && evt.target.id === "board2"){
          this.canvas = document.getElementById('board2');
          this.ctx = this.canvas.getContext('2d');
          this.targetChk = evt.target.id
          if(this.res != ""){
             this.tens = this.guess();
             this.$output.innerHTML = this.result();;
             this.res = "";
          }
        }

        var x = evt.changedTouches[0].pageX - this.canvas.offsetLeft;
        var y = evt.changedTouches[0].pageY - this.canvas.offsetTop;

        this.res += 'd';
        this.dataX = [x];
        this.dataY = [y];

        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
    },

    onTouchend: function(evt) {
        this.traced = false;

        this.res += this.encode();
        this.res += 'u';
        setTimeout(function(){
        	if(!this.traced){
		        //数字合成
		        if(evt.target.id === "board1"){
		          this.tens = this.guess();
		        }else if(evt.target.id === "board2"){
		          this.ones = this.guess();
		        }
		        this.$output.innerHTML = this.result();
		        this.res = "";
		    }
	    }.bind(this),500);
    },

    onTouchmove: function(evt) {
        if (!this.traced) return;

        var x = evt.changedTouches[0].pageX - this.canvas.offsetLeft;
        var y = evt.changedTouches[0].pageY - this.canvas.offsetTop;

        this.dataX.push(x);
        this.dataY.push(y);

        this.ctx.lineTo(x, y);
        this.ctx.stroke();
    },
//============touch==========================


    encode: function() {
        var dataX = movingAverage(this.dataX, this.MOVINGAVG);
        var dataY = movingAverage(this.dataY, this.MOVINGAVG);

        var res = '';
        var bufX = [dataX[0]];
        var bufY = [dataY[0]];

        for (var i = 0; i < dataX.length; i++) {
            var deltaX = Math.abs(bufX[bufX.length - 1] - dataX[i]);
            var deltaY = Math.abs(bufY[bufY.length - 1] - dataY[i]);

            if (deltaX >= this.THRESHOLD) {
                bufX.push(dataX[i]);
                res += ['', 'X', 'x'][findpeek.apply(null, bufX.slice(-3))];
            }
            if (deltaY >= this.THRESHOLD) {
                bufY.push(dataY[i]);
                res += ['', 'Y', 'y'][findpeek.apply(null, bufY.slice(-3))];
            }
        }
        return res;
    },

    guess: function() {
        var res, str, res_str, dist, min = null;
        for (str in MODEL) {
            dist = editdist(this.res, str);

            if (min === null || dist < min) {
                min = dist;
                res = MODEL[str];
            }
        }
        //0と6の判定
        //6判定のとき、Yの最小値と最大値から閾値を出し、最終座標が閾値未満ならゼロとみなす
        if(res == 6){
	        var chk_dist = Math.floor((Math.max(...this.dataY) - Math.min(...this.dataY)) * 0.2) + Math.min(...this.dataY);
	        if(chk_dist > this.dataY[this.dataY.length-1]) res = 0;
        }
        
        return res;
    },
    
    result: function(){
    	if(this.ones === ""){ return ""; }
    	else{ return this.tens*10 + this.ones}
    },
};
