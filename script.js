gsap.registerPlugin(ScrollTrigger);
const root = document.documentElement;
const darkToggle = document.getElementById('darkModeToggle');
function setTheme(dark) {
    root.classList.toggle('dark', dark);
    darkToggle.setAttribute('aria-pressed', String(dark));
    darkToggle.textContent = dark ? 'Light Mode' : 'Dark Mode';
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) { }
}
let savedTheme = null;
try { savedTheme = localStorage.getItem('theme'); } catch (e) { }
setTheme(savedTheme ? savedTheme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches);
darkToggle.addEventListener('click', () => setTheme(!root.classList.contains('dark')));
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    e.target.reset();
    gsap.fromTo('#formMsg', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 });
});
let intro;
const mm = gsap.matchMedia();
mm.add('(prefers-reduced-motion: no-preference)', () => {
    intro = gsap.timeline({ defaults: { duration: 0.7, ease: 'power3.out' } });
    intro
        .from('header nav', { y: -60, opacity: 0 })
        .from('#hero h1', { y: 50, opacity: 0, duration: 0.9 }, '-=0.3')
        .from('#hero p', { y: 30, opacity: 0 }, '-=0.5')
        .from('#hero .cta > *', { y: 24, opacity: 0, stagger: 0.12 }, '-=0.4')
        .from('.hero-card', { scale: 0.85, opacity: 0, ease: 'back.out(1.6)' }, '<0.1');
    const page = { trigger: document.body, start: 'top top', end: 'bottom bottom' };
    gsap.to('#progressBar', { scaleX: 1, ease: 'none', scrollTrigger: { ...page, scrub: true } });
    gsap.utils.toArray('.blob').forEach((b) => {
        gsap.to(b, { y: () => -innerHeight * b.dataset.depth, ease: 'none', scrollTrigger: { ...page, scrub: 1 } });
    });
    gsap.to('#heroVisual', {
        yPercent: -30, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
    });
    const aboutText = document.getElementById('aboutText');
    aboutText.innerHTML = aboutText.textContent.trim().split(' ')
        .map((w) => `<span class="inline-block">${w}</span>`).join(' ');
    const words = aboutText.querySelectorAll('span');
    gsap.set(words, { opacity: 0.2 });
    gsap.to(words, {
        opacity: 1, stagger: 0.1, ease: 'none',
        scrollTrigger: { trigger: '#aboutPin', start: 'top top', end: '+=120%', pin: true, scrub: true, anticipatePin: 1 }
    });
    const track = document.getElementById('track');
    gsap.set('#trackWrap', { overflow: 'visible' });
    gsap.to(track, {
        x: () => -(track.scrollWidth - innerWidth),
        ease: 'none',
        scrollTrigger: {
            trigger: '#productsPin', start: 'top top', end: () => '+=' + track.scrollWidth,
            pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true
        }
    });
    gsap.utils.toArray('.reveal').forEach((el) => {
        const fadeOnly = el.hasAttribute('data-fade');
        gsap.fromTo(
            el,
            fadeOnly ? { opacity: 0 } : { opacity: 0, y: 50 },
            {
                opacity: 1, ...(fadeOnly ? {} : { y: 0 }), duration: 0.8, ease: 'power2.out',
                scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 20%', toggleActions: 'play reverse play reverse' }
            }
        );
    });
    gsap.utils.toArray('#work [data-speed]').forEach((card) => {
        gsap.to(card, {
            y: () => -parseFloat(card.dataset.speed) * 120, ease: 'none',
            scrollTrigger: { trigger: '#work', start: 'top bottom', end: 'bottom top', scrub: true }
        });
    });
    gsap.utils.toArray('.news').forEach((card) => {
        gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 95%', end: 'bottom 5%', scrub: true } })
            .fromTo(card, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.3 })
            .to(card, { opacity: 0, x: 40, duration: 0.3 }, 0.7);
    });
    ['about', 'services', 'products', 'work', 'news', 'contact'].forEach((id) => {
        ScrollTrigger.create({
            trigger: '#' + id, start: 'top 50%', end: 'bottom 50%',
            toggleClass: { targets: document.querySelector(`#nav a[href="#${id}"]`), className: 'active' }
        });
    });
});
document.getElementById('replayBtn').addEventListener('click', () => {
    if (intro) intro.restart();
});
window.addEventListener('load', () => ScrollTrigger.refresh());