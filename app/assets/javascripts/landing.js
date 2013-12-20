jQuery.fn.nextOrFirst = function (selector) {
    var next = this.next(selector);
    return (next.length) ? next : this.prevAll(selector).last();
}
jQuery.fn.prevOrLast = function (selector) {
    var prev = this.prev(selector);
    return (prev.length) ? prev : this.nextAll(selector).last();
}
$(function () {
    var sliderWorking = false;
    $('.next').click(move);
    $('.previous').click(move);

    function move() {
        var isForward = $(this).hasClass('next');
        if (sliderWorking)  return;
        sliderWorking = true;
        var visibleSlide = $('.slide:visible');
        var firstLiWidth = visibleSlide.outerWidth();
        var nextSlide = (isForward) ? visibleSlide.nextOrFirst() : visibleSlide.prevOrLast();
        var list = visibleSlide.parent();
        list.css({height: list.height()});
        visibleSlide.css({position: 'absolute'});
        nextSlide.css({position: 'absolute', left: (isForward) ? firstLiWidth : -firstLiWidth}).removeClass('hidden');
        visibleSlide.animate({left: (isForward) ? -firstLiWidth : firstLiWidth}, {duration: 400, complete: function () {
            visibleSlide.addClass("hidden");
        }});
        nextSlide.animate({left: 0}, {duration: 400, complete: function () {
            sliderWorking = false;
            nextSlide.removeAttr('style');
            visibleSlide.removeAttr('style');
            list.removeAttr('style')
        }});
    }

    function regenerateSlides() {
        var slider = $('.slider'),
            allDivs = slider.find('div'),
            allDivsLength,
            testDiv = $("<span class='hidden-xs'>&nbsp</span>"),
            visibleSlide = slider.find('li:visible'),
            divsForFirstLi,
            amountOfDivs,
            regeneratedList = '';
        visibleSlide.append(testDiv);
        if (testDiv.is(':hidden')) {
            amountOfDivs = 2;
        }
        else {
            if (testDiv.attr('class', 'hidden-sm').is(':hidden') ||
                testDiv.attr('class', 'hidden-md').is(':hidden')) {
                amountOfDivs = 3;
            } else if (testDiv.attr('class', 'hidden-lg').is(':hidden')) {
                amountOfDivs = 4;
            }
        }
        testDiv.remove();
        console.log(amountOfDivs);
        var li = $('<li/>').addClass('slide');
        divsForFirstLi = allDivs.filter(':lt(' + (amountOfDivs - 1) + ')');
        allDivs = allDivs.filter(':gt(' + (amountOfDivs - 2) + ')');
        li.append(divsForFirstLi);
        allDivsLength = allDivs.length;
        regeneratedList += "<li class='slide hidden'>";
        for (var i = 0; i < allDivsLength; i++) {
            if (i % amountOfDivs == 0 && i != 0) {
                regeneratedList += "</li><li class='slide hidden'>";
            }
            regeneratedList += allDivs[i].outerHTML;
        }
        regeneratedList += "</li>";
        slider.html(li).append(regeneratedList);
        slider.find('.slide:eq(0)').find('div:eq(0)').attr('class', 'col-xs-12 col-sm-8 col-lg-6').end().find('div:eq(1)').attr('class', 'col-sm-4 col-lg-3 hidden-xs').end().find('div:eq(2)').attr('class', 'hidden-md col-lg-3 hidden-xs hidden-sm');
        slider.find('.slide:gt(0)').find('div:eq(0), div:eq(1)').attr('class', 'col-xs-6 col-sm-4 col-lg-3').end().find('div:eq(2)').attr('class', 'col-sm-4 col-lg-3 hidden-xs').end().find('div:eq(3)').attr('class', 'col-lg-3 hidden-md hidden-xs hidden-sm');
    }

    var lazyLayout = _.debounce(regenerateSlides, 300);
    $(window).resize(lazyLayout);
});