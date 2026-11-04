'use strict';
(() => {
  const C = window.DAZIPET_CONFIG;
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const esc = v => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const money = (n, currency = C.currency) => `${Number(n).toLocaleString(C.locale, {style:'currency',currency,minimumFractionDigits:2,maximumFractionDigits:2})} ${currency}`;
  const round = n => Math.round((n + Number.EPSILON) * 100) / 100;
  const skin = id => C.skins.find(s => s.id === id);
  const personality = id => C.personalities.find(p => p.id === id);
  const maxQty = C.product.maxQuantity;
  const qty = n => Math.min(maxQty, Math.max(1, Math.floor(Number(n) || 1)));
  const page = document.body.dataset.page;
  const memory = {};
  let storageAvailable = true;
  try { localStorage.setItem('dazipet-check', '1'); localStorage.removeItem('dazipet-check'); } catch { storageAvailable = false; }
  function read(key, fallback) {
    try { const value = JSON.parse(storageAvailable ? localStorage.getItem(key) : (memory[key] || 'null')); return value ?? fallback; } catch { return fallback; }
  }
  function write(key, value) {
    const json = JSON.stringify(value); memory[key] = json;
    if (storageAvailable) { try { localStorage.setItem(key, json); } catch { showStorageWarning(); storageAvailable = false; } }
  }
  function showStorageWarning() {
    if (!$('.storage-warning')) { const d = document.createElement('div'); d.className = 'storage-warning'; d.textContent = 'Browser storage is unavailable. Enable local storage to keep your bag and demo order across pages.'; document.body.prepend(d); }
  }
  const paths = {
    arrow:'<path d="M4 12h16M14 6l6 6-6 6"/>',
    heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 11h18m-13 4h2m4 0h2"/>',
    sprout:'<path d="M12 21V11M12 15C4 16 3 12 3 8c6-1 9 1 9 7Zm0-4c0-6 3-8 9-8 0 6-3 8-9 8Z"/>',
    spark:'<path d="m12 2 2.8 7.2L22 12l-7.2 2.8L12 22l-2.8-7.2L2 12l7.2-2.8L12 2Z"/>',
    bag:'<path d="M5 7h14l2 14H3L5 7Z"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/>',
    layers:'<path d="m12 3 10 6-10 6L2 9l10-6Zm-9 11 9 5 9-5M3 18l9 5 9-5"/>',
    base:'<path d="M6 16h12l4 5H2l4-5Zm3 0V7a3 3 0 0 1 6 0v9M9 9h6"/>',
    smile:'<circle cx="12" cy="12" r="9"/><path d="M8 14c2 3 6 3 8 0M8 9h.01M16 9h.01"/>',
    sync:'<path d="M20 7a8 8 0 0 0-14-2L3 8m0-5v5h5m-4 9a8 8 0 0 0 14 2l3-3m0 5v-5h-5"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    shield:'<path d="m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6l9-4Z"/><path d="m8 12 3 3 5-6"/>',
    image:'<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.5"/><path d="m3 17 5-5 4 4 4-6 5 7"/>',
    globe:'<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
    menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
    check:'<path d="m5 12 4 4L19 6"/>'
  };
  const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.spark}</svg>`;
  function hydrateIcons(root = document) { $$('[data-icon]', root).forEach(el => { el.innerHTML = icon(el.dataset.icon); }); }
  function productImage(s) {
    return s.image ? `<img src="${esc(s.image)}" alt="Dada ${esc(s.name)} — ${esc(s.material)} classroom concept visual" width="1000" height="800">` : placeholder(s);
  }
  function placeholder(s) { return `<div class="placeholder-content"><div class="image-corner">${icon('image')}</div><div class="placeholder-wordmark">Dada.</div><div class="placeholder-title">${esc(s.name)} edition</div><div class="placeholder-note">Product image unavailable<br>please check the supplied asset path</div><span class="placeholder-status">IMAGE PLACEHOLDER</span></div>`; }
  function renderImages() { $$('[data-product-image]').forEach(el => { const s = skin(el.dataset.productImage); if(s) el.innerHTML = productImage(s); }); }
  // A missing or broken official asset always falls back to a labelled placeholder.
  document.addEventListener('error', e => { if (e.target instanceof HTMLImageElement) { const p = e.target.closest('[data-product-image]'); if(p) p.innerHTML = placeholder(skin(p.dataset.productImage) || C.skins[0]); } }, true);
  const itemPrice = item => item.type === 'skin' ? C.product.extraSkinPrice : C.product.price;
  const itemLabel = item => item.type === 'skin' ? 'Extra Interchangeable Skin' : 'Complete Set';
  const sameItem = (a,b) => a.type === b.type && a.skin === b.skin && a.personality === b.personality;
  function getCart() {
    const raw = read('dazipet-cart', []);
    if (!Array.isArray(raw)) return [];
    const merged = [];
    raw.forEach(item => {
      if (!item || !skin(item.skin)) return;
      // Existing V1 carts contained complete sets without a type field.
      const type = item.type ?? 'set';
      if (!['set','skin'].includes(type) || (type === 'set' && !personality(item.personality))) return;
      const normalized = {type, skin:item.skin, personality:type === 'skin' ? null : item.personality, quantity:qty(item.quantity)};
      const existing = merged.find(i => sameItem(i,normalized));
      if(existing) existing.quantity = qty(existing.quantity + normalized.quantity);
      else merged.push(normalized);
    });
    return merged;
  }
  function addItem(item) {
    const cart = getCart(), existing = cart.find(i => sameItem(i,item));
    if(existing && existing.quantity + item.quantity > maxQty) { toast(`A maximum of ${maxQty} per configuration fits in your demo bag.`); return false; }
    if(existing) existing.quantity += item.quantity; else cart.push({...item});
    saveCart(cart);
    toast(`${item.quantity} ${skin(item.skin).name} ${itemLabel(item).toLowerCase()} added to your bag.`,true);
    return true;
  }
  function saveCart(cart) { write('dazipet-cart',cart); updateCount(); }
  function updateCount() { const count = getCart().reduce((a,i) => a+i.quantity,0); $$('.bag-count').forEach(el => { el.textContent = count; }); $$('.bag-link').forEach(el => el.setAttribute('aria-label',`Your bag, ${count} items`)); }
  const header = $('#site-header');
  header.innerHTML = `<a class="skip-link" href="#main-content">Skip to content</a><div class="announcement">A Little Companion, A Bigger Happiness. <span>✦</span> Classroom Demo · Concept Product · No Real Payment</div><header class="site-nav"><div class="section-wrap nav-inner"><a href="index.html" class="logo" aria-label="DaziPet home"><img src="assets/brand/logo.png" alt="DaziPet" width="296" height="195"></a><nav class="nav-links" id="main-navigation" aria-label="Main navigation"><a href="index.html" ${page==='home'?'class="active" aria-current="page"':''}>Home</a><a href="shop.html" ${page==='shop'?'class="active" aria-current="page"':''}>Shop Dada</a><a href="index.html#personalities">Personalities</a><a href="index.html#how-it-works">How it works</a></nav><div class="nav-actions"><label class="language-indicator" for="site-language">${icon('globe')}<span class="sr-only">Language / 语言</span><select id="site-language" aria-label="Language / 语言"><option value="en">EN</option><option value="zh">中文</option></select></label><a href="checkout.html" class="bag-link">${icon('bag')}<span class="bag-label">Bag</span><span class="bag-count">0</span></a><button class="mobile-menu-toggle" aria-label="Open navigation" aria-expanded="false" aria-controls="main-navigation">${icon('menu')}</button></div></div></header>`;
  // Keep the navigation sticky without making the announcement sticky.
  header.style.display = 'contents';
  if (!$('main').id) $('main').id = 'main-content';
  $('.skip-link').setAttribute('href', '#' + $('main').id);
  $('#site-footer').innerHTML = `<footer class="site-footer"><div class="section-wrap"><div class="footer-top"><div class="footer-brand"><a href="index.html" class="logo" aria-label="DaziPet home"><img src="assets/brand/logo.png" alt="DaziPet" width="296" height="195"></a><p>A Little Companion, A Bigger Happiness.<br>Thoughtfully imagined for your everyday.</p></div><div class="footer-links"><div><strong>MEET DADA</strong><a href="shop.html">Find your companion</a><a href="index.html#personalities">Five personalities</a><a href="index.html#skins">Interchangeable skins</a></div><div><strong>A LITTLE MORE</strong><a href="index.html#how-it-works">How it works</a><a href="index.html#shipping">Shipping information</a><a href="checkout.html">Your demo bag</a></div></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} DaziPet. A classroom startup concept.</span><span class="footer-demo">Classroom Demo · No payments, personal data collection, or order fulfillment.</span></div></div></footer>`;
  $('.mobile-menu-toggle').addEventListener('click', e => { const b=e.currentTarget; const open=b.getAttribute('aria-expanded')!=='true'; b.setAttribute('aria-expanded',String(open)); b.setAttribute('aria-label',open?'Close navigation':'Open navigation'); $('.nav-links').classList.toggle('is-open',open); });
  $$('.nav-links a').forEach(a=>a.addEventListener('click',()=>{ $('.nav-links').classList.remove('is-open'); $('.mobile-menu-toggle').setAttribute('aria-expanded','false'); }));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){ $('.nav-links').classList.remove('is-open'); $('.mobile-menu-toggle').setAttribute('aria-expanded','false'); }});
  $$('[data-price]').forEach(el=>{el.textContent=money(C.product.price);});
  $$('[data-extra-price]').forEach(el=>{el.textContent=money(C.product.extraSkinPrice);});
  $$('[data-price-note]').forEach(el=>{el.textContent=C.product.priceNote;});
  $$('[data-ai-connection]').forEach(el=>{el.textContent=C.ai.connectionNote;});
  $$('[data-ai-service]').forEach(el=>{el.textContent=C.ai.serviceNote;});
  $$('[data-extra-shipping]').forEach(el=>{el.textContent=C.shipping.extraSkinNote;});
  function renderShipping() {
    const target=$('#shipping-info'); if(!target)return;
    target.innerHTML=[['Phase 1 — China Market Validation',`${C.shipping.market} · ${C.shipping.destination}`],['Complete Set Shipping',C.shipping.completeSetNote],['Extra Skin Shipping',C.shipping.extraSkinNote],['Phase 2 — Cross-border Expansion',C.shipping.futureVision]].map(([a,b])=>`<div class="shipping-cell"><strong>${esc(a)}</strong><p>${esc(b)}</p></div>`).join('');
  }
  let toastTimer;
  function toast(message,cartLink=false) { const target=$('#toast'); target.innerHTML=esc(message)+(cartLink?' <a href="checkout.html" aria-label="View bag with your added items">View bag ↗</a>':''); target.classList.add('visible'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>target.classList.remove('visible'),cartLink?12000:3500); }
  function initHome() {
    const tabs=$('#personality-tabs');
    function selectPersonality(id,focus=false) {
      const p=personality(id); tabs.innerHTML=C.personalities.map(v=>`<button role="tab" id="tab-${v.id}" aria-controls="personality-detail" aria-selected="${v.id===id}" tabindex="${v.id===id?0:-1}" class="${v.id===id?'active':''}" data-personality="${v.id}"><span>${v.symbol}</span>${v.name}</button>`).join('');
      $('#personality-detail').setAttribute('aria-labelledby',`tab-${id}`);
      $('#personality-detail').innerHTML=`<div class="personality-detail"><div class="personality-title-row"><span class="personality-symbol" style="background:${p.color}">${p.symbol}</span><div><h3>${p.name}</h3><span class="personality-trait">THE ${p.trait.toUpperCase()} ONE</span></div></div><h4>${esc(p.headline)}</h4><p>${esc(p.description)}</p><blockquote class="personality-quote">“${esc(p.quote)}”</blockquote><a href="shop.html?personality=${p.id}" class="text-link">Meet your ${p.name} Dada <span>↗</span></a></div>`;
      if(focus)$(`#tab-${id}`).focus();
    }
    tabs.addEventListener('click',e=>{const b=e.target.closest('[data-personality]');if(b)selectPersonality(b.dataset.personality);});
    tabs.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const index=C.personalities.findIndex(p=>p.id===e.target.dataset.personality);const next=e.key==='Home'?0:e.key==='End'?4:(index+(e.key==='ArrowRight'?1:4))%5;selectPersonality(C.personalities[next].id,true);});
    selectPersonality('wood');
    $('#skin-cards').innerHTML=C.skins.map(s=>`<a href="shop.html?skin=${s.id}" class="skin-card"><div class="skin-visual" style="--skin-color:${s.color}"><span class="skin-tag">${s.tag}</span><div class="product-slot" data-product-image="${s.id}">${productImage(s)}</div></div><div class="skin-info"><div><h3>${s.name}</h3><p>${s.material}<br>${s.mood}</p></div><span class="round-arrow" aria-hidden="true">↗</span></div></a>`).join('');
    initMiniProgram();
  }
  function initShop() {
    const params=new URLSearchParams(location.search);
    const state={type:params.get('type')==='skin'?'skin':'set',skin:skin(params.get('skin'))?params.get('skin'):'cloud',personality:personality(params.get('personality'))?params.get('personality'):'wood',quantity:1};
    function render() {
      const s=skin(state.skin),p=personality(state.personality),isSkin=state.type==='skin';
      $('#shop-image').dataset.productImage=s.id;$('#shop-image').innerHTML=productImage(s);$('#shop-stage').style.background=s.color;
      $('.gallery-topline>span:last-child').textContent=`0${C.skins.indexOf(s)+1} / 03`;
      $('#gallery-caption').textContent=`${s.name} / ${s.material} / ${isSkin?'Skin only':'Complete set'}`;
      $('#gallery-thumbnails').innerHTML=C.skins.map(v=>`<button class="thumbnail ${v.id===s.id?'active':''}" data-skin="${v.id}" aria-pressed="${v.id===s.id}"><img src="${esc(v.image)}" alt="" width="1000" height="800">${v.name}</button>`).join('');
      $('#shop-personalities').innerHTML=C.personalities.map(v=>`<button class="personality-option ${v.id===p.id?'active':''}" data-personality="${v.id}" aria-pressed="${v.id===p.id}"><span>${v.symbol}</span>${v.name}<small>${v.trait}</small></button>`).join('');
      $('#shop-skins').innerHTML=C.skins.map(v=>`<button class="skin-option ${v.id===s.id?'active':''}" data-skin="${v.id}" aria-pressed="${v.id===s.id}"><span class="skin-dot" style="background:${v.color}"></span>${v.name}</button>`).join('');
      $('#selected-personality').textContent=p.trait;$('#selected-skin').textContent=s.name;
      $('#personality-hint').textContent=p.headline;$('#skin-hint').textContent=s.description;
      $('#personality-fieldset').hidden=isSkin;$('#skin-step').textContent=isSkin?'01':'02';
      $$('[data-product-type]').forEach(b=>{b.classList.toggle('active',b.dataset.productType===state.type);b.setAttribute('aria-pressed',b.dataset.productType===state.type);});
      $('#shop-unit-price').textContent=money(itemPrice(state));
      $('#shop-product-name').textContent=isSkin?'Extra Interchangeable Skin':'Dada Complete Set';
      $('#shop-price-unit').hidden=!isSkin;
      $('#shop-shipping-note').textContent=isSkin?'Combined shipping when added to a complete set. Standalone shipping may cost extra.':'Free Standard Shipping within Mainland China';
      $('#shop-accessories-note').textContent=isSkin?'One replacement skin only. AI core and accessories are not included.':'All essential accessories included.';
      $('#shop-description').textContent=isSkin?'An extra interchangeable outfit for your existing Dada. One selected skin only — AI core, charging base, charging cable and bag charm kit are not included. Product visuals show the assembled concept to illustrate the look.':'Your complete little beginning: one AI core with one selected personality, one selected interchangeable skin, a magnetic charging base, a charging cable, and a bag charm accessory kit. All personalities and included skins share the same set price.';
      $('#shop-quantity').textContent=state.quantity;$('#quantity-down').disabled=state.quantity===1;$('#quantity-up').disabled=state.quantity===maxQty;
      $('#add-price').textContent=money(round(itemPrice(state)*state.quantity));
      $('#selection-summary').textContent=`${itemLabel(state)} / ${s.name} · ${s.material}${isSkin?' / No AI core':` / ${p.name} — ${p.trait}`} / Qty ${state.quantity}`;
    }
    function changeOption(e) {const b=e.target.closest('[data-skin],[data-personality]');if(!b)return;const focusKey=b.dataset.skin?'skin':'personality',id=b.dataset[focusKey];state[focusKey]=id;const parentId=b.parentElement.id;render();$(`#${parentId} [data-${focusKey}="${id}"]`)?.focus({preventScroll:true});}
    $('#shop-personalities').addEventListener('click',changeOption);$('#shop-skins').addEventListener('click',changeOption);$('#gallery-thumbnails').addEventListener('click',changeOption);
    $$('[data-product-type]').forEach(b=>b.addEventListener('click',()=>{state.type=b.dataset.productType;render();}));
    $('#quantity-down').addEventListener('click',()=>{state.quantity=qty(state.quantity-1);render();});$('#quantity-up').addEventListener('click',()=>{state.quantity=qty(state.quantity+1);render();});
    $('#add-to-cart').addEventListener('click',()=>addItem({...state,personality:state.type==='skin'?null:state.personality}));
    $('#extra-skin-cards').innerHTML=C.skins.map(s=>`<article class="extra-skin-card"><a href="shop.html?type=skin&skin=${s.id}" class="extra-skin-image"><img src="${esc(s.image)}" alt="${s.name} skin assembled concept; electronic core not included in extra skin purchase" width="1000" height="800" loading="lazy"></a><div class="extra-skin-description"><h3>${s.name}</h3><p>${s.material} · Skin only, no AI core</p><button class="button light compact" data-add-skin="${s.id}" aria-label="Add ${s.name} extra skin for ${money(C.product.extraSkinPrice)}">Add skin · ${money(C.product.extraSkinPrice)} ${icon('plus')}</button></div></article>`).join('');
    $('#extra-skin-cards').addEventListener('click',e=>{const b=e.target.closest('[data-add-skin]');if(b)addItem({type:'skin',skin:b.dataset.addSkin,personality:null,quantity:1});});
    render();
  }
  function calculate(cart) {
    const subtotal=round(cart.reduce((n,i)=>n+itemPrice(i)*i.quantity,0));
    const hasSet=cart.some(i=>i.type==='set');
    const shippingPending=cart.length>0 && !hasSet && C.shipping.standaloneSkinFee==null;
    const shipping=cart.length && !shippingPending?round(hasSet?C.shipping.completeSetFee:C.shipping.standaloneSkinFee):0;
    return {subtotal,shipping,shippingPending,total:round(subtotal+shipping)};
  }
  const shippingNote = totals => totals.shippingPending?C.shipping.standaloneSkinNote:C.shipping.completeSetNote;
  function initCart() {
    const target=$('#cart-content');
    function render() {
      const cart=getCart();if(!cart.length){target.innerHTML=`<div class="empty-state"><span class="empty-icon">${icon('bag')}</span><h2>A little room for <span class="serif">happiness.</span></h2><p>Your bag is waiting for a little friend. Choose a complete set, or pick an extra skin for your existing Dada.</p><a href="shop.html" class="button primary">Find your Dada ${icon('arrow')}</a></div>`;return;}
      const totals=calculate(cart),count=cart.reduce((n,i)=>n+i.quantity,0);
      target.innerHTML=`<div class="cart-layout"><div class="cart-items"><div class="cart-table-label"><span>YOUR LITTLE COMPANIONS</span><span>SUBTOTAL</span></div>${cart.map((item,i)=>{const s=skin(item.skin),p=personality(item.personality),label=`${s.name} ${itemLabel(item)}${p?' '+p.name:''}`;return `<article class="cart-item"><div class="cart-item-image product-slot" style="background:${s.color}" data-product-image="${s.id}">${productImage(s)}</div><div class="cart-item-info"><span class="cart-type">${itemLabel(item)}</span><h3>Dada / ${s.name}</h3><p>${s.material}<br>${p?`${p.name} — ${p.trait}`:'Skin only · No AI core'}</p><small>Classroom Demo · ${money(itemPrice(item))} each</small></div><div class="cart-item-price"><span>${money(round(itemPrice(item)*item.quantity))}</span><div class="quantity-control"><button data-cart-action="decrease" data-index="${i}" aria-label="Decrease ${label} quantity" ${item.quantity===1?'disabled':''}>−</button><output aria-label="${label} quantity">${item.quantity}</output><button data-cart-action="increase" data-index="${i}" aria-label="Increase ${label} quantity" ${item.quantity===maxQty?'disabled':''}>+</button></div><button class="remove-item" data-cart-action="remove" data-index="${i}" aria-label="Remove ${label} from bag">Remove</button></div></article>`;}).join('')}</div><aside class="order-summary"><h2>A little overview.</h2><span class="pill">Classroom Demo</span><div class="summary-line"><span>Subtotal (${count} ${count===1?'item':'items'})</span><strong>${money(totals.subtotal)}</strong></div><div class="summary-line"><span>Standard shipping · Mainland China</span><strong>${totals.shippingPending?'To be confirmed':money(totals.shipping)}</strong></div><p class="summary-note">${esc(shippingNote(totals))}</p><div class="summary-line summary-total"><span>${totals.shippingPending?'Demo total (excludes shipping)':'Demo total'}</span><strong>${money(totals.total)}</strong></div><button class="button primary" id="confirm-order">Confirm Demo Order ${icon('arrow')}</button><div class="demo-notice">${icon('shield')}<span>No payment. No personal information. This creates a classroom demo confirmation only.</span></div></aside></div>`;
    }
    target.addEventListener('click',e=>{
      const b=e.target.closest('[data-cart-action]');
      if(b){const cart=getCart(),i=Number(b.dataset.index);if(!cart[i])return;const action=b.dataset.cartAction;if(action==='remove'){cart.splice(i,1);toast('Removed from your little bag.');}else{cart[i].quantity=qty(cart[i].quantity+(action==='increase'?1:-1));}saveCart(cart);render();return;}
      if(e.target.closest('#confirm-order')){const cart=getCart();if(!cart.length){render();return;}const totals=calculate(cart);const now=new Date();const random=window.crypto?.randomUUID?crypto.randomUUID().slice(0,8).toUpperCase():Math.random().toString(36).slice(2,10).toUpperCase();const order={id:`DADA-DEMO-${random}`,date:now.toISOString(),label:'Classroom Demo',currency:C.currency,items:cart.map(i=>({type:i.type,skin:skin(i.skin).name,material:skin(i.skin).material,personality:personality(i.personality)?.name??null,trait:personality(i.personality)?.trait??null,quantity:i.quantity,unitPrice:itemPrice(i)})),shippingNote:shippingNote(totals),...totals};write('dazipet-last-order',order);saveCart([]);location.href='success.html';}
    });render();
    window.addEventListener('storage',e=>{if(e.key==='dazipet-cart')render();});
  }
  function initSuccess() {
    const order=read('dazipet-last-order',null),target=$('#success-content');
    if(!order || !Array.isArray(order.items) || !order.items.length || typeof order.id!=='string' || !Number.isFinite(order.total) || !Number.isFinite(order.subtotal) || !Number.isFinite(order.shipping) || order.items.some(i=>!i || !Number.isFinite(i.quantity) || !Number.isFinite(i.unitPrice))){target.innerHTML=`<div class="empty-state"><span class="empty-icon">${icon('heart')}</span><h2>Your little story <span class="serif">starts here.</span></h2><p>No demo order has been placed yet. Make your Dada selection, then confirm your classroom order from the bag.</p><a href="shop.html" class="button primary">Find your Dada ${icon('arrow')}</a></div>`;return;}
    const orderMoney = n => money(n, order.currency || 'CNY');
    target.innerHTML=`<div class="success-intro"><div class="success-seal">${icon('check')}</div><div class="eyebrow">A LITTLE HAPPINESS, CONFIRMED.</div><h1>You & Dada.<br><span class="serif">A lovely little beginning.</span></h1><p>Your classroom demo order is confirmed. Here’s a little keepsake of the companion you made your own.</p><span class="pill">Classroom Demo · No real order placed</span></div><section class="confirmation-card" aria-label="Demo order receipt"><div class="confirmation-heading"><div><span>DEMO ORDER NUMBER</span><strong>${esc(order.id)}</strong></div><div><span>ORDER TYPE</span><strong>Classroom Demo</strong></div></div>${order.items.map(i=>`<div class="confirmation-item"><div><span class="cart-type">${itemLabel(i)}</span><h3>Dada / ${esc(i.skin)}</h3><p>${esc(i.material)} · ${i.type==='skin'?'Skin only · No AI core':`${esc(i.personality)} — ${esc(i.trait)}`}<br>Quantity ${esc(i.quantity)} · ${orderMoney(i.unitPrice)} each</p></div><strong>${orderMoney(round(i.unitPrice*i.quantity))}</strong></div>`).join('')}<div class="summary-line"><span>Subtotal</span><strong>${orderMoney(order.subtotal)}</strong></div><div class="summary-line"><span>${order.shippingNote?'Standard shipping · Mainland China':'Simulated shipping'}</span><strong>${order.shippingPending?'To be confirmed':orderMoney(order.shipping)}</strong></div>${order.shippingNote?`<p class="summary-note">${esc(order.shippingNote)}</p>`:''}<div class="summary-line summary-total"><span>${order.shippingPending?'Demo total (excludes shipping)':'Demo total'}</span><strong>${orderMoney(order.total)}</strong></div><p class="currency-note">${esc(C.product.priceNote)}</p></section><p class="success-privacy">This is a classroom simulation. No money has been charged.<br>No personal details have been collected, and no products will be shipped.</p><div class="success-actions"><a href="shop.html" class="button primary">Back to the little shop ${icon('arrow')}</a><p>Your latest demo confirmation is saved in this browser.</p></div>`;
  }
  function initMiniProgram() {
    const localDate=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
    const defaults=[{id:'study',title:'A little study time',date:localDate(),time:'14:00',repeat:'Daily',done:false},{id:'water',title:'Take a water break',date:localDate(),time:'15:30',repeat:'Daily',done:false},{id:'walk',title:'A little evening walk',date:localDate(),time:'18:00',repeat:'None',done:true}];
    let raw=read('dazipet-reminders',defaults);let reminders=Array.isArray(raw)?raw.filter(r=>r && typeof r.id==='string' && typeof r.title==='string' && /^\d{4}-\d{2}-\d{2}$/.test(r.date) && /^\d{2}:\d{2}$/.test(r.time) && ['None','Daily','Weekly'].includes(r.repeat)).slice(0,30):defaults;
    let saved=read('dazipet-settings',{});if(!saved||typeof saved!=='object')saved={};
    let settings={wake:typeof saved.wake==='string'&&saved.wake.trim()?saved.wake.trim().slice(0,16):'Dada',volume:Number.isFinite(saved.volume)?Math.min(100,Math.max(0,saved.volume)):60,dnd:!!saved.dnd,dndStart:/^\d{2}:\d{2}$/.test(saved.dndStart)?saved.dndStart:'22:00',privacy:!!saved.privacy};
    let activeTab='schedule',activeTopic='Create';
    const topics={Chat:['“Hey, {name}! How was your day?”','“I’m here for yours. Tell me one little thing that happened.”'],Feelings:['“Hey, {name}, I’m feeling a little overwhelmed.”','“Let’s take a gentle pause. Want to tell me what’s on your mind?”'],Create:['“Hey, {name}! Remind me to finish my assignment at 8 PM.”',"“Got it! I'll remind you at 8 PM. You've got this!”"],View:['“Hey, {name}, what’s on my schedule?”','“Let’s look at your reminders together.”'],Edit:['“Hey, {name}, move my assignment reminder to 9 PM.”','“Of course. You can try editing the same reminder in the schedule.”'],Cancel:['“Hey, {name}, cancel my assignment reminder.”','“Plans change! You can remove it from the shared schedule.”'],Complete:['“Hey, {name}, I finished my study session!”','“A little step, a lovely win. I’m proud of your effort!”']};
    function saveReminders(){write('dazipet-reminders',reminders);}
    function saveSettings(){write('dazipet-settings',settings);$('#voice-wake-name').textContent=settings.wake;renderVoice();}
    function renderVoice(){const text=topics[activeTopic].map(t=>t.replaceAll('{name}',settings.wake));$('#voice-topics').innerHTML=Object.keys(topics).map(t=>`<button class="${t===activeTopic?'active':''}" aria-pressed="${t===activeTopic}" data-topic="${t}">${t}</button>`).join('');$('#voice-example').innerHTML=`<div>${esc(text[0])}</div><p>${esc(text[1])}</p>`;}
    function renderPhone(){
      $$('[data-phone-tab]').forEach(b=>{b.classList.toggle('active',b.dataset.phoneTab===activeTab);b.setAttribute('aria-pressed',b.dataset.phoneTab===activeTab);});
      const screen=$('#phone-screen');
      if(activeTab==='schedule'){
        const completed=reminders.filter(r=>r.done).length;
        screen.innerHTML=`<div class="phone-greeting"><h4>A little moment for you ✧</h4><p>${esc(settings.wake)} is here for your everyday.</p></div><div class="phone-day"><span>REMINDERS · ${reminders.length}</span><button class="phone-add" id="add-reminder" aria-label="Add a demo reminder">+ Add</button></div>${reminders.length?reminders.map(r=>`<div class="reminder-item ${r.done?'completed':''}"><button class="reminder-check" data-reminder="${esc(r.id)}" data-action="complete" aria-label="${r.done?'Mark incomplete':'Complete'} ${esc(r.title)}" aria-pressed="${!!r.done}">${r.done?'✓':''}</button><div class="reminder-text"><div class="reminder-title">${esc(r.title)}</div><div class="reminder-time">${esc(r.date)} · ${esc(r.time)}${r.repeat!=='None'?` · ${esc(r.repeat)}`:''}</div></div><div class="reminder-tools"><button data-reminder="${esc(r.id)}" data-action="edit" aria-label="Edit ${esc(r.title)}">Edit</button><button data-reminder="${esc(r.id)}" data-action="remove" aria-label="Delete ${esc(r.title)}">×</button></div></div>`).join(''):'<p class="phone-empty">A little breathing room.<br>Add a reminder to start your day.</p>'}<div class="phone-encouragement">${completed?`${completed} little win${completed>1?'s':''} today. Look at you go!`:'One little step is a lovely start.'} ✨</div>`;
      }else{screen.innerHTML=`<div class="phone-greeting"><h4>Make it your own.</h4><p>A little fine-tuning for your friend.</p></div><div class="settings-row"><label for="wake-name">Wake-up Name</label><input id="wake-name" type="text" value="${esc(settings.wake)}" maxlength="16" aria-label="Wake-up name"></div><div class="settings-row"><label for="volume">Volume <span id="volume-value">${settings.volume}%</span></label><input id="volume" type="range" min="0" max="100" value="${settings.volume}" aria-label="Demo device volume"></div><div class="settings-row"><label for="dnd">Do Not Disturb</label><input id="dnd" type="checkbox" ${settings.dnd?'checked':''}></div><div class="settings-row"><label for="dnd-start">Quiet time starts</label><input id="dnd-start" type="time" value="${settings.dndStart}"></div><div class="settings-row"><label for="privacy">Optional memory (demo)</label><input id="privacy" type="checkbox" ${settings.privacy?'checked':''}></div><div class="phone-settings-actions"><button id="reset-preferences">Restore defaults</button><button id="delete-preferences">Delete saved preferences</button></div><p class="phone-setting-note">Local concept only. Optional long-term memory is a future feature; this switch saves a demo preference, not conversations. No recording or device connection.</p>`;}
    }
    function reminderDialog(item=null){
      if(!item&&reminders.length>=30){toast('This concept demo supports up to 30 reminders.');return;}
      const dialog=$('#reminder-dialog');dialog.innerHTML=`<form class="reminder-form"><h2>${item?'A little adjustment.':'A little reminder.'}</h2><p>Concept demo · saved only in your browser.</p><label>Reminder<input name="title" placeholder="Review my notes" maxlength="60" required value="${esc(item?.title||'')}"></label><div class="form-pair"><label>Date<input name="date" type="date" required value="${esc(item?.date||localDate())}"></label><label>Time<input name="time" type="time" required value="${esc(item?.time||'16:00')}"></label></div><label>Repeat<select name="repeat">${['None','Daily','Weekly'].map(v=>`<option ${item?.repeat===v?'selected':''}>${v}</option>`).join('')}</select></label><div class="dialog-actions"><button type="button" id="cancel-reminder">Cancel</button><button type="submit" class="button primary compact">${item?'Save changes':'Add reminder'} ${icon('plus')}</button></div></form>`;
      $('#cancel-reminder').addEventListener('click',()=>dialog.close());
      $('form',dialog).addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.currentTarget);const title=f.get('title').trim();if(!title){$('input[name=title]',dialog).setCustomValidity('Please enter a reminder.');$('input[name=title]',dialog).reportValidity();return;}const data={id:item?.id||`r-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,title,date:f.get('date'),time:f.get('time'),repeat:f.get('repeat'),done:item?.done||false};if(item)reminders=reminders.map(r=>r.id===item.id?data:r);else reminders.push(data);saveReminders();dialog.close();renderPhone();toast(item?'Your little reminder is updated.':'A little reminder, all set.');});
      $('input[name=title]',dialog).addEventListener('input',e=>e.target.setCustomValidity(''));dialog.showModal();
    }
    $$('[data-phone-tab]').forEach(b=>b.addEventListener('click',()=>{activeTab=b.dataset.phoneTab;renderPhone();}));
    $('#voice-topics').addEventListener('click',e=>{const b=e.target.closest('[data-topic]');if(b){activeTopic=b.dataset.topic;renderVoice();}});
    $('#voice-demo').addEventListener('click',()=>{if(reminders.length>=30){toast('This concept demo supports up to 30 reminders.');return;}if(reminders.some(r=>r.id==='voice-assignment')){toast('Your assignment reminder is already in the shared schedule. Try editing it.');}else{reminders.push({id:'voice-assignment',title:'Finish my assignment',date:localDate(),time:'20:00',repeat:'None',done:false});saveReminders();toast('Voice demo: “Finish my assignment” added to the shared schedule.');}activeTopic='Create';activeTab='schedule';renderPhone();renderVoice();});
    $('#phone-screen').addEventListener('click',e=>{if(e.target.closest('#reset-preferences')||e.target.closest('#delete-preferences')){const deleting=!!e.target.closest('#delete-preferences');settings={wake:'Dada',volume:60,dnd:false,dndStart:'22:00',privacy:false};if(deleting){delete memory['dazipet-settings'];if(storageAvailable){try{localStorage.removeItem('dazipet-settings');}catch{}}$('#voice-wake-name').textContent=settings.wake;renderVoice();}else saveSettings();renderPhone();toast(deleting?'Saved demo preferences deleted. Your reminders are kept.':'Default demo preferences restored.');return;}if(e.target.closest('#add-reminder')){reminderDialog();return;}const b=e.target.closest('[data-reminder]');if(!b)return;const r=reminders.find(v=>v.id===b.dataset.reminder);if(!r)return;if(b.dataset.action==='edit'){reminderDialog(r);return;}if(b.dataset.action==='remove'){reminders=reminders.filter(v=>v.id!==r.id);toast('Reminder removed from your shared schedule.');}else{r.done=!r.done;if(r.done)toast('A little step, a lovely win. You did it!');}saveReminders();renderPhone();});
    $('#phone-screen').addEventListener('change',e=>{const el=e.target;if(el.id==='wake-name'){settings.wake=el.value.trim().slice(0,16)||'Dada';el.value=settings.wake;}else if(el.id==='volume')settings.volume=Number(el.value);else if(el.id==='dnd')settings.dnd=el.checked;else if(el.id==='dnd-start')settings.dndStart=el.value||'22:00';else if(el.id==='privacy')settings.privacy=el.checked;else return;saveSettings();toast('Demo preferences saved in this browser.');});
    $('#phone-screen').addEventListener('input',e=>{if(e.target.id==='volume')$('#volume-value').textContent=e.target.value+'%';});
    $('#voice-wake-name').textContent=settings.wake;renderVoice();renderPhone();
  }
  renderShipping();renderImages();updateCount();hydrateIcons();
  if(page==='home')initHome();else if(page==='shop')initShop();else if(page==='checkout')initCart();else if(page==='success')initSuccess();
  if(!storageAvailable)showStorageWarning();
  window.addEventListener('storage',updateCount);
  window.DAZIPET_I18N.start();
})();
