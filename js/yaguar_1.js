/* ==========================================================
   YAGUAR TOURS — INTERACCIÓN PRINCIPAL
   ========================================================== */
(() => {
  'use strict';
  const root = document;
  if (window.__yaguarToursReady) return;
  window.__yaguarToursReady = true;

  const $ = (s, scope=root) => scope.querySelector(s);
  const $$ = (s, scope=root) => Array.from(scope.querySelectorAll(s));
  const body = document.body;

  // Menú móvil accesible
  const toggle = $('.nav-toggle');
  const menu = $('.nav-links');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    });
    $$('.nav-links a').forEach(link => link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded','false');
      toggle.setAttribute('aria-label','Abrir menú');
    }));
    document.addEventListener('click', e => {
      if (menu.classList.contains('open') && !menu.contains(e.target) && !toggle.contains(e.target)) {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded','false');
      }
    });
  }

  // Página activa según URL, evitando depender del HTML duplicado.
  const current = location.pathname.split('/').pop() || 'index.html';
  $$('.nav-links a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('#')[0];
    if (href === current) a.classList.add('active');
  });

  // Progreso de lectura.
  const progress = $('.yt-progress span');
  const topButton = document.createElement('button');
  topButton.className='yt-top'; topButton.type='button'; topButton.setAttribute('aria-label','Volver arriba'); topButton.textContent='↑';
  body.appendChild(topButton);
  let ticking=false;
  const updateScroll = () => {
    if(ticking) return; ticking=true;
    requestAnimationFrame(() => {
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      if(progress) progress.style.width = `${Math.min(100, Math.max(0, scrollY/max*100))}%`;
      topButton.classList.toggle('show', scrollY > 520);
      ticking=false;
    });
  };
  addEventListener('scroll',updateScroll,{passive:true}); updateScroll();
  topButton.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));

  // Aparición progresiva respetando reduced motion.
  const animated = $$('.card,.visual-card,.app-card,.com-card,.info-card,.value-card,.segment-item,.element-card,.strength-item,.tone-card,.channel-card,.perception-item,.resumen-item,.content-section');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if(entry.isIntersecting){ entry.target.classList.add('visible'); io.unobserve(entry.target); }
    }), {threshold:.08,rootMargin:'0px 0px -35px'});
    animated.forEach((el,i)=>{el.classList.add('reveal',`reveal-delay-${(i%4)+1}`);io.observe(el);});
  } else animated.forEach(el=>el.classList.add('visible'));

  // Navegación interna por H2 cuando la página tiene varias secciones.
  const main = $('main');
  if(main && body.dataset.page !== 'home' && !$('.yt-quick-nav')){
    const headings = $$('h2',main).filter(h=>h.textContent.trim());
    if(headings.length >= 3){
      const nav=document.createElement('nav'); nav.className='yt-quick-nav'; nav.setAttribute('aria-label','Secciones de esta página');
      const label=document.createElement('span'); label.className='yt-quick-label'; label.textContent='Secciones'; nav.appendChild(label);
      headings.forEach((h,i)=>{
        if(!h.id) h.id=`yt-seccion-${i+1}`;
        const a=document.createElement('a'); a.href=`#${h.id}`; a.textContent=h.textContent.replace(/\s+/g,' ').trim(); nav.appendChild(a);
      });
      main.prepend(nav);
      const links=$$('a',nav);
      const sync=()=>{let idx=0;headings.forEach((h,i)=>{if(h.getBoundingClientRect().top<180)idx=i});links.forEach((a,i)=>a.classList.toggle('current',i===idx));};
      addEventListener('scroll',sync,{passive:true}); sync();
    }
  }

  // Lightbox para imágenes de contenido.
  const box=document.createElement('div'); box.className='yt-lightbox'; box.setAttribute('role','dialog'); box.setAttribute('aria-modal','true'); box.setAttribute('aria-label','Vista ampliada de imagen');
  box.innerHTML='<button type="button" aria-label="Cerrar imagen">×</button><img alt=""><div class="yt-caption"></div>';
  body.appendChild(box);
  const boxImg=$('img',box), caption=$('.yt-caption',box), close=$('button',box);
  let lastFocus=null;
  const closeBox=()=>{box.classList.remove('open');body.style.overflow='';lastFocus?.focus?.()};
  $$('.main-content img, .main-content img.yt-clickable, .resumen-proyecto img').forEach(img=>{
    if(!img.alt) img.alt='Imagen de Yaguar Tours';
    img.addEventListener('click',()=>{if(!img.src)return;lastFocus=img;boxImg.src=img.currentSrc||img.src;boxImg.alt=img.alt;caption.textContent=img.alt;box.classList.add('open');body.style.overflow='hidden';close.focus();});
    img.addEventListener('error',()=>img.classList.add('img-error'));
  });
  close.addEventListener('click',closeBox); box.addEventListener('click',e=>{if(e.target===box)closeBox()}); document.addEventListener('keydown',e=>{if(e.key==='Escape'&&box.classList.contains('open'))closeBox()});

  // Mejoras de accesibilidad a enlaces que abren secciones.
  $$('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>{
    const target=$(a.getAttribute('href')); if(target) target.setAttribute('tabindex','-1');
  }));
})();
