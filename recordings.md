---
layout: default
title: Recordings
permalink: /recordings/
banner_image: 6327457252-banner.jpg
bottom_image: IMG_2760.jpg
---

Most of my recordings appear here:

{% include spotify.html id="playlist/48Ts3CFkxt9bpD43HZpY1w?si=da473c07b432482a" height="352" %}

<div class="recordings-catalogue">
  {% for section in site.data.recordings %}
    <section class="recording-section" aria-labelledby="recording-section-{{ forloop.index }}">
      <h2 id="recording-section-{{ forloop.index }}">{{ section.category }}</h2>
      <div class="recording-grid">
        {% for album in section.albums %}
          <article class="recording-card">
            <a class="recording-cover-link" href="{{ album.url }}" aria-label="{{ album.title }} album page">
              <img class="recording-cover" src="{{ '/assets/images/recordings/' | append: album.cover | relative_url }}" alt="{{ album.title }} album cover" loading="lazy">
            </a>
            <div class="recording-info">
              <h3 class="recording-title">
                <a href="{{ album.url }}">{{ album.title }}</a>
              </h3>
              <p class="recording-artist">{{ album.artist }}</p>
              <p class="recording-release">Released {{ album.released }}</p>
            </div>
          </article>
        {% endfor %}
      </div>
    </section>
  {% endfor %}
</div>
