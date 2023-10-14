---
direction: rtl
---

{% for category in site.data.links %}
<details class="links-section" id="{{ category.name }}">
<summary class="links-section-title">
{% if category.image and category.image != "" %}
<img src="{{ category.image }}" alt="{{ category.displayName }} Icon" class="category-icon" style="width:70px; height:70px;">
{% endif %}
<h2>{{ category.displayName }}</h2>

<div class="open-caret"></div>
</summary>
<div class="links-section-content">
<ul class="links-section-list">

{% for subcategory in category.subCategories %}
{% if subcategory.displayName != "" %}
<h3 class="links-section-subcategory">{{ subcategory.displayName }}</h3>
{% endif %}
{% assign numLinks = subcategory.links | size %}
{% if numLinks == 0 %}
<p>בקרוב</p>
{% endif %}
{% for link in subcategory.links %}
<li class="links-section-item">
{% if link.shortDescription == "" %}
<a href="{{ link.url }}" target="_blank" id="{{ link.name }}">{{ link.displayName }}</a>
{% elsif link.shortDescription != "" %}
<a href="{{ link.url }}" target="_blank" id="{{ link.name }}">{{ link.displayName }}<br /><span class="links-section-item-short-description">{{ link.shortDescription }}</span></a>
{% endif %}
{% if link.description != "" %}
<p>{{ link.description }}</p>
{% endif %}
</li>
{% endfor %}

{% endfor %}
</ul>
</div>
</details>
{% endfor %}
