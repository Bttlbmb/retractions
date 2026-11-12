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
  const initial=new URLSearchParams(location.search);
  for(const input of [search,region,topic,status,severity]) {
    const value=initial.get(input.name);
    if(value && (input===search || [...input.options].some(o=>o.value===value)))input.value=value;
  }
  function update(){
    const words=search.value.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
    let visible=0;
    for(const row of rows){
      row.hidden=!(words.every(w=>row.dataset.search.includes(w))&&(region.value==='all'||(region.value==='focus'?['Germany','United Kingdom','Austria','Switzerland'].includes(row.dataset.region):row.dataset.region===region.value))&&(!topic.value||row.dataset.topic===topic.value)&&(!status.value||row.dataset.status===status.value)&&(!severity.value||row.dataset.severity===severity.value));
      if(!row.hidden)visible++;
    }
    count.textContent=`${visible} ${visible===1?'case':'cases'}`;
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
  update();
})();
