window.kohvishop = window.kohvishop || {}

kohvishop.config = {
	API_PATH: '',
};

(function($) {
	$.fn.kohvishop = function(options) {
		var mainHTML = '<div id="shop_items"><div class="shop_titlebar">TOOTED</div><ul id="shop_items_holder"></ul></div><div id="shop_cart"><div id="shop_title" class="shop_titlebar">OSTUKORV</div><ul id="shop_cart_items"></ul><div id="shop_total"><div class="shop_titlebar">KOKKU</div><div class="shop_total"><span class="shop_total_text">0</span><span class="shop_total_currency"> €</span></div><div class="clear"></div></div> </div>';
		var settings = $.extend({
			width: 100,
			height: 100,
			api: 'http://localhost/'
		}, options);
		$(this).append(mainHTML);
		$('#shop_cart_items').height(settings.height - 100);
		$('#shop_items_holder').height(settings.height - 50);
		
		var addToCart = function(title, id, price) {
			var class_ = '';
			$('.shop_cart_item').each(function(i) { $(this).data().id == id ? class_ = ' padded' : '' });
			var html = '<li class="shop_cart_item" data-id="' + id + '" data-title="' + title + '" data-price="' + price + '">' +
						'<div class="shop_cart_item_text' + class_ + '">' + title + '</div>' +
						'<div class="shop_cart_item_action">—</div>' +
						'<div class="shop_cart_item_price">' + price + ' €</div>' +
						'<div class="clear"></div>' +
					'</li>';
			$('#shop_cart_items').append(html);
		};

		var addShopItem = function(title, description, price, id) {
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
								'<span class="general_button" data-id="' + id + '" data-title="' + title + '" data-price="' + price + '">LISA KORVI</span>' +
							'</div>' +
							'<div class="clear"></div>' +
						'</li>';
			$('#shop_items_holder').append(html);
		};

		var updateTotal = function(price) {
			var total = Number($('.shop_total_text').html());
			total += price;
			$('.shop_total_text').html(total);
		};

		addShopItem('test', 'Some stuff', 100, 1);

		$(document).on('click', '.shop_item .general_button', function() {
			var data = $(this).data();
			addToCart(data.title, data.id, data.price);
			updateTotal(data.price);
		});

		$(document).on('click', '.shop_cart_item_action', function(e) {
			updateTotal(-$(this).parent().data().price);
			$(this).parent().remove();
		});

	}

})(jQuery);
var rest = {};
$(function() {
	$('#shop').kohvishop({ width: 1280, height: 800, api: 'http://localhost:3000/'});
});