$(document).ready(function() {
    $(window).on('scroll', function() {
        const scrollTop = $(this).scrollTop();
        const $navLogos = $('#nav-logos');
        const $navMain = $('#nav-main');

        if (scrollTop > 50) {
            $navLogos.addClass('hidden');
            $navMain.addClass('nav-main-scrolled');
        } else {
            $navLogos.removeClass('hidden');
            $navMain.removeClass('nav-main-scrolled');
        }
    });
});
