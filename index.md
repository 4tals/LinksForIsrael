---
direction: rtl
---

{% for category in site.data.links %}
<details class="links-section" id="initiatives">
<summary class="links-section-title">
<h2>{{ category.displayName }}</h2>
<div class="open-caret"></div>
</summary>
<div class="links-section-content">
<ul class="links-section-list">

{% for subcategory in category.subCategories %}
{% if subcategory.displayName != "" %}
<h3 class="links-section-subcategory">{{ subcategory.displayName }}</h3>
{% endif %}
{% for link in subcategory.links %}
<li class="links-section-item">
{% if link.shortDescription == "" %}
<a href="{{ link.url }}" target="_blank">{{ link.displayName }}</a>
{% elsif link.shortDescription != "" %}
<a href="{{ link.url }}" target="_blank">{{ link.displayName }}<br /><span class="links-section-item-short-description">{{ link.shortDescription }}</span></a>
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
