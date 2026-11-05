const WHATSAPP_NUMBER = '905551234567';

const products = [
  { name: 'Günlük Neşe Tavuklu', category: 'Köpek', type: 'Mama', description: 'Dengeli içerik, mutlu kuyruklar için günlük destek.', art: 'pack', artClass: 'dog-food' },
  { name: 'Nazik Başlangıç Somonlu', category: 'Kedi', type: 'Mama', description: 'Hassas dostlar için tahılsız, nefis bir öğün.', art: 'pack', artClass: 'cat-food' },
  { name: 'Bulut Yatak', category: 'Köpek', type: 'Yatak', description: 'Günün en derin uykusu için yumuşak ve ferah.', art: 'bed', artClass: '' },
  { name: 'Pofuduk Kedi Yatağı', category: 'Kedi', type: 'Yatak', description: 'Pencere önü keyfine eşlik eden sıcacık bir yuva.', art: 'bed', artClass: 'cat-bed' },
  { name: 'Tırman & Dinlen', category: 'Kedi', type: 'Tırmalama', description: 'Oyun, tırmalama ve mola için kompakt bir alan.', art: 'scratch', artClass: '' },
  { name: 'Şehir Gezgini', category: 'Köpek', type: 'Aksesuar', description: 'Güvenli yürüyüşler için ayarlanabilir günlük tasma.', art: 'leash', artClass: '' },
  { name: 'Renkli Kanatlar', category: 'Kuş', type: 'Aksesuar', description: 'Kafes içi neşeyi artıran doğal ahşap oyuncak.', art: 'scratch', artClass: 'bird-toy' },
  { name: 'Minik Pati Tasması', category: 'Aksesuar', type: 'Aksesuar', description: 'Hafif, yumuşak ve minik dostlara uygun.', art: 'leash', artClass: 'tiny-leash' },
];

const productGrid = document.querySelector('#product-grid');
const filterButtons = [...document.querySelectorAll('.filter-chip')];

function whatsappUrl(productName = '') {
  const message = productName
    ? `Merhaba PatiYuva, ${productName} hakkında bilgi almak istiyorum.`
    : 'Merhaba PatiYuva, dostum için öneri almak istiyorum.';
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function artMarkup(product) {
  if (product.art === 'pack') return `<span class="art-pack ${product.artClass}"></span>`;
  if (product.art === 'bed') return `<span class="art-bed ${product.artClass}"></span>`;
  if (product.art === 'scratch') return `<span class="art-scratch ${product.artClass}"></span>`;
  return `<span class="art-leash ${product.artClass}"></span>`;
}

function productMarkup(product) {
  const categoryClass = product.category.toLocaleLowerCase('tr-TR').replace('ö', 'o').replace('ş', 's');
  return `<article class="product-card" data-category="${product.category}">
    <div class="product-art art-${categoryClass}">${artMarkup(product)}</div>
    <div class="product-info">
      <span class="product-category">${product.category} · ${product.type}</span>
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <a class="whatsapp-product" href="${whatsappUrl(product.name)}" target="_blank" rel="noreferrer"><span class="wa-symbol">◔</span> WhatsApp ile bilgi al</a>
    </div>
  </article>`;
}

function renderProducts(filter = 'Tümü') {
  const visible = filter === 'Tümü' ? products : products.filter((product) => product.category === filter || (filter === 'Aksesuar' && product.type === 'Aksesuar'));
  productGrid.innerHTML = visible.map(productMarkup).join('');
  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === filter;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-selected', String(isActive));
  });
}

filterButtons.forEach((button) => button.addEventListener('click', () => renderProducts(button.dataset.filter)));
const requestedCategory = new URLSearchParams(window.location.search).get('kategori');
const initialFilter = ['Kedi', 'Köpek', 'Kuş', 'Aksesuar'].includes(requestedCategory) ? requestedCategory : 'Tümü';
renderProducts(initialFilter);

