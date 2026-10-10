/* Keep mobile navigation usable by keyboard, touch and assistive technology. */
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
const labels = document.documentElement.lang.startsWith('zh') ? ['打开导航', '关闭导航'] : ['Open navigation', 'Close navigation'];
function setMenu(open) {
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', labels[Number(open)]);
  nav.classList.toggle('is-open', open);
}
toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
nav.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setMenu(false); toggle.focus(); } });
const mobile = window.matchMedia('(max-width: 900px)');
mobile.addEventListener('change', () => setMenu(false));

/* Keep the section context when switching language on a homepage. */
const sectionLinks = [...nav.querySelectorAll('a[href*="#"]')];
const sections = sectionLinks.map(link => document.getElementById(new URL(link.href).hash.slice(1))).filter(Boolean);
const languageLink = nav.querySelector('.language');
function syncLanguageSection() {
  if (!sections.length || !languageLink) return;
  const translated = new URL(languageLink.href);
  translated.hash = window.location.hash;
  languageLink.href = translated.pathname + translated.hash;
}
syncLanguageSection();
window.addEventListener('hashchange', syncLanguageSection);

if (sections.length && 'IntersectionObserver' in window) {
  const visibleSections = new Set();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) visibleSections.add(entry.target.id);
      else visibleSections.delete(entry.target.id);
    });
    const current = sections.find(section => visibleSections.has(section.id));
    sectionLinks.forEach(link => {
      if (current && new URL(link.href).hash === '#' + current.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, {rootMargin: '-15% 0px -45% 0px'});
  sections.forEach(section => observer.observe(section));
}
