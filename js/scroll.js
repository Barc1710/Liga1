
document.addEventListener('DOMContentLoaded', function() {
    window.addEventListener('scroll', function() {
        const navLogos = document.getElementById('nav-logos');
        const navMain = document.getElementById('nav-main');
        
        if (window.scrollY > 50) {
            navLogos.classList.add('hidden');
            navMain.classList.add('nav-main-scrolled');
        } else {
            navLogos.classList.remove('hidden');
            navMain.classList.remove('nav-main-scrolled');
        }
    })

});



