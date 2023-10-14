---
direction: rtl
---

{% for category in site.data.links %}
<details class="links-section" id="{{ category.name }}">
<summary class="links-section-title">
{% if category.image and category.image != "" %}
<img src="{{ category.image }}" alt="{{ category.displayName }} Icon" class="category-icon">
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

<div class="link-icons">
{% if link.whatsapp %}
<a href="{{ link.whatsapp }}" target="_blank"><img class="link-icon" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/WhatsApp_icon.png/598px-WhatsApp_icon.png" alt="WhatsApp Link"></a>
{% endif %}
{% if link.telegram %}
<a href="{{ link.telegram }}" target="_blank"><img class="link-icon" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/512px-Telegram_logo.svg.png" alt="Telegram Link"></a>
{% endif %}
{% if link.drive %}
<a href="{{ link.drive }}" target="_blank"><img class="link-icon" src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Google_Drive_icon_%282020%29.svg/2295px-Google_Drive_icon_%282020%29.svg.png" alt="Google Drive Link"></a>
{% endif %}
{% if link.forms %}
<a href="{{ link.forms }}" target="_blank"><img class="link-icon" src="https://cdn-icons-png.flaticon.com/512/5968/5968528.png" alt="Google Forms Link"></a>
{% endif %}
{% if link.docs %}
<a href="{{ link.docs }}" target="_blank"><img class="link-icon" src="https://cdn4.iconfinder.com/data/icons/free-colorful-icons/360/google_docs.png" alt="Google Docs Link"></a>
{% endif %}
{% if link.website %}
<a href="{{ link.website }}" target="_blank"><img class="link-icon" src="https://cdn-icons-png.flaticon.com/512/5602/5602732.png" alt="Website Link"></a>
{% endif %}
{% if link.discord %}
<a href="{{ link.discord }}" target="_blank"><img class="link-icon" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiDCYwuxNrkxd_oOUGb0RxYQ5RH_aFzXlxmlgb_183&s" alt="Discord Link"></a>
{% endif %}
{% if link.instagram %}
<a href="{{ link.instagram }}" target="_blank"><img class="link-icon" src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram Link"></a>
{% endif %}
{% if link.tiktok %}
<a href="{{ link.tiktok }}" target="_blank"><img class="link-icon" src="https://static.vecteezy.com/system/resources/previews/023/986/921/original/tiktok-logo-tiktok-logo-transparent-tiktok-icon-transparent-free-free-png.png" alt="Tiktok Link"></a>
{% endif %}
{% if link.twitter %}
<a href="{{ link.twitter }}" target="_blank"><img class="link-icon" src="https://cdn-icons-png.flaticon.com/512/124/124021.png" alt="Twitter Link"></a>
{% endif %}
{% if link.portal %}
<a href="{{ link.portal }}" target="_blank"><img class="link-icon" src="https://res.cloudinary.com/dargbitr2/image/upload/v1697228919/LinksForIsrael/r5ysb355egkpyd10jovq.jpg" alt="Portal Link"></a>
{% endif %}
</div>

{% if link.description != "" %}
<p>{{ link.description }}</p>

{% assign numTags = link.tags | size %}
{% if numTags != 0 %}
<ul class="link-tags-list">
{% for tag in link.tags %}
<li class="tag">{{ tag }}</li>
{% endfor %}
</ul>
{% endif %}

{% endif %}
</li>
{% endfor %}

{% endfor %}
</ul>
</div>
</details>
{% endfor %}
