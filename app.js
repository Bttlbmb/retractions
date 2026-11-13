(() => {
  const form=document.getElementById('filters');
  const search=document.getElementById('search');
  const topic=document.getElementById('topic');
  const region=document.getElementById('region');
  const status=document.getElementById('status');
  const severity=document.getElementById('severity');
  const rows=[...document.querySelectorAll('#cases .case-row')];
  const count=document.getElementById('count');
  const empty=document.getElementById('empty');
  const toggle=document.getElementById('filters-toggle');
  const badge=toggle.querySelector('.filters-badge');
  const reset=form.querySelector('.reset');
  const fullPlaceholder=search.placeholder;
  const phone=matchMedia('(max-width:700px)');
  const setPlaceholder=()=>{search.placeholder=phone.matches?'Search cases':fullPlaceholder};
  setPlaceholder();
  phone.addEventListener('change',setPlaceholder);
  toggle.addEventListener('click',()=>toggle.setAttribute('aria-expanded',String(form.classList.toggle('open'))));
  const initial=new URLSearchParams(location.search);
  for(const input of [search,region,topic,status,severity]) {
    const value=initial.get(input.name);
    if(value && (input===search || [...input.options].some(o=>o.value===value)))input.value=value;
  }
  const focus=['Germany','United Kingdom','Austria','Switzerland'];
  const countries=region.options[0].textContent;
  const note=document.getElementById('filter-note');
  const noteText=note.querySelector('span');
  const showOthers=document.getElementById('show-others');
  const emptyHead=empty.querySelector('h2');
  const emptyText=empty.querySelector('p');
  const matches=n=>`${n} ${n===1?'match':'matches'}`;
  function update(){
    const words=search.value.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
    const narrowing=words.length>0||topic.value||status.value||severity.value;
    let visible=0,others=0;
    for(const row of rows){
      const fits=words.every(w=>row.dataset.search.includes(w))&&(!topic.value||row.dataset.topic===topic.value)&&(!status.value||row.dataset.status===status.value)&&(!severity.value||row.dataset.severity===severity.value);
      const inRegion=region.value==='all'||(region.value==='focus'?focus.includes(row.dataset.region):row.dataset.region===region.value);
      row.hidden=!(fits&&inRegion);
      if(!row.hidden)visible++;
      else if(fits&&narrowing&&region.value==='focus')others++;
    }
    count.textContent=`${visible} of ${rows.length} cases`;
    const active=[region.value!=='focus',topic.value,status.value,severity.value].filter(Boolean).length;
    badge.textContent=active;
    badge.hidden=!active;
    for(const select of [region,topic,status,severity])select.classList.toggle('active',select===region?select.value!=='focus':select.value!=='');
    reset.hidden=!(active||search.value.trim());
    noteText.textContent=`${matches(others)} in other countries.`;
    note.hidden=!others||visible===0;
    showOthers.textContent=`Show ${matches(others)} in other countries`;
    showOthers.hidden=!others;
    emptyHead.textContent=others?`No matches in ${countries}`:'No matching cases';
    emptyText.textContent=others?`${matches(others)} in other countries.`:'Try another term or reset the filters.';
    empty.hidden=visible!==0;
    const p=new URLSearchParams();
    if(search.value.trim())p.set('q',search.value.trim());
    if(region.value!=='focus')p.set('region',region.value);
    if(topic.value)p.set('topic',topic.value);
    if(status.value)p.set('status',status.value);
    if(severity.value)p.set('severity',severity.value);
    if(location.protocol==='http:'||location.protocol==='https:')history.replaceState(null,'',location.pathname+(p.size?'?'+p.toString():'')+location.hash);
  }
  form.addEventListener('submit',event=>event.preventDefault());
  form.addEventListener('input',update);
  form.addEventListener('reset',()=>requestAnimationFrame(update));
  document.getElementById('clear-empty').addEventListener('click',()=>{form.reset();search.focus();});
  const showAll=()=>{region.value='all';update();};
  showOthers.addEventListener('click',showAll);
  note.querySelector('button').addEventListener('click',showAll);
  update();
})();
