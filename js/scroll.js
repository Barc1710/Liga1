document.addEventListener('DOMContentLoaded', () => {
    const navLogos = document.querySelector('.nav-logos');
    const navMain = document.querySelector('.nav-main');
    let lastScrollTop = 0;
    const scrollThreshold = 50;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > scrollThreshold) {
            navLogos.classList.add('hidden');
            navMain.classList.add('nav-main-scrolled');
        } else {
            navLogos.classList.remove('hidden');
            navMain.classList.remove('nav-main-scrolled');
        }
        
        lastScrollTop = scrollTop;
    }, { passive: true });
});