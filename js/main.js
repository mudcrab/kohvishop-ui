$(function() 
{
	resizeCart();
});
$(window).resize(function() {
	resizeCart();
})
function resizeCart() 
{
	$('#shop_cart_items').height($(window).height() - 100);
};