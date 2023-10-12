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

<!-- <details class="links-section"  id="assistance">
<summary class="links-section-title" markdown="1">

## סיוע כללי

<div class="open-caret"></div>
</summary>
<div class="links-section-content" markdown="1">
{% include_relative docs/_links/assistance.md %}
</div>
</details>

<details class="links-section"  id="hostFamily">
<summary class="links-section-title" markdown="1">

## אירוח משפחות

<div class="open-caret"></div>
</summary>
<div class="links-section-content" markdown="1">
{% include_relative docs/_links/hostFamily.md %}
</div>
</details>

<details class="links-section"  id="socialNetworks">
<summary class="links-section-title" markdown="1">

## רשתות חברתיות

<div class="open-caret"></div>
</summary>
<div class="links-section-content" markdown="1">
{% include_relative docs/_links/socialNetworks.md %}
</div>
</details>

<details class="links-section" id="protect">
<summary class="links-section-title" markdown="1">

## הגנה מתומכי טרור ברשת

<div class="open-caret"></div>
</summary>
<div class="links-section-content" markdown="1">
{% include_relative docs/_links/protect.md %}
</div>
</details>

<details class="links-section"  id="hasbara">
<summary class="links-section-title" markdown="1">

## הסברה

<div class="open-caret"></div>
</summary>
<div class="links-section-content" markdown="1">
{% include_relative docs/_links/hasbara.md %}
</div>
</details>

<details class="links-section"  id="needarim">
<summary class="links-section-title" markdown="1">

## איתור נעדרים ונעדרות

<div class="open-caret"></div>
</summary>
<div class="links-section-content" markdown="1">
{% include_relative docs/_links/needarim.md %}
</div>
</details>

<details class="links-section"  id="food">
<summary class="links-section-title" markdown="1">

## מזון

<div class="open-caret"></div>
</summary>
<div class="links-section-content" markdown="1">
{% include_relative docs/_links/food.md %}
</div>
</details>

<details class="links-section"  id="donations">
<summary class="links-section-title" markdown="1">

## תרומות

<div class="open-caret"></div>
</summary>
<div class="links-section-content" markdown="1">
{% include_relative docs/_links/donations.md %}
</div>
</details>

<details class="links-section"  id="support">
<summary class="links-section-title" markdown="1">

## תמיכה בשכול, משפחות שכולות

<div class="open-caret"></div>
</summary>
<div class="links-section-content" markdown="1">
{% include_relative docs/_links/families.md %}
</div>
</details>

<details class="links-section" id="mentalhHealth">
<summary class="links-section-title" markdown="1">

## תמיכה נפשית

<div class="open-caret"></div>
</summary>
<div class="links-section-content" markdown="1">
{% include_relative docs/_links/mentalhHealth.md %}
</div>
</details>

<details class="links-section">
<summary class="links-section-title" markdown="1">

## בלוקצ׳יין ומטבעות דיגיטליים

<div class="open-caret"></div>
</summary>
<div class="links-section-content" markdown="1">
{% include_relative docs/_links/blockchain.md %}
</div>
</details>

<details class="links-section"  id="reserves">
<summary class="links-section-title" markdown="1">

## מילואים וכוחות הצלה

<div class="open-caret"></div>
</summary>
<div class="links-section-content" markdown="1">
{% include_relative docs/_links/reserves.md %}
</div>
</details>

<details class="links-section"  id="parenting">
<summary class="links-section-title" markdown="1">

## עזרה להורים ומשפחות עם ילדים בזמן המלחמה

<div class="open-caret"></div>
</summary>
<div class="links-section-content" markdown="1">
{% include_relative docs/_links/parenting.md %}
</div>
</details>

<details class="links-section"  id="evacuate">
<summary class="links-section-title" markdown="1">

## חילוץ

<div class="open-caret"></div>
</summary>
<div class="links-section-content" markdown="1">
{% include_relative docs/_links/evacuate.md %}
</div>
</details>

<details class="links-section"  id="pets">
<summary class="links-section-title" markdown="1">

## חיות מחמד

<div class="open-caret"></div>
</summary>
<div class="links-section-content" markdown="1">
{% include_relative docs/_links/pets.md %}
</div>
</details>

<details class="links-section"  id="freeContent">
<summary class="links-section-title" markdown="1">

## תוכן פתוח חינמי לתקופה

<div class="open-caret"></div>
</summary>
<div class="links-section-content" markdown="1">
{% include_relative docs/_links/freeContent.md %}
</div>
</details>

<details class="links-section"  id="neshek">
<summary class="links-section-title" markdown="1">

## אישורי נשק

<div class="open-caret"></div>
</summary>
<div class="links-section-content" markdown="1">
{% include_relative docs/_links/neshek.md %}
</div>
</details>

<details class="links-section" id="cyber">
<summary class="links-section-title" markdown="1">

## סייבר

<div class="open-caret"></div>
</summary>
<div class="links-section-content" markdown="1">
{% include_relative docs/_links/cyber.md %}
</div>
</details>

<details class="links-section"  id="news">
<summary class="links-section-title" markdown="1">

## חדשות

<div class="open-caret"></div>
</summary>
<div class="links-section-content" markdown="1">
{% include_relative docs/_links/news.md %}
</div>
</details>

<details class="links-section"  id="uncategorized">
<summary class="links-section-title" markdown="1">

## לא מקוטלג

<div class="open-caret"></div>
</summary>
<div class="links-section-content" markdown="1">
{% include_relative docs/_links/uncategorized.md %}
</div>
</details> -->
