$(function() {
    var menuHeight, menuItems, scrollItems;

    menuHeight = $("#main-menu").height();

    menuItems = $("#main-menu ul li h3");

    scrollItems = $();

    menuItems.each(function(index, menuItem) {
	scrollItems.push($(menuItem).data("scroll-target"));
    });

    $(window).on("scroll", function() {
	var currentScrollItems, currentScrollItem, currentMenuItem;

	distanceFromTop = $(this).scrollTop() + menuHeight;

	currentScrollItems = $();

	scrollItems.each(function(index, scrollItem) {
	    if ($(scrollItem).offset().top < distanceFromTop) {
		currentScrollItems.push(scrollItem);
	    }
	});

	currentScrollItem = $(currentScrollItems.last()[0]);

	currentMenuItem = menuItems.filter(function(index, menuItem) {
	    return $(menuItem).data("scroll-target") === "#" + currentScrollItem.attr("id");
	});

        menuItems.removeClass("active");

	$(currentMenuItem).addClass("active");
    });
});
