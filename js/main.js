window.kohvishop = window.kohvishop || {}

kohvishop.config = {
	API_PATH: '',
	MAIN_HTML:  
					'<div id="shop_items">' +
						'<div class="shop_titlebar">TOOTED</div>' +
						'<ul id="shop_items_holder"></ul>' +
					'</div>' +
					'<div id="shop_cart">' +
						'<div id="shop_title" class="shop_titlebar">OSTUKORV</div>' +
						'<ul id="shop_cart_items"></ul>' +
						'<div id="shop_total">' +
						'<div class="shop_titlebar">KOKKU</div>' +
							'<div class="shop_total">' +
								'<span class="shop_total_text">0</span>' +
								'<span class="shop_total_currency"> €</span>' +
							'</div>' +
							'<div class="clear"></div>' +
						'</div>' + 
					'</div>',
	CART_ITEM_HTML: '<li class="shop_cart_item">' +
						'<div class="shop_cart_item_text"></div>' +
						'<div class="shop_cart_item_action">—</div>' +
						'<div class="shop_cart_item_price"></div>' +
						'<div class="clear"></div>' +
					'</li>',
	MAIN_ITEM_HTML: '<li class="shop_item">' +
						'<div class="shop_item_pic"></div>' +
						'<div class="shop_item_content">' +
							'<div class="shop_item_content_texts">' +
								'<h1></h1>' +
								'<p></p>' +
							'</div>' +
							'<div class="shop_item_content_action">' +
								'<span class="general_button">ROHKEM</span>' +
							'</div>' +
						'</div>' +
						'<div class="shop_item_price">' +
							'<div>' +
								'<span class="shop_item_number"></span>' +
								'<span class="shop_item_currency">€</span>' +
							'</div>' +
							'<span class="general_button">LISA KORVI</span>' +
						'</div>' +
						'<div class="clear"></div>' +
					'</li>'
};

(function($) {
	$.fn.kohvishop = function(options) {

		var settings = $.extend({
			width: 100,
			height: 100
		}, options);


		$('head').append('<link rel="stylesheet" href="css/main.css">');
		$(this).append(kohvishop.config.MAIN_HTML)
		$('#shop_cart_items').height(settings.height - 100);
		$('#shop_items_holder').height(settings.height - 50);
		for(var i = 0; i < 100; i++)
		{
			$('#shop_cart_items').append(kohvishop.config.CART_ITEM_HTML);
			$('#shop_items_holder').append(kohvishop.config.MAIN_ITEM_HTML);
		}
		//$('#shop_items').width($('#shop_items').width() - 1);
		// <div id="shop" style="width: 1280px; height: 800px; border: 1px solid red"></div>
	}

})(jQuery);
$(function() {
	$('#shop').kohvishop({ width: 1280, height: 800});
});

/*kohvishop.core = {
	init: function() {
		$('#shop_cart_items').height($(window).height() - 100);
	},
	resize: function() {
		$('#shop_cart_items').height($(window).height() - 100);
	}
};*/