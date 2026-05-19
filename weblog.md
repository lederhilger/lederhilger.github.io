---
title: Weblog
permalink: /weblog/
---

# Weblog

{% assign entries = site.entries | sort: "date" | reverse %}
{% for entry in entries %}
- [{{ entry.title }}]({{ entry.url | relative_url }}){% if entry.date%} - {{ entry.date | date: "%-d %B %Y" }}{% endif %}
{% endfor %}