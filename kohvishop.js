(function($) {
	$.fn.kohvishop = function(options) {
		var main = $(this);
		var items = [], apiItems = {};
		var mainHTML = '<div class="shop_titlebar"><span id="back">TAGASI</span><span class="shop_total_text">0</span><span> €</span><span id="pay" style="float: right;">OSTUKORV</span><div class="clear"></div></div>' + 
						'<div id="kohvishop_content"><ul id="shop_items_holder"></ul>' +
						'<ul id="shop_cart_items"></ul></div>';
		var settings = $.extend({
			width: main.width(),
			height: main.height(),
			api: 'http://localhost/',
			currency: '€',
			img: 'http://localhost/img/'
		}, options);
		var hash = null;
		var checkout_visible = false;
		var view = 'products';
		main.css('overflow', 'hidden');
		init();

		var showCart = function() {
			$('#kohvishop_content').css('margin-top', ('-' + 450 + 'px'));
			$('#shop_items_holder').css('visibility', 'hidden');
			$('#back').fadeIn();
			$('#pay').css('background', '#ed145b').html('TELLI');
			view = 'cart';
		};

		var hideCart = function() {
			$('#kohvishop_content').css('margin-top', ('0px'));
			$('#shop_items_holder').css('visibility', 'visible');
			$('#back').fadeOut();
			$('#pay').css('background', '#dfd76f').html('OSTUKORV');
			view = 'products';
		};

		var resetShop = function() {
			main.empty();
			init();
		};

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

		var addShopItem = function(title, description, price, quantity, id) {
			var html = '<li class="shop_item">' +
							'<div class="shop_item_pic"><div class="shop_item_price">' + price + ' ' + settings.currency + '</div></div>' +
								'<div class="shop_item_content">' +
									'<div class="shop_item_actions">' +
										'<div class="shop_add_to_cart" data-id="' + id + '" data-title="' + title + '" data-price="' + price + '" data-quantity="' + quantity + '"><div class="shop_cart_img"></div></div>' +
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
			optimizeView();
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
						if(item.quantity > 0)
							addShopItem(item.name, item.description, item.price, item.quantity, item.id);
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

			var e = $(this).parent().parent().parent();
			$.get(settings.api + '/items/item/' + data.id, function(item) {
				if(item.quantity > 0)
				{
					var cart = countArray(items);
					if(typeof cart[1][cart[0].indexOf(data.id)] == 'undefined' || cart[1][cart[0].indexOf(data.id)] < data.quantity)
					{
						addToCart(data.title, data.id, data.price);
						updateTotal(data.price);
						updatePadding();
					}
					else
					{
						alert('Eelmine oli viimane')
					}
				}
				else
				{
					alert('Kahjuks müüdi just viimane!');
					e.remove();
				}
			}, 'json');
		});

		$(document).on('click', '.shop_cart_item_action', function(e) {
			var data = $(this).parent().data();
			updateTotal(-data.price);
			$.each(items, function(i, item) {
				if(item == data.id) {
					items.splice(items.indexOf(item), 1);
					return false;
				}
			});
			$(this).parent().remove();
			updatePadding();
		});

		$(document).on('click', '#shop_checkout_close', function(e) {
			toggleCheckout();
		});

		$(document).on('click', '#pay', function(e) {
			if(view == 'products')
				showCart();
			else if(view == 'cart')
				toggleCheckout();
		});

		$(document).on('click', '#back', function(e) {
			hideCart();
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
						var temp = [];

						$.each(cart[0], function(k, v) {
							$.get(settings.api + '/items/item/' + v, function(item_) {
								if(item_.quantity > 0)
								{
									temp.push(v)
									if(temp.length == cart[0].length)
									{
										$.each(cart[0], function(key, val) {
											$.get(settings.api + 'cart/item/add/' + [val, cart[1][key], data.id].join('/'), function(d) {}, 'json');
											if((cart[0].length - 1) == key) {
												$.get(settings.api + 'cart/co/' + data.id, function(done) {  });
												$('#shop_co_thanks').show();
												setTimeout(function () { resetShop(); }, 3000);
											}
										});
									}
								}
							}, 'json');
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

		function processCheckout(cart) {
			console.log('processing')
			$.each(cart[0], function(key, val) {
				$.get(settings.api + 'cart/item/add/' + [val, cart[1][key], data.id].join('/'), function(d) {}, 'json');
				if((cart[0].length - 1) == key) {
					$.get(settings.api + 'cart/co/' + data.id, function(done) { console.log(done) });
					$('#shop_co_thanks').show();
					setTimeout(function () { resetShop(); }, 3000);
				}
			});
		};
		
		function init() {
			main.append(mainHTML);
			if(settings.height < 100)
			{
				settings.height = 500;
				main.height(500);
				$('#kohvishop_content').height(settings.height * 2);
			}
			if(settings.width < 600)
			{
				settings.width = 600;
				main.width(600);
				$('#kohvishop_content').width(settings.width);
			}
			$('#shop_cart_items').height(settings.height - 50);
			$('#shop_items_holder').height(settings.height - 50);

			var items = [];
			var checkout_visible = false;
			var view = 'products';
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