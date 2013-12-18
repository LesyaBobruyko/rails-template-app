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
        var list= visibleSlide.parent();
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
    function regenerateSlides(){
        if($('.hidden-xs').is(':not(:visible)')){

        }
    }
    var lazyLayout = _.debounce(regenerateSlides, 300);
    $(window).resize(lazyLayout);
});