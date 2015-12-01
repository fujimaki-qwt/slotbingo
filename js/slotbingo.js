$(document).ready(function() {
	var easing = ["jswing", "easeInQuad", "easeOutQuad", "easeInOutQuad", "easeInCubic", "easeOutCubic", "easeInOutCubic", "easeInQuart", "easeOutQuart", "easeInOutQuart", "easeInQuint", "easeOutQuint", "easeInOutQuint", "easeInSine", "easeOutSine", "easeInOutSine", "easeInExpo", "easeOutExpo", "easeInOutExpo", "easeInCirc", "easeOutCirc", "easeInOutCirc", "easeInElastic", "easeOutElastic", "easeInOutElastic", "easeInBack", "easeOutBack", "easeInOutBack", "easeInBounce", "easeOutBounce", "easeInOutBounce"];
	var opts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
	var time = 5 * 1000; // 10の位が決まるまでの秒数
	var delay = 5 * 1000; // 10の位が決まってから1の位が決まるまでの遅延
	var columns;

	var tensDigit = $("#tens-digit .wrapper");
	var onesDigit = $("#ones-digit .wrapper");

	// 1~75までの数字を作成し、ランダムに並び替える
	var numArray = [];
	for( var i=1; numArray.push(i++) < 75;);
	numArray = shuffle(numArray);

	// 当たりの数字を格納。Arr[0]が十の位、Arr[1]が1の位
	var hitNumberArr = [];
	// 既出の数字を格納
	var aleadyNumArr = [];
	
	//音響関係
	var slotAudio  = new Audio();
	slotAudio.src  = "audio/slot.mp3";
	slotAudio.loop = true;

	var numberAudio = new Audio();
	numberAudio.src = "audio/tetteree.mp3";
	
	onload(true);

	$("#btn_start").on("click", function(){
		slotAudio.play();
		$("#btn_start").attr("disabled", "disabled");

		moveSlots(tensDigit);
		moveSlots(onesDigit, delay);

		$(this).delay(time + delay + 200).queue(function() {
			slotAudio.pause();
			numberAudio.play();

			$(this).dequeue();

			// 当たりの数字は配列に格納されているので、復元
			displayAlreadyNum(hitNumberArr[0] * 10 + hitNumberArr[1]);

			tensDigit.children().remove();
			tensDigit.css({"margin-top" : "-1200px"});
			addDummyNum(tensDigit);
			tensDigit.append("<div class='slot'>" + hitNumberArr[0] + "</div>");
	
			onesDigit.children().remove();
			onesDigit.css({"margin-top" : "-1200px"});
			addDummyNum(onesDigit);
			onesDigit.append("<div class='slot'>" + hitNumberArr[1] + "</div>");
	
			$("#btn_start").removeAttr("disabled");
	
			hitNumberArr = []; // 当たりの数字の初期化
			onload(false);
		})
	})

	// 受け取った数字を桁ごとの配列に変換して保存
	function setHitNumberArr(num){
		hitNumberArr.push(Math.floor(num / 10)); // 十の位
		hitNumberArr.push(num % 10); // 一の位
	}

	//既出の数字を表示
	function displayAlreadyNum(num){
		if(num <= 15){
			numberColor = 'number_red';
		}else if(num <= 30){
			numberColor = 'number_blue';
		}else if(num <= 45){
			numberColor = 'number_green';
		}else if(num <= 60){
			numberColor = 'number_orange';
		}else{
			numberColor = 'number_violet';
		}

		aleadyNumArr.push(num);
		$('#js-already-num-block').after("<div class='already_num " +numberColor+ "'>"+num+"</div>");
	}

	function onload(init) {
		// // 当たりの決定
		if (numArray.length == 0){
			alert("終了です orz");
			$("#btn_start").attr("disabled", "disabled");
			return;
		}
		setHitNumberArr(numArray.pop());

		columns = 0;
		addSlots(tensDigit, init);
		addSlots(onesDigit, init);
	}

	function addSlots(jqo, init) {
		var i = (init == true) ? 0 : 5;
		for (i; i < 20; i++) {
			if (i == 12) {
				jqo.append("<div class='slot hit'>" + hitNumberArr[columns] + "</div>");
				columns++;
			} else {
				var ctr = Math.floor(Math.random() * opts.length);
				jqo.append("<div class='slot " + i +"'>" + opts[ctr] + "</div>");
			}
		}
	}

	function moveSlots(jqo, delay) {
		if (delay == undefined) {
			delay = 0;
		}

		var marginTop = parseInt(jqo.css("margin-top"), 10)
		marginTop -= jqo.parent().height() * 8

		jqo.stop(true, true);
		jqo.animate({
			"margin-top" : marginTop + "px"
		}, {
			'duration' : time + delay,
			'easing' : easing[Math.floor(Math.random() * easing.length)]
		});
	}

	// easeInBack等の特殊なアニメーション対応のための苦肉の策
	function addDummyNum(jqo) {
		jqo.append("<div class='slot'>" + opts[Math.floor(Math.random() * opts.length)] + "</div>");
		jqo.append("<div class='slot'>" + opts[Math.floor(Math.random() * opts.length)] + "</div>");
		jqo.append("<div class='slot'>" + opts[Math.floor(Math.random() * opts.length)] + "</div>");
		jqo.append("<div class='slot'>" + opts[Math.floor(Math.random() * opts.length)] + "</div>");
	}

	function shuffle(array) {
		var m = array.length, t, i;

		while (m) {
			i = Math.floor(Math.random() * m--);
			t = array[m];
			array[m] = array[i];
			array[i] = t;
		}

		return array;
	}
});