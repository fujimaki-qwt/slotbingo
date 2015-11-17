$(document).ready(function() {
	var opts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
	var time;
	var select;
	var columns;

	// 当たりの数字を格納。Arr[0]が十の位、Arr[1]が1の位
	var hitNumberArr = [];
	// 既出の数字を格納
	var aleadyNumArr = [];

	onload(true);

	$("#btn_start").on("click", function(){
		go();
	})

	// 受け取った数字を桁ごとの配列に変換して保存
	function setHitNumberArr(num){
		hitNumberArr.push(Math.floor(num / 10)); // 十の位
		hitNumberArr.push(num % 10); // 一の位
	}

	function makeRandomNum(){
		return Math.round(Math.random()*100 % 75);
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
		// 当たりの決定
		do {
			var num = makeRandomNum();
		} while (($.inArray(num, aleadyNumArr) !== -1) && num > 0 && num <=75);
		setHitNumberArr(num);

		columns=0;
		addSlots($("#slots_a .wrapper"), init);
		addSlots($("#slots_b .wrapper"), init);
	}

	function go() {
		time = parseInt($("#txt_duration").val()) * 1000; // 数値のみの取得
		select = $('#sel_easing').val();
		$("#btn_start").attr("disabled", "disabled");

		moveSlots($("#slots_a .wrapper"));
		moveSlots($("#slots_b .wrapper"));

		$(this).delay(time + 1000).queue(function() {
			$(this).dequeue();
			// 当たりの数字は配列に格納されているので、
			displayAlreadyNum(hitNumberArr[0] * 10 + hitNumberArr[1]);
			reset();
		})
	}

	function reset() {
		$("#slots_a .wrapper").children().remove();
		$("#slots_a .wrapper").css({
			"margin-top" : "0px"
		});
		$("#slots_a .wrapper").append("<div class='slot'>" + hitNumberArr[0] + "</div>");

		$("#slots_b .wrapper").children().remove();
		$("#slots_b .wrapper").css({
			"margin-top" : "0px"
		});
		$("#slots_b .wrapper").append("<div class='slot'>" + hitNumberArr[1] + "</div>");

		$("#btn_start").removeAttr("disabled");
		$("#btn_reset").attr("disabled", "disabled");
		hitNumberArr = []; // 当たりの数字の初期化
		onload(false);
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
		time += Math.round(Math.random() * 1000);

		var marginTop = parseInt(jqo.css("margin-top"), 10)
		marginTop -= (10 * 120)

		jqo.stop(true, true);
		jqo.animate({
			"margin-top" : marginTop + "px"
		}, {
			'duration' : time,
			'easing' : select
		});
	}
});