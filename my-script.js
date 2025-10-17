
const menuItems = [
  {name:'牛肉飯', price:120, extras:[{name:'加蛋',price:10},{name:'加起司',price:15},{name:'多青菜',price:5}]},
  {name:'雞腿飯', price:100, extras:[{name:'加蛋',price:10},{name:'多醬汁',price:5}]},
  {name:'排骨飯', price:110, extras:[{name:'加蛋',price:10},{name:'加辣',price:5}]},
  {name:'珍珠奶茶', price:50, extras:[{name:'去冰',price:0},{name:'少糖',price:0}]}
];

const menuDiv = document.getElementById('menu');

menuItems.forEach((item,idx)=>{
  const card=document.createElement('div');
  card.className='card';
  let extrasHtml='';
  if(item.extras && item.extras.length>0){
    extrasHtml='<div class="extras">'+item.extras.map((ex,eidx)=>`<label><input type="checkbox" data-eidx="${eidx}" data-idx="${idx}"> ${ex.name} ${ex.price>0?`(+${ex.price})`:''}</label>`).join('')+'</div>';
  }
  card.innerHTML=`<div><strong>${item.name}</strong> ($${item.price})</div>
                  <div>份數: <input type="number" min="0" max="10" value="0" data-idx="${idx}"></div>`+extrasHtml;
  menuDiv.appendChild(card);
});

function updateTotal(){
  let total=0;
  menuItems.forEach((item,idx)=>{
    const qtyInput = document.querySelector('input[type=number][data-idx="'+idx+'"]');
    let qty = parseInt(qtyInput.value)||0;
    let extrasTotal=0;
    const checkedExtras = document.querySelectorAll('input[type=checkbox][data-idx="'+idx+'"]:checked');
    checkedExtras.forEach(chk=>{
      const eidx=parseInt(chk.dataset.eidx);
      extrasTotal += item.extras[eidx].price;
    });
    total += (item.price + extrasTotal) * qty;
  });
  document.getElementById('total').textContent = total;
}

document.querySelectorAll('input[type=number]').forEach(i=>i.addEventListener('input', updateTotal));
document.querySelectorAll('input[type=checkbox]').forEach(c=>c.addEventListener('change', updateTotal));

// 下一步
document.getElementById('nextStep').addEventListener('click', ()=>{
  const summaryDiv = document.getElementById('summary');
  summaryDiv.innerHTML='';
  let total=0;
  menuItems.forEach((item,idx)=>{
    const qtyInput=document.querySelector('input[type=number][data-idx="'+idx+'"]');
    const qty=parseInt(qtyInput.value)||0;
    if(qty>0){
      const checkedExtras = document.querySelectorAll('input[type=checkbox][data-idx="'+idx+'"]:checked');
      const extrasNames = [...checkedExtras].map(chk=>item.extras[parseInt(chk.dataset.eidx)].name);
      const subTotal=(item.price + extrasNames.reduce((acc,n)=>{
        const ex=item.extras.find(e=>e.name===n);
        return acc+(ex?ex.price:0);
      },0)) * qty;
      total+=subTotal;
      const div=document.createElement('div');
      div.textContent=`${item.name} x ${qty}` + (extrasNames.length>0?` [${extrasNames.join(', ')}]`:'') + ` = $${subTotal}`;
      summaryDiv.appendChild(div);
    }
  });
  const totalDiv=document.createElement('div');
  totalDiv.innerHTML=`<strong>總金額: $${total}</strong>`;
  summaryDiv.appendChild(totalDiv);
  document.getElementById('step1').classList.add('hidden');
  document.getElementById('step2').classList.remove('hidden');
});

document.getElementById('backBtn').addEventListener('click', ()=>{
  document.getElementById('step2').classList.add('hidden');
  document.getElementById('step1').classList.remove('hidden');
});

document.getElementById('copyBtn').addEventListener('click', ()=>{
  const notes=document.getElementById('notes').value;
  const summaryText=[...document.getElementById('summary').children].map(c=>c.textContent).join('\n');
  navigator.clipboard.writeText(summaryText + (notes? '\n備註: '+notes : ''));
  alert('已複製餐單到剪貼簿，可貼到 Line 或其他平台');

});
