"use strict";
const CACHE_KEY = "gh-repos";
const CACHE_LIFETIME = 24 * 3600000;

function readCache() {
    try {
	const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
	if (cached && Array.isArray(cached.repositories) && Date.now() - cached.savedAt < CACHE_LIFETIME) {
	    return cached.repositories;
	}
    } catch {
	localStorage.removeItem(CACHE_KEY);
    }
    return null;
}
    
function writeCache(repositories) {
    try {
	localStorage.setItem(CACHE_KEY, JSON.stringify({savedAt: Date.now(), repositories}));
    } catch {}
}

async function fetchRepositories() {
    const cached = readCache();
    if (cached) {
	return cached;
    }
    const response = await fetch(
	"https://api.github.com/users/lederhilger/repos" + "?type=owner",
	{
	    headers: {
		Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28"
	    }
	}
    );
    if (!response.ok) {
	throw new Error(`Returned ${response.status}`);
    }
    const repositories = (await response.json()).map(repository => ({
	full_name: repository.full_name,
	pushed_at: repository.pushed_at
    }));
    writeCache(repositories);
    return repositories;
}

function displayProjects(repositories) {
    const repositoryNameMap = new Map(
	repositories.map(repository => [repository.full_name.toLowerCase(), repository])
    );
    const dateFormat = new Intl.DateTimeFormat("en-GB", {
	day: "numeric",
	month: "long",
	year: "numeric",
	timeZone: "Europe/Oslo"
    });
    document.querySelectorAll(".project-list").forEach(list => {
	const projects = Array.from(list.querySelectorAll("[data-github-repository]"));
	projects.forEach(project => {
	    const name = project.dataset.githubRepository.toLowerCase();
	    const repository = repositoryNameMap.get(name);
	    if (!repository?.pushed_at) {return;}
	    project.dataset.githubPushedAt = repository.pushed_at;
	    const time = project.querySelector(".gh-pushedat");
	    if (time) {
		const date = new Date(repository.pushed_at);
		time.dateTime = repository.pushed_at;
	    }
	});
	projects.sort((left, right) => {
	    const leftDate = Date.parse(left.dataset.githubPushedAt) || 0;
	    const rightDate = Date.parse(right.dataset.githubPushedAt) || 0;
	    return rightDate - leftDate;
	}).forEach(project => list.append(project));
    });
}

fetchRepositories().then(displayProjects).catch(error => {
    console.warn("Error retrieving dates:", error);
});
