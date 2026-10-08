(()=>{"use strict";
const cfg=window.SIVOLUX_CONFIG||{};
const val=k=>cfg[k]===undefined||cfg[k]===null?"":String(cfg[k]).trim();
document.querySelectorAll('[data-config]').forEach(el=>{const k=el.dataset.config,v=val(k);if(v)el.textContent=v});
const ticker=val('ticker')||'$SIVOLUX';document.querySelectorAll('[data-ticker]').forEach(el=>{const t=ticker.startsWith('$')?ticker.slice(1):ticker;el.innerHTML='<span class="ticker-dollar">$</span>'+t});
const setAction=(id,url)=>{const el=document.getElementById(id);if(!el)return;if(url&&/^https?:\/\//i.test(url)){el.href=url;el.target='_blank';el.rel='noopener noreferrer';el.classList.remove('is-disabled');el.removeAttribute('aria-disabled')}else{el.removeAttribute('href');el.classList.add('is-disabled');el.setAttribute('aria-disabled','true')}};
setAction('heroBuy',val('buyUrl'));setAction('navBuy',val('buyUrl'));setAction('buyButton',val('buyUrl'));setAction('chartButton',val('chartUrl'));
const root=document.documentElement;addEventListener('pointermove',e=>{root.style.setProperty('--mx',e.clientX+'px');root.style.setProperty('--my',e.clientY+'px')},{passive:true});
const header=document.getElementById('siteHeader');const updateHeader=()=>header&&header.classList.toggle('scrolled',scrollY>20);updateHeader();addEventListener('scroll',updateHeader,{passive:true});
const toggle=document.getElementById('menuToggle'),nav=document.getElementById('mainNav');toggle?.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open))});nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle?.setAttribute('aria-expanded','false')}));
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
if('IntersectionObserver'in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12,rootMargin:'0px 0px -7%'});document.querySelectorAll('.reveal').forEach(el=>io.observe(el));const sections=[...document.querySelectorAll('main section[id]')],links=[...document.querySelectorAll('.main-nav a')];const ni=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-38% 0px -55%'});sections.forEach(s=>ni.observe(s))}else document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));
const paras=[...document.querySelectorAll('[data-parallax]')];if(!reduced&&paras.length){let raf=0;const run=()=>{raf=0;for(const el of paras){const speed=parseFloat(el.dataset.parallax||'0'),host=el.closest('section')||el.parentElement;if(!host)continue;const r=host.getBoundingClientRect(),center=r.top+r.height/2-innerHeight/2;const y=Math.max(-48,Math.min(48,-center*speed));el.style.setProperty('--parallax-y',y.toFixed(1)+'px')}};addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(run)},{passive:true});addEventListener('resize',run,{passive:true});run()}
const canvas=document.getElementById('starfield');if(canvas){const ctx=canvas.getContext('2d',{alpha:true});let stars=[],dpr=1,seed=832177,anim=0;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};const resize=()=>{dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.floor(innerWidth*dpr);canvas.height=Math.floor(innerHeight*dpr);canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';ctx.setTransform(dpr,0,0,dpr,0,0);seed=832177;const n=Math.min(250,Math.max(85,Math.floor(innerWidth*innerHeight/8500)));stars=Array.from({length:n},()=>({x:rnd()*innerWidth,y:rnd()*innerHeight,r:.28+rnd()*1.3,a:.12+rnd()*.6,t:rnd()*6.28,c:rnd()>.82?'c':'w'}));draw()};const draw=()=>{ctx.clearRect(0,0,innerWidth,innerHeight);const now=performance.now()/2200;for(const s of stars){const tw=.76+.24*Math.sin(now+s.t);ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle=s.c==='c'?`rgba(91,220,255,${s.a*tw})`:`rgba(222,236,255,${s.a*tw})`;ctx.fill()}};const tick=()=>{draw();anim=requestAnimationFrame(tick)};resize();if(!reduced)tick();addEventListener('resize',resize,{passive:true})}

const launchMain=document.querySelector("main");
if(launchMain){
  if("scrollRestoration" in history)history.scrollRestoration="manual";

  if(location.hash){
    history.replaceState(null,"",location.pathname+location.search);
  }

  addEventListener("load",()=>{
    scrollTo(0,0);
  },{once:true});

  document.querySelectorAll('a[href^="#"]').forEach(link=>{
    link.addEventListener("click",event=>{
      const hash=link.getAttribute("href");
      if(!hash)return;

      event.preventDefault();

      if(hash==="#"||hash==="#top"){
        scrollTo({top:0,behavior:reduced?"auto":"smooth"});
      }else{
        const target=document.querySelector(hash);

        if(target){
          const targetPosition=()=>{
            const scrollPadding=parseFloat(
              getComputedStyle(document.documentElement).scrollPaddingTop
            )||0;

            const scrollMargin=parseFloat(
              getComputedStyle(target).scrollMarginTop
            )||0;

            return Math.max(
              0,
              target.getBoundingClientRect().top+
              scrollY-
              scrollPadding-
              scrollMargin
            );
          };

          const destination=targetPosition();

          scrollTo({
            top:destination,
            behavior:reduced?"auto":"smooth"
          });

          if(!reduced){
            clearTimeout(window.sivoluxNavCorrection);
            window.sivoluxNavCorrection=setTimeout(()=>{
              const corrected=targetPosition();

              if(Math.abs(scrollY-corrected)>2){
                scrollTo({
                  top:corrected,
                  behavior:"auto"
                });
              }
            },900);
          }
        }
      }

      history.replaceState(null,"",location.pathname+location.search);
    });
  });

  const backToTop=document.createElement("button");
  backToTop.type="button";
  backToTop.className="back-to-top";
  backToTop.setAttribute("aria-label","Back to top");
  backToTop.innerHTML='<span aria-hidden="true">↑</span>';
  document.body.appendChild(backToTop);

  const updateBackToTop=()=>{
    backToTop.classList.toggle("visible",scrollY>600);
  };

  addEventListener("scroll",updateBackToTop,{passive:true});
  updateBackToTop();

  
  const footer=document.querySelector(".site-footer");
  if(footer){
    const footerObserver=new IntersectionObserver(entries=>{
      backToTop.classList.toggle("footer-clear",entries[0].isIntersecting);
    });
    footerObserver.observe(footer);
  }

backToTop.addEventListener("click",()=>{
    scrollTo({
      top:0,
      behavior:reduced?"auto":"smooth"
    });
    history.replaceState(null,"",location.pathname+location.search);
  });
}
})();