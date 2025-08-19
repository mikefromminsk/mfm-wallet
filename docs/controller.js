
function getLanguage() {
    const urlParams = new URLSearchParams(window.location.search);
    let lang = urlParams.get('lang') || navigator.language.split("-")[0]
    let acceptedLangs = ['en', 'ru']
    return acceptedLangs.includes(lang) ? lang : 'en'
}

function getDocParam() {
    const urlParams = new URLSearchParams(window.location.search);
    return '/mfm-landing/docs/' + urlParams.get('doc') + '/' + getLanguage() + '.md'
}

async function fetchMarkdown(url) {
    const response = await fetch(url);
    const text = await response.text();
    return text;
}

function generateTOC(markdown) {
    const headers = markdown.match(/(#{1,6})\s(.+)/g);
    let toc = '';
    if (headers) {
        headers.forEach(header => {
            const level = header.match(/#{1,6}/)[0].length;
            const text = header.replace(/#{1,6}\s/, '').trim();
            const anchor = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            toc += `<a href="#${anchor}" style="padding-left: ${(level - 1) * 10}px;" onclick="smoothScroll('${anchor}')">${text}</a>`;
        });
    }
    return toc;
}

function generateAnchors(markdown) {
    return markdown.replace(/(#{1,6})\s(.+)/g, (match, hashes, text) => {
        const anchor = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return `<h${hashes.length} id="${anchor}">${text}</h${hashes.length}>`;
    });
}

function smoothScroll(anchor) {
    document.querySelector(`#${anchor}`).scrollIntoView({behavior: 'smooth'});
    history.pushState(null, null, `#${anchor}`);
}

async function renderMarkdown() {
    const markdownFile = getDocParam();
    const markdownContent = await fetchMarkdown(markdownFile);
    const converter = new showdown.Converter();
    const htmlContent = converter.makeHtml(generateAnchors(markdownContent));

    const contentWithoutFirstH1 = markdownContent.replace(/^#\s.+\n/, '');
    const htmlContentWithoutFirstH1 = converter.makeHtml(generateAnchors(contentWithoutFirstH1));

    document.getElementById('content').innerHTML = htmlContentWithoutFirstH1;
    document.getElementById('sidebar').innerHTML = generateTOC(contentWithoutFirstH1);

    const anchor = window.location.hash.substring(1);
    if (anchor) {
        document.getElementById(anchor)?.scrollIntoView({behavior: 'smooth'});
    }

    window.addEventListener('scroll', highlightCurrentSection);

    document.getElementById('scrollToTop').addEventListener('click', () => {
        document.getElementById('content').scrollTo({top: 0, behavior: 'smooth'});
        document.getElementById('scrollToTop').style.display = 'none';
    });

    hljs.highlightAll();
}

function highlightCurrentSection() {
    const sections = document.querySelectorAll('.content h1, .content h2, .content h3, .content h4, .content h5, .content h6');
    let currentSection = sections[0];

    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 10 && rect.bottom >= 10) {
            currentSection = section;
        }
    });

    const sidebarLinks = document.querySelectorAll('.sidebar a');
    sidebarLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection.id}`) {
            link.classList.add('active');
        }
    });
}

function searchAndScroll() {
    const searchInput = document.getElementById('search').value.toLowerCase();
    const content = document.getElementById('content');
    const regex = new RegExp(searchInput, 'i');
    const match = content.innerHTML.match(regex);

    if (match) {
        const index = content.innerHTML.indexOf(match[0]);
        const sections = document.querySelectorAll('.content h1, .content h2, .content h3, .content h4, .content h5, .content h6');
        let closestSection = sections[0];
        let closestDistance = Infinity;

        sections.forEach(section => {
            const sectionIndex = content.innerHTML.indexOf(section.outerHTML);
            const distance = Math.abs(sectionIndex - index);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestSection = section;
            }
        });

        closestSection.scrollIntoView({behavior: 'smooth'});
    }
}

document.getElementById('search').addEventListener('input', searchAndScroll);
renderMarkdown();

document.getElementById('content').addEventListener('scroll', () => {
    const scrollToTopButton = document.getElementById('scrollToTop');
    if (document.getElementById('content').scrollTop > 100) {
        scrollToTopButton.style.display = 'block';
    } else {
        scrollToTopButton.style.display = 'none';
    }
});

function highlightCurrentDocument() {
    const urlParams = new URLSearchParams(window.location.search);
    const currentDoc = urlParams.get('doc');
    const sidebarLinks = document.querySelectorAll('.sidebar a');

    sidebarLinks.forEach(link => {
        const linkDoc = new URLSearchParams(link.getAttribute('href').split('?')[1]).get('doc');
        if (linkDoc === currentDoc) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', highlightCurrentDocument);


document.querySelectorAll('.language-menu a').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        const lang = this.getAttribute('href').split('=')[1];
        const url = new URL(window.location);
        url.searchParams.set('lang', lang);
        window.location.href = url.toString();
    });
});

switch (getLanguage()) {
    case 'en':
        document.querySelector('.language-button').innerHTML = 'English';
        break;
    case 'ru':
        document.querySelector('.language-button').innerHTML = 'Русский';
        break;
}
