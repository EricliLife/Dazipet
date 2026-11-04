// Dependency-free checks against the actual cart functions in dist/script.js.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'dist/script.js'), 'utf8');
const context = vm.createContext({window:{}, __raw:[]});
vm.runInContext(fs.readFileSync(path.join(root, 'dist/config.js'), 'utf8'), context);
const helpers = source.slice(source.indexOf('  const C ='), source.indexOf('  const page ='));
const cartFunctions = source.slice(source.indexOf('  const itemPrice ='), source.indexOf('  function addItem('));
const calculate = source.slice(source.indexOf('  function calculate('), source.indexOf('  function initCart('));
vm.runInContext(helpers + '\nconst read = () => globalThis.__raw;\n' + cartFunctions + calculate + '\nglobalThis.api = {getCart, calculate, itemPrice, sameItem, money};', context);
assert.equal(context.api.money(59.99),'$59.99 USD');
assert.equal(context.api.money(8.99),'$8.99 USD');
assert.equal(context.api.money(399,'CNY'),'CN¥399.00 CNY');
const set = {type:'set',skin:'cloud',personality:'wood',quantity:1};
const extra = {type:'skin',skin:'sun',personality:null,quantity:1};
assert.equal(context.api.calculate([set]).total,59.99);
assert.equal(context.api.calculate([{...set,quantity:2}]).total,119.98);
for(const personality of context.window.DAZIPET_CONFIG.personalities){
  for(const skin of context.window.DAZIPET_CONFIG.skins){
    const result=context.api.calculate([{...set,personality:personality.id,skin:skin.id}]);
    assert.equal(result.total,59.99,`${personality.id} / ${skin.id}`);
    assert.equal(result.shipping,0);
  }
}
assert.equal(context.api.calculate([set]).shipping,0);
assert.equal(context.api.calculate([set]).shippingPending,false);
assert.equal(context.api.calculate([set,extra]).subtotal,68.98);
assert.equal(context.api.calculate([set,extra]).shipping,0);
assert.equal(context.api.calculate([set,extra]).shippingPending,false);
assert.equal(context.api.calculate([set,{...extra,quantity:2}]).total,77.97);
assert.equal(context.api.calculate([{...set,quantity:2},extra]).total,128.97);
assert.equal(context.api.calculate([extra]).total,8.99);
assert.equal(context.api.calculate([extra]).shippingPending,true);
context.window.DAZIPET_CONFIG.shipping.standaloneSkinFee = 5;
assert.equal(context.api.calculate([{...extra,quantity:2}]).shipping,5);
assert.equal(context.api.calculate([{...extra,quantity:2}]).total,22.98);
assert.equal(context.api.calculate([extra]).shippingPending,false);
assert.equal(context.api.calculate([set,extra]).total,68.98);
context.window.DAZIPET_CONFIG.shipping.standaloneSkinFee = null;
assert.equal(context.api.calculate([]).total,0);
assert.equal(context.api.calculate([]).shippingPending,false);
context.__raw = [{skin:'cloud',personality:'wood',quantity:1}, {...set,quantity:2}, {type:'skin',skin:'cloud',personality:'fire',quantity:1}];
let cart = context.api.getCart();
assert.equal(cart.length,2);
assert.equal(cart[0].type,'set');
assert.equal(cart[0].quantity,3);
assert.equal(cart[1].type,'skin');
assert.equal(cart[1].personality,null);
context.__raw = [{...set,quantity:1000}, {...extra,quantity:-5}, {type:'set',skin:'cloud',personality:'unknown'}, {type:'unknown',skin:'sun'}, null];
cart=context.api.getCart();
assert.equal(cart.length,2);
assert.equal(cart[0].quantity,99);
assert.equal(cart[1].quantity,1);
assert.equal(context.api.sameItem(set,{...set,personality:'fire'}),false);
console.log('PASS: USD pricing, quantities, mainland-China free shipping, combined delivery, pending standalone-skin shipping, shipping charged once, empty cart, V1 migration, type separation and limits.');
