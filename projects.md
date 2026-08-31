---
title: Projects
permalink: /projects/
load_chrono: true
---

# Projects

## Academic

<ul class="project-list">
    {% assign projects = site.projects | where: "project_kind", "academic" | sort: "title" %}
    {% for project in projects %}
       <li data-github-repository="{{ project.github_repo | escape }}">
       	   <a class="project-link" href="{{ project.url | relative_url }}"><code>{{ project.title }}</code></a>
	   <time class="gh-pushedat"></time>
       </li>
    {% endfor %}
</ul>

## Personal

<ul class="project-list">
    {% assign projects = site.projects | where: "project_kind", "personal" | sort: "title" %}
    {% for project in projects %}
       <li data-github-repository="{{ project.github_repo | escape }}">
       	   <a href="{{ project.url | relative_url }}"><code>{{ project.title }}</code></a>
	   <time class="gh-pushedat"></time>
       </li>
    {% endfor %}
</ul>