$(function() {

	$('.box p').click(function() {
		if ($(this).next().get(0).nodeName == "DIV") {
			var $div = $(this).next('div');
			if ($div.css('display') == 'block') {
				$div.slideToggle(function() {
					$(this).children('div').hide().children('div').hide();
				});
			}
			else 
				$div.slideToggle();
		}
	})

	$('.box div').hide();



})