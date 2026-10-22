(function(){
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
/* nav */
const burger=$('.burger'),menu=$('nav.menu'),hd=$('header.nav');
if(burger){const fit=()=>{if(hd&&menu)menu.style.setProperty('--mh',Math.max(200,Math.round(innerHeight-hd.getBoundingClientRect().bottom))+'px')};
const shut=()=>{menu.classList.remove('open');burger.setAttribute('aria-expanded',false);document.documentElement.classList.remove('lock')};
burger.addEventListener('click',()=>{if(!menu.classList.contains('open')){hd.classList.remove('away');fit()}const o=menu.classList.toggle('open');burger.setAttribute('aria-expanded',o);document.documentElement.classList.toggle('lock',o)});
addEventListener('resize',()=>{if(innerWidth>980)shut();else if(menu.classList.contains('open'))fit()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.classList.contains('open')){shut();burger.focus()}});
$$('nav.menu a').forEach(a=>a.addEventListener('click',()=>{menu.classList.remove('open');burger.setAttribute('aria-expanded',false);document.documentElement.classList.remove('lock')}))}
const bar=$('#prog');
addEventListener('scroll',()=>{hd&&hd.classList.toggle('stuck',scrollY>10);if(bar){const h=document.documentElement;bar.style.width=(scrollY/(h.scrollHeight-innerHeight||1)*100)+'%'}},{passive:true});
/* header: hide on scroll down, show on scroll up */
if(hd){let ly=scrollY,tick=false;addEventListener('scroll',()=>{if(tick)return;tick=true;requestAnimationFrame(()=>{const y=Math.max(0,scrollY),d=y-ly;
if(y<120||(menu&&menu.classList.contains('open'))||hd.matches(':focus-within')&&document.activeElement&&document.activeElement.matches('input,textarea,select'))hd.classList.remove('away');
else if(d>8)hd.classList.add('away');else if(d<-4)hd.classList.remove('away');
if(Math.abs(d)>4)ly=y;tick=false})},{passive:true})}
/* before/after compare */
function cmp(el){let drag=false;const set=x=>{const r=el.getBoundingClientRect();el.style.setProperty('--p',Math.min(100,Math.max(0,(x-r.left)/r.width*100))+'%')};
el.addEventListener('pointerdown',e=>{drag=true;el.dispatchEvent(new CustomEvent('cmpdrag'));el.setPointerCapture(e.pointerId);set(e.clientX)});
el.addEventListener('pointermove',e=>{if(drag||(e.pointerType==='mouse'&&!el.closest('.slider')))set(e.clientX)});
el.addEventListener('pointerup',()=>drag=false);el.addEventListener('pointercancel',()=>drag=false);
el.tabIndex=0;el.addEventListener('keydown',e=>{const c=parseFloat(getComputedStyle(el).getPropertyValue('--p'))||50;if(e.key==='ArrowLeft')el.style.setProperty('--p',Math.max(0,c-5)+'%');if(e.key==='ArrowRight')el.style.setProperty('--p',Math.min(100,c+5)+'%')})}
$$('.cmp').forEach(cmp);
/* hero slider: each slide slowly sweeps Before -> After, then the next category fades in (6s per slide) */
const sl=$('.slider');
if(sl){const slides=$$('.slide',sl),dots=$$('.dots button',sl),cap=$('.lab',sl),T=6000,DELAY=700,SWEEP=3800;let i=0,t,raf,dragging=false;
sl.style.setProperty('--t',T+'ms');
const stop=()=>{clearTimeout(t);cancelAnimationFrame(raf)};
const ease=k=>k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;
const go=n=>{stop();i=(n+slides.length)%slides.length;
slides.forEach((s,k)=>s.classList.toggle('on',k===i));
dots.forEach((d,k)=>{d.classList.remove('on');void d.offsetWidth;d.classList.toggle('on',k===i)});
if(cap)cap.textContent=slides[i].dataset.cap;
const c=$('.cmp',slides[i]);
if(c){c.style.setProperty('--p','100%');let st=null;const run=ts=>{if(st===null)st=ts;const k=Math.min(1,Math.max(0,(ts-st-DELAY)/SWEEP));c.style.setProperty('--p',(100-100*ease(k))+'%');if(ts-st<DELAY+SWEEP)raf=requestAnimationFrame(run)};raf=requestAnimationFrame(run)}
t=setTimeout(()=>go(i+1),T)};
dots.forEach((d,k)=>d.addEventListener('click',()=>go(k)));
/* if the visitor drags the handle, pause; resume a few seconds after release */
sl.addEventListener('cmpdrag',()=>{dragging=true;stop();dots.forEach(d=>d.classList.remove('on'))},true);
const resume=()=>{if(!dragging)return;dragging=false;clearTimeout(t);t=setTimeout(()=>go(i+1),3000)};
sl.addEventListener('pointerup',resume);sl.addEventListener('pointercancel',resume);
document.addEventListener('visibilitychange',()=>{document.hidden?stop():go(i)});
go(0)}

/* typewriter: types a marketplace name letter by letter, deletes it, types the next */
const ty=$('.type'),tw=$('.type .tw');
if(tw){const W=['Amazon.','Shopify.','eBay.','Etsy.','Walmart.'];let w=0,c=W[0].length,del=true;
const step=()=>{const t=W[w];let d;
if(del){c--;d=45;ty.classList.add('typing');if(c<=0){c=0;del=false;w=(w+1)%W.length;d=350}}
else{c++;d=95;ty.classList.add('typing');if(c>=t.length){c=t.length;del=true;d=1800;ty.classList.remove('typing')}}
tw.textContent=W[w].slice(0,c);setTimeout(step,d)};
setTimeout(()=>{ty.classList.remove('typing');step()},1800)}
/* back to top */
const tp=$('#top');if(tp){addEventListener('scroll',()=>tp.classList.toggle('show',scrollY>400),{passive:true});tp.addEventListener('click',()=>scrollTo({top:0,behavior:reduce?'auto':'smooth'}))}
/* marquee: always right -> left, pauses while the mouse is over it, never runs out of content */
const tk=$('.ticker .track');
if(tk){const items=[...tk.children],base=items.slice(0,Math.ceil(items.length/2)),g=document.createElement('div');g.className='grp';base.forEach(n=>g.appendChild(n));tk.textContent='';tk.appendChild(g);
const fill=()=>{while(tk.children.length>1)tk.lastChild.remove();const gw=g.getBoundingClientRect().width||1,need=Math.max(1,Math.ceil(innerWidth/gw));for(let k=1;k<need*2;k++)tk.appendChild(g.cloneNode(true));tk.style.setProperty('--tick',(gw*need/70).toFixed(1)+'s')};
fill();if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fill);addEventListener('load',fill);let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(fill,200)})}
/* light / dark toggle (remembered) */
const root=document.documentElement,tg=$('.theme'),dark=()=>root.getAttribute('data-theme')==='dark';
const syncTheme=()=>{if(tg)tg.setAttribute('aria-label',dark()?'Switch to light mode':'Switch to dark mode');const m=$('meta[name=theme-color]');if(m)m.content=dark()?'#070b16':'#0d1321'};
syncTheme();
if(tg)tg.addEventListener('click',()=>{const n=dark()?'light':'dark';root.classList.add('tt');root.setAttribute('data-theme',n);try{localStorage.setItem('ih-theme',n)}catch(_){}syncTheme();setTimeout(()=>root.classList.remove('tt'),400)});
/* quote pop-up window (opens over the page from every "Get a Quote" / "Free trial" button) */
const SV=['Clipping Path','Background Removal','Image Masking','Photo Retouching','Shadow','Color Correction','Image Manipulation','Raster To Vector','Ecommerce Editing','3D Modeling','Real Estate Photos','Portrait Retouching','Wedding Retouching'];
const X='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';
const qm=document.createElement('div');qm.className='qm';qm.id='qm';qm.setAttribute('aria-hidden','true');
qm.innerHTML=`<div class="qm-b" data-close></div><div class="qm-d" role="dialog" aria-modal="true" aria-labelledby="qm-t" tabindex="-1"><button class="qm-x" type="button" data-close aria-label="Close">${X}</button><div class="qm-h"><h3 id="qm-t">Get a quote</h3><p>Pick what you need and we reply on WhatsApp with a price and delivery time.</p></div><form id="qmf" autocomplete="on"><div class="seg" role="radiogroup" aria-label="Request type"><label><input type="radio" name="kind" value="Price quote" checked><span>Price quote</span></label><label><input type="radio" name="kind" value="Free trial"><span>Free trial</span></label></div><fieldset><legend class="lbl">Services <span style="text-transform:none;font-weight:500">(choose one or more)</span></legend><div class="chips">${SV.map(v=>`<label><input type="checkbox" name="svc" value="${v}"><span>${v}</span></label>`).join('')}</div></fieldset><div class="two" style="margin-top:18px"><div><label class="lbl" style="margin-top:0" for="qm-n">Your name</label><input id="qm-n" name="name" required autocomplete="name" placeholder="Your name"></div><div><label class="lbl" style="margin-top:0" for="qm-q">Number of images</label><input id="qm-q" name="qty" inputmode="numeric" placeholder="e.g. 50"></div></div><fieldset><legend class="lbl">Delivery</legend><div class="opts"><label><input type="radio" name="speed" value="Standard" checked><span>Standard</span></label><label><input type="radio" name="speed" value="Urgent / rush"><span>Urgent</span></label></div></fieldset><label class="lbl" for="qm-m">Details <span style="text-transform:none;font-weight:500">(optional)</span></label><textarea id="qm-m" name="msg" rows="3" placeholder="Share a link to your images or describe the job"></textarea><button class="btn sub" type="submit">Send on WhatsApp</button><p class="note">Opens WhatsApp with your request filled in.</p></form></div>`;
document.body.appendChild(qm);
const qd=$('.qm-d',qm),qf=$('#qmf',qm);let lastFocus=null;
const openQ=(opt={})=>{lastFocus=document.activeElement;qf.reset();
const kind=opt.trial?'Free trial':'Price quote';$$('input[name=kind]',qf).forEach(r=>r.checked=r.value===kind);
$('#qm-t',qm).textContent=opt.trial?'Claim your free trial':'Get a quote';
if(opt.title){const t=opt.title.toLowerCase();let hit=0;$$('input[name=svc]',qf).forEach(c=>{const v=c.value.toLowerCase();if(t.includes(v)||v.includes(t)){c.checked=true;hit=1}});
if(!hit){const al=/ghost|mannequin|manipulat/.test(t)?'Image Manipulation':/ecommerce|e-commerce/.test(t)?'Ecommerce Editing':/retouch/.test(t)?'Photo Retouching':'';if(al)$$('input[name=svc]',qf).forEach(c=>{if(c.value===al)c.checked=true})}}
qm.classList.add('open');qm.setAttribute('aria-hidden','false');document.documentElement.classList.add('lock');setTimeout(()=>$('#qm-n',qm).focus(),60)};
const closeQ=()=>{if(!qm.classList.contains('open'))return;qm.classList.remove('open');qm.setAttribute('aria-hidden','true');document.documentElement.classList.remove('lock');if(lastFocus&&lastFocus.focus)lastFocus.focus()};
document.addEventListener('click',e=>{
if(e.target.closest('[data-close]')&&qm.contains(e.target)){closeQ();return}
const a=e.target.closest('a[href]');if(!a||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
if(!/(^|\/)contact(\.html)?\/?#quote$/.test(a.getAttribute('href')||''))return;
e.preventDefault();const card=a.closest('.price,.scard');openQ({trial:/trial/i.test(a.textContent),title:card?($('h3',card)||{}).textContent:(document.body.dataset.svc||'')})});
document.addEventListener('keydown',e=>{if(!qm.classList.contains('open'))return;
if(e.key==='Escape')closeQ();
if(e.key==='Tab'){const f=$$('button,input,textarea,a[href]',qd).filter(x=>x.type==='radio'||x.type==='checkbox'?true:!x.disabled);const vis=f.filter(x=>x.offsetParent!==null||x.type==='radio'||x.type==='checkbox');if(!vis.length)return;const first=vis[0],last=vis[vis.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
qf.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(qf),sv=d.getAll('svc');
const m=['Hello Image Hunt Studio,','Request: '+d.get('kind'),'Name: '+d.get('name'),'Services: '+(sv.length?sv.join(', '):'Not sure yet'),'Images: '+(d.get('qty')||'-'),'Delivery: '+d.get('speed')];
if(d.get('msg'))m.push('Details: '+d.get('msg'));
open('https://wa.me/8801516536331?text='+encodeURIComponent(m.join('\n')),'_blank','noopener');closeQ()});
/* page loader: 0.15s spinner on internal navigation */
const ld=$('#loader');
addEventListener('pageshow',e=>{if(ld)ld.classList.remove('show')});
document.addEventListener('click',e=>{const a=e.target.closest('a[href]');if(!a||!ld||e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target==='_blank'||a.hasAttribute('download'))return;
let u;try{u=new URL(a.href,location.href)}catch(_){return}
if(!/^(https?|file):$/.test(u.protocol)||u.origin!==location.origin)return;
if(u.pathname===location.pathname&&u.search===location.search)return;
e.preventDefault();ld.classList.add('show');document.documentElement.classList.add('lock');setTimeout(()=>{location.href=u.href},150)});
/* gallery filter */
$$('.filters button').forEach(b=>b.addEventListener('click',()=>{$$('.filters button').forEach(x=>x.classList.remove('on'));b.classList.add('on');const f=b.dataset.f;$$('.item').forEach(it=>it.classList.toggle('hide',f!=='all'&&it.dataset.cat!==f))}));
/* contact form -> WhatsApp */
const form=$('#quote');if(form)form.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(form);const m=`Hello Image Hunt Studio,%0AName: ${encodeURIComponent(d.get('name'))}%0AService: ${encodeURIComponent(d.get('service'))}%0AImages: ${encodeURIComponent(d.get('qty')||'-')}%0A${encodeURIComponent(d.get('msg')||'')}`;open('https://wa.me/8801516536331?text='+m,'_blank','noopener')});
/* scroll animations (GSAP) with safe fallback */
const rv=$$('.rv');
function show(){rv.forEach(e=>{e.style.opacity=1;e.style.transform='none'})}
if(reduce||!window.gsap||!window.ScrollTrigger){show();return}
gsap.registerPlugin(ScrollTrigger);
gsap.from('.hero h1',{y:50,opacity:0,duration:1,ease:'power3.out'});
gsap.from('.hero .pill,.hero p.lead,.hero .cta,.hero .facts',{y:30,opacity:0,duration:.8,stagger:.12,delay:.2,ease:'power2.out'});
gsap.from('.hero .frame',{scale:.94,opacity:0,duration:1.1,delay:.3,ease:'power3.out'});
gsap.from('.ph-head .wrap > *',{y:30,opacity:0,duration:.8,stagger:.12,ease:'power2.out'});
ScrollTrigger.batch(rv,{start:'top 88%',once:true,onEnter:b=>gsap.to(b,{opacity:1,y:0,duration:.8,stagger:.1,ease:'power3.out',overwrite:true})});
$$('.strip li').forEach((l,k)=>gsap.from(l,{y:20,opacity:0,duration:.6,delay:k*.1,scrollTrigger:{trigger:l,start:'top 95%',once:true}}));
$$('.parallax').forEach(p=>gsap.to(p,{yPercent:-12,ease:'none',scrollTrigger:{trigger:p,scrub:true}}));
addEventListener('load',()=>ScrollTrigger.refresh());
})();

if('serviceWorker' in navigator&&/^https?:$/.test(location.protocol))addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
