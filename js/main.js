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
					'</div>'
};

(function($) {
	$.fn.kohvishop = function(options) {

		var settings = $.extend({
			width: 100,
			height: 100,
			api: 'http://localhost/'
		}, options);

		$('#shop_cart_items').height(settings.height - 100);
		$('#shop_items_holder').height(settings.height - 50);		
		$(this).append(kohvishop.config.MAIN_HTML)
		
		var addToCart = function(title, price) {
			var html = '<li class="shop_cart_item">' +
						'<div class="shop_cart_item_text">' + title + '</div>' +
						'<div class="shop_cart_item_action">—</div>' +
						'<div class="shop_cart_item_price">' + price + ' €</div>' +
						'<div class="clear"></div>' +
					'</li>';
			$('#shop_cart_items').append(html);
		};

		var addShopItem = function(title, description, price, item_id) {
			var html = '<li class="shop_item">' +
							'<div class="shop_item_pic"></div>' +
							'<div class="shop_item_content">' +
								'<div class="shop_item_content_texts">' +
									'<h1>' + title + '</h1>' +
									'<p>' + description + '</p>' +
								'</div>' +
								'<div class="shop_item_content_action">' +
									'<span class="general_button">ROHKEM</span>' +
								'</div>' +
							'</div>' +
							'<div class="shop_item_price">' +
								'<div>' +
									'<span class="shop_item_number">' + price + '</span>' +
									'<span class="shop_item_currency">€</span>' +
								'</div>' +
								'<span class="general_button" data-item="' + item_id + '">LISA KORVI</span>' +
							'</div>' +
							'<div class="clear"></div>' +
						'</li>';
			$('#shop_items_holder').append(html);
		};

		addToCart('test', 5)
		addShopItem('test', 'Some stuff', 100, 1);

	}

})(jQuery);
var rest = {};
$(function() {
	$('#shop').kohvishop({ width: 1280, height: 800, api: 'http://localhost:3000/'});
});