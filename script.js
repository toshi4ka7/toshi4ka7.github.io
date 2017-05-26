$(function() {

	$('.menu li').click(function() {
		if (!$(this).hasClass("menuChoose")) {
			$('.menu li').removeClass("menuChoose");
			$(this).addClass("menuChoose");
			$('.vidget').hide();
			$('.' + $(this).data("name")).show();
			localStorage.vidget = $(this).data("name");
		}
	})

	if (localStorage.vidget)
		$('.menu li').each(function() {
			if ($(this).data("name") == localStorage.vidget)
				$(this).click();
		})
	
	$('.display li:last').click(function() {
		$('.product1 .setting').slideToggle();
		$('.product1 .display li:last-child span').toggleClass('choose');
	})

	$('.product1 .setting span:last').click(function() {
		$('.product1 textarea').slideToggle();
		$(this).toggleClass('choose');
	})

	var str = "Молоко - 0,95\nХлеб - 1,05\nМакароны - 1,65\nМясо - 4,05\n" + 
		"Пельмени - 2,80\nЯблоки - 2,95\nОгурцы - 3,86\nПеченье - 2,45\n";
	$('textarea').val(str);

	// $('textarea').height($('.product1 table').height());

});

