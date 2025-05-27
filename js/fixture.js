$(document).ready(function() {
    const jornadasSwiper = new Swiper('.jornadas-swiper', {
        slidesPerView: 'auto',
        spaceBetween: 8,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            320: {
                slidesPerView: 3,
            },
            480: {
                slidesPerView: 4,
            },
            768: {
                slidesPerView: 6,
            },
            1024: {
                slidesPerView: 8,
            }
        }
    });

    // Manejar el clic en los botones de jornada
    $('.jornada-btn').on('click', function() {
        $('.jornada-btn').removeClass('active');
        $(this).addClass('active');
    });
}); 