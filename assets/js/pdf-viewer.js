/* ============================================================
   PDF FLIPBOOK VIEWER
   Renders any [data-pdf] link as a book-style modal with two
   facing pages and left/right arrow navigation.
   Powered by PDF.js (loaded on demand from CDN on first click).
   ============================================================ */

(function () {
  'use strict';

  var PDFJS_BASE = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/';
  var pdfjsReady = null;

  function loadPdfJs() {
    if (pdfjsReady) return pdfjsReady;
    pdfjsReady = new Promise(function (resolve, reject) {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_BASE + 'pdf.worker.min.js';
        return resolve(window.pdfjsLib);
      }
      var s = document.createElement('script');
      s.src = PDFJS_BASE + 'pdf.min.js';
      s.onload = function () {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_BASE + 'pdf.worker.min.js';
        resolve(window.pdfjsLib);
      };
      s.onerror = function () {
        reject(new Error('PDF.js CDN ачаалж чадсангүй'));
      };
      document.head.appendChild(s);
    });
    return pdfjsReady;
  }

  function createOverlay() {
    var overlay = document.createElement('div');
    overlay.className = 'pdf-flipbook-overlay';
    overlay.innerHTML =
      '<div class="pdf-flipbook-header">' +
        '<span class="pdf-flipbook-title"></span>' +
        '<span class="pdf-flipbook-page">— / —</span>' +
      '</div>' +
      '<button class="pdf-flipbook-close" aria-label="Хаах">×</button>' +
      '<button class="pdf-flipbook-nav pdf-flipbook-prev" aria-label="Өмнөх">‹</button>' +
      '<div class="pdf-flipbook-stage">' +
        '<div class="pdf-flipbook-loader">PDF ачаалж байна…</div>' +
        '<div class="pdf-flipbook-book">' +
          '<canvas class="pdf-flipbook-page-canvas pdf-flipbook-left"></canvas>' +
          '<canvas class="pdf-flipbook-page-canvas pdf-flipbook-right"></canvas>' +
        '</div>' +
      '</div>' +
      '<button class="pdf-flipbook-nav pdf-flipbook-next" aria-label="Дараах">›</button>';
    document.body.appendChild(overlay);
    return overlay;
  }

  function openPdf(url, title) {
    var overlay = createOverlay();
    overlay.querySelector('.pdf-flipbook-title').textContent = title || '';
    document.body.style.overflow = 'hidden';

    var leftCanvas = overlay.querySelector('.pdf-flipbook-left');
    var rightCanvas = overlay.querySelector('.pdf-flipbook-right');
    var pageCounter = overlay.querySelector('.pdf-flipbook-page');
    var loader = overlay.querySelector('.pdf-flipbook-loader');
    var book = overlay.querySelector('.pdf-flipbook-book');
    var prevBtn = overlay.querySelector('.pdf-flipbook-prev');
    var nextBtn = overlay.querySelector('.pdf-flipbook-next');

    var pdf = null;
    var currentLeft = 1; // 1-based page number of the left canvas
    var totalPages = 0;
    var isMobile = window.innerWidth < 768;

    function refreshMode() {
      isMobile = window.innerWidth < 768;
      book.classList.toggle('single', isMobile);
    }

    function closeModal() {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      document.body.style.overflow = '';
      overlay.remove();
    }
    function onKey(e) {
      if (e.key === 'ArrowLeft') { prevBtn.click(); }
      else if (e.key === 'ArrowRight') { nextBtn.click(); }
      else if (e.key === 'Escape') { closeModal(); }
    }
    function onResize() {
      var wasMobile = isMobile;
      refreshMode();
      if (wasMobile !== isMobile) renderSpread();
    }
    refreshMode();
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    overlay.querySelector('.pdf-flipbook-close').addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });

    loadPdfJs()
      .then(function (pdfjs) { return pdfjs.getDocument(url).promise; })
      .then(function (doc) {
        pdf = doc;
        totalPages = doc.numPages;
        loader.style.display = 'none';
        book.classList.add('ready');
        return renderSpread();
      })
      .catch(function (err) {
        console.error('[pdf-viewer]', err);
        loader.textContent = 'PDF файл олдсонгүй эсвэл ачаалж чадсангүй. Админ удахгүй нэмнэ.';
      });

    function renderPage(pageNum, canvas) {
      if (!pdf || pageNum < 1 || pageNum > totalPages) {
        canvas.style.visibility = 'hidden';
        canvas.width = 0;
        canvas.height = 0;
        return Promise.resolve();
      }
      canvas.style.visibility = 'visible';
      return pdf.getPage(pageNum).then(function (page) {
        var targetHeight = Math.min(window.innerHeight - 140, 900);
        var base = page.getViewport({ scale: 1 });
        var scale = targetHeight / base.height;
        var maxWidth = (window.innerWidth - (isMobile ? 120 : 240)) / (isMobile ? 1 : 2);
        if (base.width * scale > maxWidth) {
          scale = maxWidth / base.width;
        }
        var viewport = page.getViewport({ scale: scale });
        var ctx = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = viewport.width + 'px';
        canvas.style.height = viewport.height + 'px';
        return page.render({ canvasContext: ctx, viewport: viewport }).promise;
      });
    }

    function renderSpread() {
      if (!pdf) return Promise.resolve();
      var step = isMobile ? 1 : 2;
      var leftP = currentLeft;
      var rightP = isMobile ? leftP : leftP + 1;

      var p = Promise.resolve();
      p = p.then(function () { return renderPage(leftP, leftCanvas); });
      if (!isMobile) {
        p = p.then(function () { return renderPage(rightP, rightCanvas); });
      } else {
        rightCanvas.style.visibility = 'hidden';
        rightCanvas.width = 0;
      }
      return p.then(function () {
        if (isMobile) {
          pageCounter.textContent = leftP + ' / ' + totalPages;
        } else {
          var shownRight = Math.min(rightP, totalPages);
          pageCounter.textContent = (leftP === shownRight ? leftP : leftP + '–' + shownRight) + ' / ' + totalPages;
        }
        prevBtn.disabled = leftP <= 1;
        nextBtn.disabled = leftP + step > totalPages;
      });
    }

    prevBtn.addEventListener('click', function () {
      if (!pdf) return;
      var step = isMobile ? 1 : 2;
      currentLeft = Math.max(1, currentLeft - step);
      renderSpread();
    });
    nextBtn.addEventListener('click', function () {
      if (!pdf) return;
      var step = isMobile ? 1 : 2;
      if (currentLeft + step > totalPages) return;
      currentLeft = currentLeft + step;
      renderSpread();
    });
  }

  function bind(root) {
    (root || document).querySelectorAll('[data-pdf]').forEach(function (el) {
      if (el.__pdfBound) return;
      el.__pdfBound = true;
      el.addEventListener('click', function (e) {
        e.preventDefault();
        var url = el.getAttribute('data-pdf');
        if (!url || url === '#') {
          alert('Уг боть тун удахгүй нэмэгдэнэ.');
          return;
        }
        var title = el.getAttribute('data-pdf-title') || el.getAttribute('aria-label') || '';
        openPdf(url, title);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { bind(); });
  } else {
    bind();
  }

  window.PdfFlipbook = { open: openPdf, bind: bind };
})();
