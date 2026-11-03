(() => {
  'use strict';
  const data = window.PORTFOLIO_DATA;
  if (!data || !Array.isArray(data.projects)) {
    document.body.insertAdjacentHTML('afterbegin', '<div class="no-js" role="alert">Portfolio project data is missing. Make sure data/portfolio-data.js is present next to the site files.</div>');
    return;
  }
  const $ = id => document.getElementById(id);
  const projects = data.projects;
  const categories = ['All', 'Architecture', 'Collections', 'Landscapes', 'GIS & Terrain', 'Experimental'];
  let currentCategory = 'All';
  let currentProject = null;
  let currentImage = 0;
  let returnFocus = null;
  const dialog = $('image-dialog');

  // Build HTML safely: all editorial text is written as text nodes, not injected HTML.
  function elt(tag, className, textValue) {
    const n = document.createElement(tag);
    if (className) n.className = className;
    if (textValue !== undefined) n.textContent = textValue;
    return n;
  }
  function setImage(img, picture, lazy = true) {
    img.src = picture.src;
    img.alt = picture.alt;
    if (lazy) img.loading = 'lazy';
    img.decoding = 'async';
  }

  function modelToEmbed(url) {
    const match = url.match(/\/3d-models\/[^\/]*-([a-f0-9]{32})(?:$|[?#/])/i) || url.match(/\/models\/([a-f0-9]{32})(?:$|[?#/])/i);
    return match ? `https://sketchfab.com/models/${match[1]}/embed?ui_theme=dark&autostart=0` : '';
  }
  function renderInteractiveModels(project) {
    const wrap = $('dialog-models-wrap');
    const list = $('dialog-models-list');
    const embedWrap = $('dialog-embed-wrap');
    const embedFrame = $('dialog-embed-frame');
    list.replaceChildren();
    embedFrame.removeAttribute('src');
    wrap.hidden = true;
    embedWrap.hidden = true;
    if (!project.modelLinks || !project.modelLinks.length) return;

    project.modelLinks.forEach((item, index) => {
      const row = elt('div','aside-link-item');
      const link = elt('a','aside-model-link', item.title);
      link.href = item.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      row.append(link);
      const embedUrl = modelToEmbed(item.url);

      if (embedUrl) {
        const btn = elt('button','embed-switch', index === 0 ? 'Preview here' : 'Preview');
        btn.type = 'button';
        btn.addEventListener('click', () => {
          embedFrame.src = embedUrl;
          embedWrap.hidden = false;
        });
        row.append(btn);
      }
      list.append(row);
    });
    wrap.hidden = false;
    // Model previews load only after a visitor clicks 'Preview'.
  }
  function openProject(project, index = 0) {
    currentProject = project;
    currentImage = index;
    returnFocus = document.activeElement;
    $('dialog-title').textContent = project.title;
    $('dialog-category').textContent = project.category.toUpperCase() + ' / ' + project.country.toUpperCase();
    $('dialog-location').textContent = project.place;
    $('dialog-summary').textContent = project.summary;
    $('dialog-tech').textContent = project.tech || 'Digital heritage documentation';
    $('dialog-image-count').textContent = `${project.images.length} visual record${project.images.length === 1 ? '' : 's'}`;
    renderInteractiveModels(project);
    if (!dialog.open) dialog.showModal();
    drawViewer();
    $('dialog-close').focus();
  }
  function drawViewer() {
    if (!currentProject) return;
    const imgs = currentProject.images;
    const shot = imgs[currentImage];
    const large = $('dialog-image');
    setImage(large, shot, false);
    $('dialog-counter').textContent = `${String(currentImage + 1).padStart(2, '0')} / ${String(imgs.length).padStart(2, '0')}`;
    $('dialog-file-link').href = shot.src;
    $('image-prev').disabled = imgs.length <= 1;
    $('image-next').disabled = imgs.length <= 1;
    const strip = $('thumbnail-strip');
    strip.replaceChildren();
    imgs.forEach((pic, i) => {
      const btn = elt('button', i === currentImage ? 'active' : '');
      btn.type = 'button';
      btn.setAttribute('aria-label', `Show image ${i + 1} of ${imgs.length}`);
      btn.setAttribute('aria-pressed', String(i === currentImage));
      const thumb = elt('img');
      setImage(thumb, pic);
      btn.append(thumb);
      btn.addEventListener('click', () => { currentImage = i; drawViewer(); });
      strip.append(btn);
    });
    const active = strip.children[currentImage];
    if (active) active.scrollIntoView({block:'nearest',inline:'nearest',behavior:'auto'});
  }
  function moveImage(delta) {
    if (!currentProject || currentProject.images.length < 2) return;
    currentImage = (currentImage + delta + currentProject.images.length) % currentProject.images.length;
    drawViewer();
  }
  $('dialog-close').addEventListener('click', () => dialog.close());
  $('image-prev').addEventListener('click', () => moveImage(-1));
  $('image-next').addEventListener('click', () => moveImage(1));
  dialog.addEventListener('close', () => {
    currentProject = null;
    $('dialog-image').removeAttribute('src');
    if (returnFocus && typeof returnFocus.focus === 'function') returnFocus.focus();
    $('dialog-models-list').replaceChildren();
    $('dialog-models-wrap').hidden = true;
    $('dialog-embed-wrap').hidden = true;
    $('dialog-embed-frame').removeAttribute('src');
  });
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  document.addEventListener('keydown', event => {
    if (!dialog.open) return;
    if (event.key === 'ArrowRight') { event.preventDefault(); moveImage(1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); moveImage(-1); }
  });

  function featuredCard(project) {
    const card = elt('article','featured-card');
    const cover = elt('button','featured-cover');
    cover.type = 'button';
    cover.setAttribute('aria-label', `Open ${project.title} project gallery`);
    const im = elt('img');
    setImage(im, project.images[project.featuredImageIndex || 0]);
    cover.append(im);
    cover.addEventListener('click', () => openProject(project));
    const content = elt('div','featured-info');
    content.append(elt('p','card-meta',`${project.country}  /  ${project.category}`));
    content.append(elt('h3','',project.featuredTitle || project.title));
    content.append(elt('p','',project.featuredSummary || project.summary));
    if (project.featuredRole) content.append(elt('p','featured-role',project.featuredRole));
    const end = elt('div','card-end');
    const left = elt('span','',project.tech || project.place);
    if (project.modelLinks && project.modelLinks.length) {
      const badge = elt('span','interactive-badge','Interactive 3D');
      left.append(' · ');
      left.append(badge);
    }
    end.append(left,elt('span','image-number',`${project.images.length} image${project.images.length === 1 ? '' : 's'} ↗`));
    content.append(end);
    card.append(cover,content);
    return card;
  }
  const featured = (data.featuredOrder || []).length
    ? data.featuredOrder.map(id => projects.find(p => p.id === id)).filter(p => p && p.featured)
    : projects.filter(p => p.featured);
  featured.forEach(p => $('featured-grid').append(featuredCard(p)));

  // Final Paharpur project showcase, separate from the main project archive.
  (data.bangladeshProjects || []).forEach(id => {
    const p=projects.find(project=>project.id===id);
    if(p) $('bangladesh-grid').append(featuredCard(p));
  });

  function archiveCard(project) {
    const card = elt('article','archive-card');
    const btn = elt('button');
    btn.type = 'button';
    btn.setAttribute('aria-label',`Explore ${project.title}, ${project.images.length} images`);
    const cover = elt('img');
    setImage(cover,project.images[0]);
    const details = elt('div','archive-card-details');
    details.append(elt('div','archive-meta',`${project.country} / ${project.category}`));
    details.append(elt('h3','',project.title));
    if (project.modelLinks && project.modelLinks.length) details.append(elt('div','archive-model-flag','Interactive 3D available'));
    const bottom = elt('div','archive-bottom');
    bottom.append(elt('span','',project.place),elt('span','',`${project.images.length} view${project.images.length === 1 ? '' : 's'} ↗`));
    details.append(bottom);
    btn.append(cover,details);
    btn.addEventListener('click', () => openProject(project));
    card.append(btn);
    return card;
  }
  const filters = $('category-filters');
  categories.forEach(cat => {
    const btn = elt('button','filter-pill',cat);
    btn.type = 'button';
    btn.setAttribute('aria-pressed', String(cat === currentCategory));
    btn.addEventListener('click', () => {
      currentCategory = cat;
      for (const peer of filters.querySelectorAll('button')) peer.setAttribute('aria-pressed',String(peer === btn));
      renderArchive();
    });
    filters.append(btn);
  });
  $('search-projects').addEventListener('input',renderArchive);
  function renderArchive() {
    const query = $('search-projects').value.trim().toLocaleLowerCase();
    const filtered = projects.filter(p => p.id !== 'bangladesh-paharpur' && (currentCategory === 'All' || p.category === currentCategory) && [p.title,p.place,p.country,p.category,p.summary,p.tech,...p.tags].some(s => String(s).toLocaleLowerCase().includes(query)));
    $('archive-grid').replaceChildren(...filtered.map(archiveCard));
    const shots = filtered.reduce((n,p) => n+p.images.length,0);
    $('archive-count').textContent = `${filtered.length} project groups · ${shots} image views`;
    $('no-results').hidden = filtered.length > 0;
  }
  renderArchive();


  data.methods.forEach((method,index) => {
    const card = elt('div','method-card');
    card.append(elt('span','method-no',String(index+1).padStart(2,'0')),elt('h3','',method.name),elt('p','',method.description));
    $('methods-grid').append(card);
  });
  data.tools.forEach(tool => $('tool-tags').append(elt('span','',tool)));
  $('copyright-year').textContent = String(new Date().getFullYear());
  $('credits-text').textContent = data.credits;
  for (const id of ['nav-github','footer-github']) $(id).href = data.github;
  const heroProjects = data.heroProjects || ['kobe-mosque-new','maldives-mosque','gan-island-dem'];
  heroProjects.slice(0,3).forEach((id,i) => {
    const p = projects.find(project => project.id === id);
    const index = (data.heroImageIndex || [0,0,0])[i] || 0;
    if (p?.images?.length) setImage($(`hero-img-${i+1}`),p.images[index] || p.images[0],false);
  });
  const menu = $('menu-toggle'), nav = $('primary-nav');
  menu.addEventListener('click', () => {const open = nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click',() => {nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}));
})();
