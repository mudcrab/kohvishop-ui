(function($) {
	$.fn.kohvishop = function(options) {
		var main = $(this);
		var items = [];
		var mainHTML = '<div id="shop_items"><div class="shop_titlebar">TOOTED</div><ul id="shop_items_holder"></ul></div><div id="shop_cart"><div id="shop_title" class="shop_titlebar"><div id="cart_title">OSTUKORV</div><div id="pay">ORDER</div><div class="clear"></div></div><ul id="shop_cart_items"></ul><div id="shop_total"><div class="shop_titlebar">KOKKU</div><div class="shop_total"><span class="shop_total_text">0</span><span class="shop_total_currency"> €</span></div><div class="clear"></div></div> </div>';
		var settings = $.extend({
			width: 100,
			height: 100,
			api: 'http://localhost/',
			currency: '€',
		}, options);
		var hash = null;
		var checkout_visible = false;
		main.append(mainHTML);
		$('#shop_cart_items').height(settings.height - 100);
		$('#shop_items_holder').height(settings.height - 50);

		var toggleCheckout = function() {
			var html = '<div id="shop_checkout_holder">' +
							'<div id="shop_checkout">' +
								'<div id="shop_checkout_title" class="shop_titlebar">ORDER CHECKOUT <div class="cross" id="shop_checkout_close"></div><div class="clear"></div></div>' +
								'<div id="shop_checkout_content"><ul id="shop_credidentials_list">' +
									'<li><p>Name</p><input class="shop_input" type="text" placeholder="Example Customer" /></li>' +
									'<li><p>E-mail</p><input class="shop_input" type="text" placeholder="customer@example.com" /></li>' +
									'<li><p>Phone</p><input class="shop_input" type="text" placeholder="+372 133 713 37" /></li>' +
									'<li><p>Shipping address</p><textarea class="shop_textarea" placeholder="Some address"></textarea></li>' +
									'<li><p>Note to us</p><textarea class="shop_textarea" placeholder="Some info"></textarea></li>' +
								'</ul><div class="clear"></div>' +
								'<div id="shop_checkout_actions"><div id="shop_action_order" class="general_button">PLACE ORDER</div></div>' +
								'<h1 id="shop_co_thanks">THANKS</h1>'
							'</div>' +
						'</div>';
			if(!checkout_visible)
			{
				main.append(html);
				var e = $('#shop_checkout');
				e.css({ marginLeft: -(e.width() / 2), marginTop: -(e.height() / 2) });
				$('#shop_credidentials_list').height(e.height() - 100);
				checkout_visible = true;
			}
			else
			{
				$('#shop_checkout_holder').remove();
				checkout_visible = false;
			}
		};

		var addToCart = function(title, id, price) {
			var html = '<li class="shop_cart_item" data-id="' + id + '" data-title="' + title + '" data-price="' + price + '">' +
						'<div class="shop_cart_item_text">' + title + '</div>' +
						'<div class="shop_cart_item_action cross"></div>' +
						'<div class="shop_cart_item_price">' + price + ' ' + settings.currency + '</div>' +
						'<div class="clear"></div>' +
					'</li>';
			if($('.shop_cart_item[data-id=' + id + ']').last().length > 0)
				$('.shop_cart_item[data-id=' + id + ']').last().after(html);
			else
				$('#shop_cart_items').append(html);

			items.push(id);
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
									'<span class="shop_item_currency">' + settings.currency + '</span>' +
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
			if(total > 0)
				$('#pay').fadeIn();
			else
				$('#pay').fadeOut();
			$('.shop_total_text').html(total);
		};

		var updatePadding = function() {
			for(var i = 0; i < items.length; i++)
			{
				var el = $('.shop_cart_item[data-id=' + items[i] + '] .shop_cart_item_text').first();
				if(!el.hasClass('unpadded'))
					el.addClass('unpadded');
			}
		};

		var populateItems = function() {
			if(window.location.hash != '' && window.location.hash != '#')
				hash = window.location.hash.replace('#', '');

			var url = hash == null ? 'items' : 'items/category/' + hash;
			$.get(settings.api + url, function(data) {
				if(data.length > 0)
				{
					$('#shop_items_holder').empty();
					$.each(data, function(index, item) {
						addShopItem(item.name, item.description, item.price, item.id);
					});
				}
			}, 'json');
		};

		$(window).on('hashchange', populateItems);

		populateItems();

		$(document).on('click', '.shop_item .general_button', function() {
			var data = $(this).data();
			addToCart(data.title, data.id, data.price);
			updateTotal(data.price);
			updatePadding();
		});

		$(document).on('click', '.shop_cart_item_action', function(e) {
			var data = $(this).parent().data();
			updateTotal(-data.price);
			$(this).parent().remove();
			updatePadding();
		});

		$(document).on('click', '#shop_checkout_close', function(e) {
			toggleCheckout();
		});

		$(document).on('click', '#pay', function(e) {
			toggleCheckout();
		});
	}

})(jQuery);
$(function() {
	$('#shop').kohvishop({ width: 1280, height: 800, api: kohvishop_api, img: kohvishop_img });
});