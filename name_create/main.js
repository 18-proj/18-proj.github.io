//========================================
//初期設定
//========================================
const KANA_MIN = 12449; //カタカナの「ア」最初の文字
const KANA_MAX = 12540; //カタカナの「－」最後の文字
const KANA_NO  = [12453,12482,12485,12526,12528,12529,12530,12533,12534,12535,12536,12537,12538,12539]; //使わない文字
const KANA_TOP = [12449,12451,12455,12457,12483,12515,12517,12519,12531,12540]; //最初だとダメ
const KANA_S   = [12449,12451,12455,12457,12515,12517,12519,12532]; //小書き系対策
const KANA_SHO = ["ファ","ヴァ" //小書きまとめ
				 ,"ティ","フィ","ヴィ","ウィ","ディ"
				 ,"フェ","ヴェ","ウェ"
				 ,"フォ","ヴォ","ウォ"
				 ,"キャ","シャ","チャ","ニャ","ヒャ","ミャ","リャ","ギャ","ジャ","ビャ","ピャ"
				 ,"キュ","シュ","チュ","ニュ","ヒャ","ミュ","リュ","ギュ","ジュ","ビュ","ピュ","デュ"
				 ,"キョ","ショ","チョ","ニョ","ヒャ","ミョ","リョ","ギョ","ジョ","ビョ","ピョ"];

//ウィンドウサイズに合わせてリサイズ
window.addEventListener("load",init);
function init(){
	textResize();
//	loadLocalText();
}

window.addEventListener("resize",textResize);
function textResize(){
	var obj = document.getElementById("name_area");
	obj.style.width = (window.innerWidth-20) + "px";
	obj.style.height = 30 + "px";
}

//========================================
//名前生成
//========================================
function name_create(){
	let rnd_name = "";
	let rnd_txt = "";
	let rnd_code = 0;
	
	//文字数を決める
	let min_cnt = Number( document.getElementById("min_val").value );
	let max_cnt = Number( document.getElementById("max_val").value );
	let txt_cnt = Math.floor( Math.random() * (max_cnt-min_cnt+1) ) + min_cnt;
	
	//文字数の回数分ランダムに生成
	for(let i=0; i<txt_cnt; i++){
		while(true){
			rnd_code = Math.floor( Math.random() * (KANA_MAX-KANA_MIN+1) + KANA_MIN ); //ランダムな文字を生成

			//----------------
			//オプション
			//----------------
			if(document.getElementById("nbs").checked && Math.random() > 0.5 ){ rnd_code = 12540; }
			if(document.getElementById("xtu").checked && Math.random() > 0.4 ){ rnd_code = 12483; }

			//----------------
			//文字構成チェック
			//----------------
			if( i==0 && KANA_TOP.includes(rnd_code) ){ continue; } //文頭禁止文字
			
			//使用禁止文字or小書き系の場合の対処
			if( KANA_NO.includes(rnd_code) || KANA_S.includes(rnd_code) ){
				if(document.getElementById("xtu").checked && Math.random() > 0.5 ){ continue; }
				rnd_txt = KANA_SHO[ Math.floor( Math.random() * 47 ) ];
				//i++;
				break;
			}
			
			//「ッ」の対策
			if( rnd_code == 12483 ){
				if( i >= txt_cnt-1 || rnd_txt=="ッ" || rnd_txt=="ン" || rnd_txt=="ー" ){ continue; }
			}
			//「ン」の対策
			if( rnd_code == 12531 ){
				if( rnd_txt=="ッ" || rnd_txt=="ン" ){ continue; }
			}
			//「ー」の対策
			if( rnd_code == 12540 ){
				if( rnd_txt=="ッ" || rnd_txt=="ン" || rnd_txt=="ー" ){ continue; }
			}
			//----------------

			rnd_txt = String.fromCodePoint(rnd_code);
			break;
		}
		rnd_name = rnd_name + rnd_txt;
	}
	document.getElementById("name_area").innerHTML = rnd_name;
}