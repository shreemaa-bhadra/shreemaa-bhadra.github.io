---
layout: page
title: Categories
permalink: /categories/
description: "Browse all recipe categories on Cook's Pan — from Odia and Indian classics to baking, snacks, beverages and more."
---

<div class="tags-categories-section">
  <h2>Browse by Category</h2>
  
  <div class="filter-links">
    {%- assign categories = site.posts | map: "categories" | join: "|" | split: "|" | uniq | sort -%}
    {%- for category in categories -%}
      {%- if category != "" -%}
      <a href="/categories/{{ category | downcase | replace: ' ', '-' }}/" class="tag-badge category-badge">
        {{ category }}
      </a>
      {%- endif -%}
    {%- endfor -%}
  </div>
</div>
