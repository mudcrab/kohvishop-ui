(function($) {
	$.fn.kohvishop = function(options) {
		var main = $(this);
		var items = [], apiItems = {};
		var mainHTML = '<div id="shop_items"><div class="shop_titlebar"></div><ul id="shop_items_holder"></ul></div><div id="shop_cart"><div id="shop_title" class="shop_titlebar"><div id="cart_title">OSTUKORV</div><div id="pay">TELLI</div><div class="clear"></div></div><ul id="shop_cart_items"></ul><div id="shop_total"><div class="shop_titlebar">KOKKU</div><div class="shop_total"><span class="shop_total_text">0</span><span class="shop_total_currency"> €</span></div><div class="clear"></div></div> </div>';
		var settings = $.extend({
			width: main.width(),
			height: main.height(),
			api: 'http://localhost/',
			currency: '€',
		}, options);
		var hash = null;
		var checkout_visible = false;
		
		init();

		var toggleCheckout = function() {
			var html = '<div id="shop_checkout_holder">' +
							'<div id="shop_checkout">' +
								'<div id="shop_checkout_title" class="shop_titlebar">TELLIMINE <div class="cross" id="shop_checkout_close"></div><div class="clear"></div></div>' +
								'<div id="shop_checkout_content"><ul id="shop_credidentials_list">' +
									'<li><p>Nimi</p><input class="shop_input" type="text" placeholder="Sinu Nimi" id="_kohvishop_name" /></li>' +
									'<li><p>E-mail</p><input class="shop_input" type="text" placeholder="sinu.nimi@example.com" id="_kohvishop_email" /></li>' +
									'<li><p>Telefon</p><input class="shop_input" type="text" placeholder="+372 133 713 37" id="_kohvishop_phone" /></li>' +
									'<li><p>Postiaadress</p><textarea class="shop_textarea" placeholder="" id="_kohvishop_address" ></textarea></li>' +
									'<li><p>Märkused</p><textarea class="shop_textarea" placeholder="" id="_kohvishop_info"></textarea></li>' +
								'</ul><div class="clear"></div>' +
								'<div id="shop_checkout_actions"><div id="shop_action_order" class="general_button">TELLI!</div></div>' +
								'<h1 id="shop_co_thanks">THANKS</h1>'
							'</div>' +
						'</div>';
			if(!checkout_visible)
			{
				main.append(html);
				var e = $('#shop_checkout');
				if(settings.height < 700) 
					e.css('height', '98%');
				
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
									'<div class="shop_item_actions">' +
										'<div class="shop_add_to_cart" data-id="' + id + '" data-title="' + title + '" data-price="' + price + '"><div class="shop_cart_img"></div></div>' +
										'<div class="shop_item_price">' + price + ' ' + settings.currency + '</div>' +
									'</div>' +
									'<div class="shop_item_txt">' +
										'<h1>' + title + '<div class="shop_show_hide"><div class="shop_show_hide_bgr shop_show_hide_down"></div></div><div class="clear"></div></h1>' +
										'<p>' + description + '</p>' +
									'</div>' +
									'<div class="clear"></div>' +
								'</div>' +
							'<div class="clear"></div>' +
						'</li>'

			$('#shop_items_holder').append(html);
			
			optimizeView()
			//$('.shop_item_content').width($('.shop_item').width() - $('.shop_item_pic').width() - $('.shop_item_price').width() - 30);
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
				apiItems = data;
				if(data.length > 0)
				{
					$('#shop_items_holder').empty();
					$.each(data, function(index, item) {
						addShopItem(item.name, item.description, item.price, item.id);
					});
				}
			}, 'json');
		};

		function optimizeView() {

			if(settings.width < 700)
			{
				if(!$('#shop_cart').hasClass('shop_small_cart')) 
					$('#shop_cart').addClass('shop_small_cart');

				$('.shop_item_pic').addClass('shop_small_pictures');
			}
			$('.shop_item_txt').width($('.shop_item').width() - 40 - $('.shop_item_pic').first().width() - $('.shop_item_actions').width());
		};

		function countArray(arr) {
			var a = [], b = [], prev;
			arr.sort();
			for ( var i = 0; i < arr.length; i++ ) {
				if ( arr[i] !== prev ) {
					a.push(arr[i]);
					b.push(1);
				} else {
					b[b.length-1]++;
				}
				prev = arr[i];
			}
			return [a, b];
		};

		function handleResize() {
			$('.shop_item_content').width($('.shop_item').width() - $('.shop_item_pic').width() - $('.shop_item_price').width() - 30);
		};

		$(window).on('hashchange', populateItems);

		$(document).on('click', '.shop_add_to_cart', function() {
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

		$(document).on('click', '.shop_show_hide', function(e) {
			var parent = $(this).parent().parent().parent();
			var item = parent.find('.shop_item_txt');
			var p = parent.find('p');
			var sh = parent.find('.shop_show_hide_bgr');

			if(item.height() < p.height())
			{
				item.height(p.height())
				sh.removeClass('shop_show_hide_down');
				sh.addClass('shop_show_hide_up');
			}
			else if(item.height() == p.height())
			{
				item.height(140);
				sh.removeClass('shop_show_hide_up');
				sh.addClass('shop_show_hide_down');
			}
		});

		$(document).on('click', '#shop_action_order', function(e) {
			var fields = {
				checkout_customer_address: $('#_kohvishop_address').val(),
				checkout_customer_mail: $('#_kohvishop_email').val(),
				checkout_customer_name: $('#_kohvishop_name').val(),
				checkout_customer_note: $('#_kohvishop_info').val(),
				checkout_customer_phone: $('#_kohvishop_phone').val()
			};
			if(fields.checkout_customer_name !== '' && fields.checkout_customer_phone !== '' && 
				fields.checkout_customer_address !== '' && fields.checkout_customer_mail !== '')
			{
				$.post(settings.api + '/cart/add', fields, function(data) {
					if(data.id !== null)
					{
						var cart = countArray(items);
						$.each(cart[0], function(key, val) {
							$.get(settings.api + 'cart/item/add/' + [val, cart[1][key], data.id].join('/'), function(d) {}, 'json');
						});
					}
				}, 'json');
			}
			else
			{
				$('input[id^="_kohvishop_"]').each(function(key, _input) {
					if($(_input).val() == "")
						$(_input).addClass('input_flash')
				});
				if($('#_kohvishop_address').val() == "")
					$('#_kohvishop_address').addClass('input_flash');
			}
		});
		
		function init() {
			main.append(mainHTML);
			if(settings.height < 500)
			{
				settings.height = 500;
				main.height(500);
			}
			if(settings.width < 600)
			{
				settings.width = 600;
				main.width(600);
			}
			$('#shop_cart_items').height(settings.height - 100);
			$('#shop_items_holder').height(settings.height - 50);
			// for some reason DOM would be populatd only with main html 50% of the time the page came up
			setTimeout(function(){populateItems()}, 100);
		};

	}

})(jQuery);
if(kohvishop_tag !== 'undefined' && kohvishop_tag !== '' && kohvishop_api !== 'undefined' && kohvishop_api !== '' && kohvishop_img !== 'undefined' && kohvishop_img !== '')
{
	$(function() {
		$(kohvishop_tag).kohvishop({ api: kohvishop_api, img: kohvishop_img });
	});
}