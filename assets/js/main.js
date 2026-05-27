// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.site-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function() {
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !expanded);
      nav.classList.toggle('open');
    });
  }

  document.querySelectorAll('main a[href^="http://"], main a[href^="https://"]').forEach(function(link) {
    if (link.origin !== window.location.origin) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
  });

  var newsGrid = document.querySelector('.news-grid');
  if (newsGrid) {
    var entries = Array.prototype.slice.call(newsGrid.querySelectorAll(':scope > .news-entry'));
    var twoColumnQuery = window.matchMedia('(min-width: 769px)');

    function renderNewsEntries() {
      var columns;

      function createColumns() {
        columns = document.createElement('div');
        columns.className = 'news-columns';

        var left = document.createElement('div');
        left.className = 'news-column';

        var right = document.createElement('div');
        right.className = 'news-column';

        columns.appendChild(left);
        columns.appendChild(right);
        newsGrid.appendChild(columns);
      }

      function removeEmptyColumns() {
        if (columns && !columns.children[0].children.length && !columns.children[1].children.length) {
          columns.remove();
        }
      }

      function columnHeight(column) {
        return Array.prototype.reduce.call(column.children, function(total, child) {
          var styles = window.getComputedStyle(child);
          return total + child.offsetHeight + parseFloat(styles.marginBottom);
        }, 0);
      }

      function shortestColumn() {
        var left = columns.children[0];
        var right = columns.children[1];
        return columnHeight(left) <= columnHeight(right) ? left : right;
      }

      newsGrid.innerHTML = '';

      if (!twoColumnQuery.matches) {
        entries.forEach(function(entry) {
          newsGrid.appendChild(entry);
        });
        return;
      }

      createColumns();

      entries.forEach(function(entry) {
        if (entry.classList.contains('news-entry-wide')) {
          removeEmptyColumns();
          newsGrid.appendChild(entry);
          createColumns();
          return;
        }

        shortestColumn().appendChild(entry);
      });

      removeEmptyColumns();
    }

    if (entries.length) {
      if (document.readyState === 'complete') {
        renderNewsEntries();
      } else {
        window.addEventListener('load', renderNewsEntries, { once: true });
      }

      if (twoColumnQuery.addEventListener) {
        twoColumnQuery.addEventListener('change', renderNewsEntries);
      } else if (twoColumnQuery.addListener) {
        twoColumnQuery.addListener(renderNewsEntries);
      }
    }
  }

  var lightboxImages = document.querySelectorAll('.news-lightbox-image');
  if (lightboxImages.length) {
    var lightbox = document.createElement('div');
    lightbox.className = 'image-lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Expanded image');

    var lightboxImage = document.createElement('img');
    lightboxImage.alt = '';

    var lightboxClose = document.createElement('button');
    lightboxClose.type = 'button';
    lightboxClose.className = 'image-lightbox-close';
    lightboxClose.setAttribute('aria-label', 'Close expanded image');
    lightboxClose.textContent = '×';

    lightbox.appendChild(lightboxImage);
    lightbox.appendChild(lightboxClose);
    document.body.appendChild(lightbox);

    function openLightbox(image) {
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt || '';
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
      lightboxClose.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      lightboxImage.src = '';
      document.body.style.overflow = '';
    }

    lightboxImages.forEach(function(image) {
      image.addEventListener('click', function() {
        openLightbox(image);
      });

      image.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(image);
        }
      });
    });

    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    lightboxClose.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // Video thumbnail grid — click to play in modal
  var modal = document.getElementById('videoModal');
  if (!modal) return;

  var backdrop = modal.querySelector('.video-modal-backdrop');
  var closeBtn = modal.querySelector('.video-modal-close');
  var player = modal.querySelector('.video-modal-player');

  function openVideo(card) {
    var type = card.dataset.type;
    var id = card.dataset.id;
    var start = card.dataset.start;
    var src = card.dataset.src;
    var iframe;

    if (type === 'youtube') {
      var url = 'https://www.youtube.com/embed/' + id + '?autoplay=1';
      if (start) url += '&start=' + start;
      iframe = '<iframe src="' + url + '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
    } else if (type === 'vimeo') {
      iframe = '<iframe src="https://player.vimeo.com/video/' + id + '?autoplay=1&dnt=1" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>';
    } else if (type === 'self-hosted') {
      iframe = '<video controls autoplay style="width:100%;height:100%;position:absolute;top:0;left:0"><source src="' + src + '" type="video/quicktime">Your browser does not support this video.</video>';
    }

    player.innerHTML = iframe;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeVideo() {
    modal.classList.remove('active');
    player.innerHTML = '';
    document.body.style.overflow = '';
  }

  // Attach handlers to cards that open the in-page video modal.
  var cards = document.querySelectorAll('.video-card[data-type]');
  cards.forEach(function(card) {
    card.addEventListener('click', function() {
      openVideo(card);
    });
  });

  // Close modal
  if (backdrop) backdrop.addEventListener('click', closeVideo);
  if (closeBtn) closeBtn.addEventListener('click', closeVideo);
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeVideo();
  });
});
