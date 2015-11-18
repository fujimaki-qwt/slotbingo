$(document).ready(function() {
	var opts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
	var time;
	var select;
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

	onload(true);

	$("#btn_start").on("click", function(){
		time = parseInt($("#txt_duration").val()) * 1000; // 数値のみの取得
		$("#btn_start").attr("disabled", "disabled");

		moveSlots(tensDigit);
		moveSlots(onesDigit);

		$(this).delay(time + 1000).queue(function() {
			$(this).dequeue();
			// 当たりの数字は配列に格納されているので、
			displayAlreadyNum(hitNumberArr[0] * 10 + hitNumberArr[1]);

			tensDigit.children().remove();
			tensDigit.css({"margin-top" : "0px"});
			tensDigit.append("<div class='slot'>" + hitNumberArr[0] + "</div>");
	
			onesDigit.children().remove();
			onesDigit.css({"margin-top" : "0px"});
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
			numberColor = 'number_yellow';
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
			return;
		}
		setHitNumberArr(numArray.pop());

		columns = 0;
		addSlots(tensDigit, init);
		addSlots(onesDigit, init);
	}

	function addSlots(jqo, init) {
		var i = (init == true) ? 0 : 1;
		for (i; i < 15; i++) {
			if (i == 12) {
				jqo.append("<div class='slot'>" + hitNumberArr[columns] + "</div>");
				columns++;
			} else {
				var ctr = Math.floor(Math.random() * opts.length);
				jqo.append("<div class='slot'>" + opts[ctr] + "</div>");
			}
		}
	}

	function moveSlots(jqo) {
		select = $('#sel_easing').val();
		time += Math.round(Math.random() * 1000);

		var marginTop = parseInt(jqo.css("margin-top"), 10)
		marginTop -= jqo.parent().height() * 12

		jqo.stop(true, true);
		jqo.animate({
			"margin-top" : marginTop + "px"
		}, {
			'duration' : time,
			'easing' : select
		});
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