const routeTargets = { home: 'home', products: 'urunler', about: 'hakkimizda', contact: 'iletisim' };
const routeLinks = [...document.querySelectorAll('[data-route]')];
const mobileMenu = document.querySelector('.mobile-menu');
const menuToggle = document.querySelector('.menu-toggle');
const routeMeta = {
  home: { title: 'PatiYuva Petshop — Her pati için iyi yaşam', description: 'PatiYuva Petshop — dostlarınız için özenle seçilmiş ürünler ve WhatsApp\'tan hızlı danışmanlık.' },
  products: { title: 'PatiYuva — Ürün kataloğu', description: 'Kedi, köpek, kuş ve aksesuar ürünlerini keşfedin; ürün adıyla WhatsApp\'tan bilgi alın.' },
  about: { title: 'PatiYuva — Hakkımızda', description: 'PatiYuva\'nın mahalle sıcaklığındaki petshop hikâyesini keşfedin.' },
  contact: { title: 'PatiYuva — İletişim', description: 'PatiYuva\'ya adres, WhatsApp ve iletişim formu üzerinden ulaşın.' },
};

function updateMeta(route) {
  const meta = routeMeta[route] || routeMeta.home;
  document.title = meta.title;
  document.querySelector('meta[name="description"]').setAttribute('content', meta.description);
}

function activateRoute(route) {
  const targetId = routeTargets[route] || 'home';
  const target = document.getElementById(targetId) || document.querySelector(`[data-page="${route}"]`) || document.getElementById('home');
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  routeLinks.forEach((link) => link.classList.toggle('is-current', link.dataset.route === route));
  updateMeta(route);
  if (mobileMenu.classList.contains('is-open')) closeMenu();
}

routeLinks.forEach((link) => link.addEventListener('click', (event) => {
  const route = link.dataset.route;
  if (!route) return;
  event.preventDefault();
  const url = route === 'home' ? '/' : `/${route === 'products' ? 'urunler' : route === 'about' ? 'hakkimizda' : 'iletisim'}`;
  window.history.pushState({ route }, '', url);
  activateRoute(route);
}));

document.querySelectorAll('[data-category]').forEach((link) => link.addEventListener('click', (event) => {
  event.preventDefault();
  renderProducts(link.dataset.category);
  window.history.pushState({ route: 'products', category: link.dataset.category }, '', `/urunler?kategori=${encodeURIComponent(link.dataset.category)}`);
  document.getElementById('urunler').scrollIntoView({ behavior: 'smooth', block: 'start' });
}));

function closeMenu() {
  mobileMenu.classList.remove('is-open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  menuToggle.setAttribute('aria-expanded', 'false');
}

menuToggle.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('is-open');
  mobileMenu.setAttribute('aria-hidden', String(!open));
  menuToggle.setAttribute('aria-expanded', String(open));
});

window.addEventListener('popstate', () => {
  const path = window.location.pathname;
  const route = path.includes('urunler') ? 'products' : path.includes('hakkimizda') ? 'about' : path.includes('iletisim') ? 'contact' : 'home';
  activateRoute(route);
});

const form = document.querySelector('#contact-form');
const success = document.querySelector('#form-success');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  const message = `Merhaba PatiYuva, ben ${data.name}. İletişim bilgilerim: ${data.contact}. Mesajım: ${data.message}`;
  const chatUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  const chatWindow = window.open(chatUrl, '_blank', 'noopener,noreferrer');
  if (!chatWindow) window.location.href = chatUrl;
  success.textContent = `${data.name}, mesajınız WhatsApp'ta açıldı. Göndermek için sohbet ekranını onaylayın.`;
  form.reset();
});

const initialCategory = new URLSearchParams(window.location.search).get('kategori');
if (initialCategory && ['Kedi', 'Köpek', 'Kuş', 'Aksesuar'].includes(initialCategory)) renderProducts(initialCategory);

const initialPath = window.location.pathname;
if (initialPath !== '/') {
  const initialRoute = initialPath.includes('urunler') ? 'products' : initialPath.includes('hakkimizda') ? 'about' : initialPath.includes('iletisim') ? 'contact' : 'home';
  setTimeout(() => activateRoute(initialRoute), 120);
}
