/* Оксана Гайчук — ведущая. © 2026 Полунин Лев */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  /* Шапка при прокрутке */
  var header = document.querySelector('.header');
  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Бургер */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  function setMenu(open) {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  }
  burger.addEventListener('click', function () { setMenu(burger.getAttribute('aria-expanded') !== 'true'); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  window.addEventListener('resize', function () { if (window.innerWidth > 1100) setMenu(false); });

  /* Печать «Нет.» на первом экране */
  var stamp = document.querySelector('.stamp');
  if (stamp) setTimeout(function () { stamp.classList.add('is-on'); }, 650);

  /* Видео: одно играет, остальные на паузе */
  var reels = [].slice.call(document.querySelectorAll('.reel'));
  reels.forEach(function (reel) {
    var v = reel.querySelector('video');
    var btn = reel.querySelector('.reel__play');
    function play() {
      reels.forEach(function (r) { if (r !== reel) r.querySelector('video').pause(); });
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
    }
    btn.addEventListener('click', play);
    v.addEventListener('click', function () { if (v.paused) play(); });
    v.addEventListener('play', function () { reel.classList.add('is-playing'); v.setAttribute('controls', ''); });
    v.addEventListener('pause', function () { reel.classList.remove('is-playing'); });
    v.addEventListener('ended', function () { reel.classList.remove('is-playing'); });
  });

  /* Слайдер отзывов */
  var slider = document.getElementById('slider');
  if (slider) {
    var track = slider.querySelector('.slider__track');
    var slides = [].slice.call(track.children);
    var dotsBox = document.getElementById('dots');
    var arrows = [].slice.call(document.querySelectorAll('.arrow'));
    var index = 0;
    var perView = function () { var w = window.innerWidth; return w <= 560 ? 1 : (w <= 860 ? 2 : 3); };
    var maxIndex = function () { return Math.max(0, slides.length - perView()); };
    var buildDots = function () {
      dotsBox.innerHTML = '';
      for (var i = 0; i <= maxIndex(); i++) {
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('role', 'tab');
        b.setAttribute('aria-label', 'Отзыв ' + (i + 1));
        b.setAttribute('data-i', i);
        dotsBox.appendChild(b);
      }
    };
    var go = function (i) {
      index = Math.max(0, Math.min(i, maxIndex()));
      var cs = getComputedStyle(track);
      var gap = parseFloat(cs.columnGap) || parseFloat(cs.gap) || 0;
      var step = slides[0].getBoundingClientRect().width + gap;
      track.style.transform = 'translate3d(' + (-index * step) + 'px,0,0)';
      [].forEach.call(dotsBox.children, function (d, k) { d.setAttribute('aria-selected', String(k === index)); });
      arrows[0].disabled = index === 0;
      arrows[1].disabled = index === maxIndex();
      slides.forEach(function (s, k) { s.setAttribute('aria-hidden', String(k < index || k >= index + perView())); });
    };
    arrows.forEach(function (a) { a.addEventListener('click', function () { go(index + Number(a.getAttribute('data-dir'))); }); });
    dotsBox.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) go(Number(b.getAttribute('data-i'))); });
    slider.setAttribute('tabindex', '0');
    slider.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') go(index - 1);
      if (e.key === 'ArrowRight') go(index + 1);
    });
    /* свайп пальцем */
    var x0 = null, y0 = null;
    slider.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    slider.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(index + (dx < 0 ? 1 : -1));
      x0 = null;
    }, { passive: true });
    var rt;
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { buildDots(); go(index); }, 120); });
    buildDots(); go(0);
  }

  /* Форма → WhatsApp с готовым сообщением */
  var form = document.getElementById('form');
  if (form) {
    var dateInput = form.elements.date;
    var t = new Date(); t.setMinutes(t.getMinutes() - t.getTimezoneOffset());
    dateInput.min = t.toISOString().slice(0, 10);
    var err = document.getElementById('formErr');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!dateInput.value) {
        err.hidden = false;
        dateInput.setAttribute('aria-invalid', 'true');
        dateInput.focus();
        return;
      }
      err.hidden = true;
      dateInput.removeAttribute('aria-invalid');
      var d = dateInput.value.split('-');
      var name = form.elements.name.value.trim();
      var msg = 'Здравствуйте, Оксана!' +
        (name ? ' Меня зовут ' + name + '.' : '') +
        ' Планирую: ' + form.elements.type.value + ', дата ' + d[2] + '.' + d[1] + '.' + d[0] +
        (form.elements.guests.value ? ', гостей примерно ' + form.elements.guests.value : '') +
        '. Свободна ли эта дата?';
      window.location.href = 'https://wa.me/79501374449?text=' + encodeURIComponent(msg);
    });
  }

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
