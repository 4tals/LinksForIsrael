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
{% if link.whatsapp %}
<a href="{{ link.whatsapp }}" target="_blank"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/WhatsApp_icon.png/598px-WhatsApp_icon.png" alt="WhatsApp Link" style="width:20px; height:20px;"></a>
{% endif %}
{% if link.telegram %}
<a href="{{ link.telegram }}" target="_blank"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/512px-Telegram_logo.svg.png" alt="Telegram Link" style="width:20px; height:20px;"></a>
{% endif %}
{% if link.drive %}
<a href="{{ link.drive }}" target="_blank"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Google_Drive_icon_%282020%29.svg/2295px-Google_Drive_icon_%282020%29.svg.png" alt="Google Drive Link" style="width:20px; height:20px;"></a>
{% endif %}
{% if link.forms %}
<a href="{{ link.forms }}" target="_blank"><img src="https://cdn-icons-png.flaticon.com/512/5968/5968528.png" alt="Google Forms Link" style="width:20px; height:20px;"></a>
{% endif %}
{% if link.docs %}
<a href="{{ link.docs }}" target="_blank"><img src="https://cdn4.iconfinder.com/data/icons/free-colorful-icons/360/google_docs.png" alt="Google Docs Link" style="width:20px; height:20px;"></a>
{% endif %}
{% if link.website %}
<a href="{{ link.website }}" target="_blank"><img src="https://cdn-icons-png.flaticon.com/512/5602/5602732.png" alt="Website Link" style="width:20px; height:20px;"></a>
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
