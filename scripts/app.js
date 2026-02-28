(() => {
  'use strict';

  /* ========================================
     1. Mobile Nav Toggle
     ======================================== */
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('nav-open');
      hamburger.classList.toggle('is-active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    const closeMenu = () => {
      navMenu.classList.remove('nav-open');
      hamburger.classList.remove('is-active');
      hamburger.setAttribute('aria-expanded', 'false');
    };

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (e) => {
      if (!navMenu.classList.contains('nav-open')) return;
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        closeMenu();
      }
    });
  }

  /* ========================================
     2. Menu Filter & Load More
     ======================================== */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const menuCards = Array.from(document.querySelectorAll('.menu-card'));
  const btnLoadMore = document.getElementById('btn-load-more');
  const menuActionsContainer = document.getElementById('menu-actions-container');

  const itemsPerLoad = 6;
  let currentlyShown = itemsPerLoad;
  let currentCategory = 'all';

  // Fungsi untuk me-render card sesuai kategori & batasan jumlah
  const renderMenuCards = () => {
    // Saring card berdasarkan kategori saat ini
    const filteredCards = menuCards.filter((card) => {
      if (currentCategory === 'all') return true;
      return card.dataset.category === currentCategory;
    });

    // Sembunyikan semua card terlebih dahulu
    menuCards.forEach(card => card.style.display = 'none');

    // Tampilkan hanya sebanyak `currentlyShown` dari card yang sudah difilter
    filteredCards.slice(0, currentlyShown).forEach((card) => {
      card.style.display = 'flex';
    });

    // Cek apakah masih ada card tersisa untuk ditampilkan
    if (currentlyShown >= filteredCards.length) {
      menuActionsContainer.style.display = 'none';
    } else {
      menuActionsContainer.style.display = 'block';
    }
  };

  // Inisialisasi awal
  renderMenuCards();

  // Event listener tombol load more (tampilkan lebih banyak)
  if (btnLoadMore) {
    btnLoadMore.addEventListener('click', () => {
      currentlyShown += itemsPerLoad;
      renderMenuCards();
    });
  }

  // Event listener untuk tombol filter kategori
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      
      currentCategory = btn.dataset.filter;
      currentlyShown = itemsPerLoad; // Reset jumlah tampilan ke awal setiap ganti kategori
      
      renderMenuCards();
    });
  });

  /* ========================================
     3. Smooth Scroll untuk anchor links
     ======================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      
      // Close menu before measuring to get accurate collapsed height
      if (navMenu && navMenu.classList.contains('nav-open')) {
        navMenu.classList.remove('nav-open');
        if (hamburger) {
          hamburger.classList.remove('is-active');
          hamburger.setAttribute('aria-expanded', 'false');
        }
      }
      
      const topbarHeight = document.querySelector('.topbar')?.offsetHeight || 0;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - topbarHeight - 12;

      window.scrollTo({
        top: targetPos,
        behavior: 'smooth'
      });
    });
  });
})();
