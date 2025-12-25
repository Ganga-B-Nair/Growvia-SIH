// app.js
const THEME = { bg:'#2A2A2A', text:'#ECECEC', accent:'#4682B4' };

const StorageKeys = {
  profile:'growvia:profile',
  timeline:'growvia:timeline'
};

function readJson(key, fallback){ try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
function writeJson(key, value){ localStorage.setItem(key, JSON.stringify(value)); }

function navigate(hash){ if(location.hash !== hash){ location.hash = hash; } else { render(); } }

const Routes = {
  '#/': DashboardPage,
  '#/onboarding': OnboardingPage,
  '#/chatbot': ChatbotPage,
  '#/quiz': QuizPage,
  '#/visualizer': VisualizerPage,
  '#/colleges': CollegesPage,
  '#/groups': InterestGroupsPage,
  '#/timeline': TimelinePage,
  '#/wrapped': CareerWrappedPage,
  '#/settings': SettingsPage,
};

function AppShell(){
  const profile = readJson(StorageKeys.profile, null);
  const nav = NavBar(profile);
  const main = `<main class="main"><div class="container" id="view"></div></main>`;
  const footer = `<div class="footer">© ${new Date().getFullYear()} Growvia</div>`;
  return `<div class="app-shell">${nav}${main}${footer}</div>`;
}

function NavBar(profile){
  const links = [
    ['#/','Dashboard'],
    ['#/chatbot','Chatbot'],
    ['#/quiz','Aptitude Quiz'],
    ['#/visualizer','Career Paths'],
    ['#/colleges','Colleges'],
    ['#/groups','Interest Groups'],
    ['#/timeline','Timeline'],
    ['#/wrapped','Career Wrapped'],
  ];
  const linkHtml = links.map(([href,label])=>{
    const active = location.hash === href ? 'active' : '';
    return `<a class="${active}" href="${href}">${label}</a>`;
  }).join('');
  const onboardingCta = !profile ? `<a class="btn" href="#/onboarding">Get Started</a>` : '';
  return `<nav class="navbar"><div class="navbar-inner">
    <div class="brand" onclick="location.hash='#/';" style="cursor:pointer">
      <div class="brand-mark"></div>
      <div class="brand-name">Growvia</div>
    </div>
    <div class="nav-links">${linkHtml}</div>
    <div>${onboardingCta}</div>
  </div></nav>`;
}

function DashboardPage(){
  const profile = readJson(StorageKeys.profile, null);
  const greeting = profile ? `Welcome back, ${profile.name || 'Explorer'}!` : 'Welcome to Growvia';
  const cards = [
    { title:'AI Chatbot', desc:'Ask anything about careers, skills, and colleges.', href:'#/chatbot' },
    { title:'Aptitude Quiz', desc:'Discover strengths and tailored suggestions.', href:'#/quiz' },
    { title:'Career Paths', desc:'Explore roles and trajectories.', href:'#/visualizer' },
    { title:'Colleges', desc:'Find programs matching your goals.', href:'#/colleges' },
    { title:'Interest Groups', desc:'See market trends and opportunities.', href:'#/groups' },
    { title:'Timeline', desc:'Track goals and achievements.', href:'#/timeline' },
    { title:'Career Wrapped', desc:'Your highlights over a set duration.', href:'#/wrapped' },
  ];
  const kpis = `<div class="grid cols-3">
    <div class="kpi"><div class="value">${(readJson(StorageKeys.timeline,[])).length}</div><div class="label">Goals in Timeline</div></div>
    <div class="kpi"><div class="value">${(readJson(StorageKeys.timeline,[])).filter(Boolean).length}</div><div class="label">Entries Logged</div></div>
    <div class="kpi"><div class="value">${profile? (profile.interests?.length||0):0}</div><div class="label">Interests</div></div>
  </div>`;
  const grid = `<div class="grid cols-3">${cards.map(c=>`<a href="${c.href}" class="glass card" style="text-decoration:none;color:inherit"><h3>${c.title}</h3><div class="muted">${c.desc}</div></a>`).join('')}</div>`;
  return `<section class="glass hero"><div><div class="tag">One-stop Career Advisor</div><h1>${greeting}</h1><div class="muted">Use the navigation to explore features.</div></div><a class="btn" href="#/onboarding">${profile?'Edit Profile':'Get Started'}</a></section>
  <section class="container">${kpis}</section>
  <section class="container">${grid}</section>`;
}

function OnboardingPage(){
  const profile = readJson(StorageKeys.profile, {});
  return `<section class="container glass card">
    <h2>Tell us about you</h2>
    <form id="onb-form" class="grid cols-2" onsubmit="return false;">
      <div>
        <label>Name</label>
        <input class="input" name="name" placeholder="Your name" value="${profile.name||''}" />
      </div>
      <div>
        <label>Education Level</label>
        <select name="level">
          ${['High School','Diploma','Undergraduate','Graduate','Postgraduate','Working Professional','Career Switcher'].map(l=>`<option ${profile.level===l?'selected':''}>${l}</option>`).join('')}
        </select>
      </div>
      <div>
        <label>Field of Study / Domain</label>
        <input class="input" name="field" placeholder="e.g., Computer Science, Design, Commerce" value="${profile.field||''}" />
      </div>
      <div>
        <label>Years of Experience</label>
        <input class="input" type="number" min="0" max="40" name="yoe" value="${profile.yoe??0}" />
      </div>
      <div class="cols-2" style="grid-column:1/-1">
        <label>Interests (comma separated)</label>
        <input class="input" name="interests" placeholder="AI, Finance, Design, Marketing" value="${(profile.interests||[]).join(', ')}" />
      </div>
      <div style="grid-column:1/-1;display:flex;gap:10px;justify-content:flex-end;margin-top:8px">
        <button class="btn secondary" onclick="navigate('#/');">Cancel</button>
        <button class="btn" id="save-profile">Save Profile</button>
      </div>
    </form>
  </section>`;
}

function ChatbotPage(){
  return `<section class="container glass card">
    <h2>AI Chatbot</h2>
    <div class="muted">Prototype: answers are generated locally without an API key.</div>
    <div style="margin-top:10px">
      <textarea id="chat-input" rows="3" class="input" placeholder="Ask about careers, skills, colleges..."></textarea>
      <div style="display:flex;gap:10px;margin-top:10px">
        <button class="btn" id="chat-send">Ask</button>
        <button class="btn secondary" id="chat-clear">Clear</button>
      </div>
      <div id="chat-log" style="margin-top:14px;display:flex;flex-direction:column;gap:10px"></div>
    </div>
  </section>`;
}

function QuizPage(){
  const questions = [
    { id:'logic', q:'I enjoy solving logical puzzles', w:'Analytical' },
    { id:'people', q:'I like working with people and teams', w:'People-Oriented' },
    { id:'creative', q:'I enjoy creative tasks like design or writing', w:'Creative' },
    { id:'hands', q:'I prefer hands-on, practical work', w:'Practical' },
    { id:'data', q:'I like working with data and numbers', w:'Data-Driven' },
  ];
  const options = [
    {v:2,label:'Strongly Agree'},
    {v:1,label:'Agree'},
    {v:0,label:'Neutral'},
    {v:-1,label:'Disagree'},
    {v:-2,label:'Strongly Disagree'},
  ];
  return `<section class="container glass card">
    <h2>Aptitude Quiz</h2>
    <form id="quiz-form" class="grid">
      ${questions.map(q=>`<div class="glass card">
        <div style="font-weight:600">${q.q}</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">${options.map(o=>`<label style="display:flex;gap:6px;align-items:center"><input type="radio" name="${q.id}" value="${o.v}"> ${o.label}</label>`).join('')}</div>
      </div>`).join('')}
      <div style="display:flex;gap:10px;justify-content:flex-end">
        <button class="btn" id="quiz-submit">Get Recommendations</button>
      </div>
    </form>
    <div id="quiz-result" style="margin-top:12px"></div>
  </section>`;
}

function VisualizerPage(){
  const roles = getCareerRoles();
  const svg = renderCareerSvg(roles);
  const list = roles.map(r=>`<div class="glass card">${r.title}<div class="muted" style="margin-top:4px">${r.cluster} • ${r.levels.join(' → ')}</div></div>`).join('');
  return `<section class="container">
    <div class="glass card"><h2>Career Path Visualizer</h2><div class="muted">Explore visible options across domains.</div></div>
    <div class="glass card" style="margin-top:14px">${svg}</div>
    <div class="grid cols-3" style="margin-top:14px">${list}</div>
  </section>`;
}

function CollegesPage(){
  const sample = getSampleColleges();
  return `<section class="container glass card">
    <h2>College Directory</h2>
    <input id="college-search" class="input" placeholder="Search by program, city, or college name" />
    <div id="college-list" class="grid cols-2" style="margin-top:12px">${sample.map(renderCollegeCard).join('')}</div>
  </section>`;
}

function InterestGroupsPage(){
  const clusters = ['Technology','Business','Design','Healthcare','Data','Public Sector'];
  const cards = clusters.map(c=>{
    const insight = pseudoAiInsight(c);
    return `<div class="glass card">
      <h3>${c}</h3>
      <div class="muted" style="margin:6px 0">${insight.trend}</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">${insight.topRoles.map(r=>`<span class="hero tag">${r}</span>`).join('')}</div>
    </div>`;
  }).join('');
  return `<section class="container">
    <div class="glass card"><h2>Interest Groups</h2><div class="muted">AI-like insights on opportunities and market trends.</div></div>
    <div class="grid cols-3" style="margin-top:14px">${cards}</div>
  </section>`;
}

function TimelinePage(){
  const items = readJson(StorageKeys.timeline, []);
  return `<section class="container glass card">
    <h2>Timeline Tracker</h2>
    <form id="tl-form" class="grid cols-2" onsubmit="return false;">
      <div>
        <label>Goal / Achievement</label>
        <input class="input" name="title" placeholder="e.g., Completed SQL course" />
      </div>
      <div>
        <label>Date</label>
        <input class="input" type="date" name="date" />
      </div>
      <div style="grid-column:1/-1;display:flex;justify-content:flex-end"><button class="btn" id="tl-add">Add</button></div>
    </form>
    <div id="tl-list" class="grid" style="margin-top:12px">
      ${items.map(renderTimelineItem).join('')}
    </div>
  </section>`;
}

function CareerWrappedPage(){
  return `<section class="container glass card">
    <h2>Career Wrapped</h2>
    <div class="muted">Choose a duration (1-6 months) to see your highlights.</div>
    <div style="display:flex;gap:10px;align-items:center;margin-top:10px">
      <label style="margin:0">Duration (months)</label>
      <select id="wrap-months">${[1,2,3,4,5,6].map(n=>`<option value="${n}">${n}</option>`).join('')}</select>
      <button class="btn" id="wrap-generate">Generate</button>
    </div>
    <div id="wrap-result" style="margin-top:14px"></div>
  </section>`;
}

function SettingsPage(){
  return `<section class="container glass card">
    <h2>Settings</h2>
    <div class="muted">Profile data is stored locally in your browser.</div>
  </section>`;
}

function render(){
  const root = document.getElementById('root');
  root.innerHTML = AppShell();
  const view = document.getElementById('view');
  const route = Routes[location.hash || '#/'] || DashboardPage;
  view.innerHTML = route();
  attachHandlers();
}

function attachHandlers(){
  // Onboarding save
  const saveBtn = document.getElementById('save-profile');
  if(saveBtn){
    saveBtn.addEventListener('click', ()=>{
      const form = document.getElementById('onb-form');
      const formData = new FormData(form);
      const profile = {
        name: formData.get('name')?.toString().trim(),
        level: formData.get('level')?.toString(),
        field: formData.get('field')?.toString().trim(),
        yoe: Number(formData.get('yoe')||0),
        interests: (formData.get('interests')?.toString()||'').split(',').map(s=>s.trim()).filter(Boolean),
      };
      writeJson(StorageKeys.profile, profile);
      navigate('#/');
    });
  }
  // Chatbot
  const chatSend = document.getElementById('chat-send');
  const chatClear = document.getElementById('chat-clear');
  if(chatSend){
    chatSend.addEventListener('click', ()=>{
      const input = document.getElementById('chat-input');
      const log = document.getElementById('chat-log');
      const q = (input.value||'').trim();
      if(!q) return;
      const a = fakeChatbotAnswer(q);
      log.insertAdjacentHTML('beforeend', `<div class="glass card"><div><strong>You:</strong> ${escapeHtml(q)}</div><div style="margin-top:6px"><strong>Growvia:</strong> ${a}</div></div>`);
      input.value='';
      log.scrollTop = log.scrollHeight;
    });
  }
  if(chatClear){ chatClear.addEventListener('click', ()=>{ const log=document.getElementById('chat-log'); if(log) log.innerHTML=''; }); }

  // Quiz
  const quizBtn = document.getElementById('quiz-submit');
  if(quizBtn){
    quizBtn.addEventListener('click', ()=>{
      const form = document.getElementById('quiz-form');
      const data = new FormData(form);
      const scores = {Analytical:0,'People-Oriented':0,Creative:0,Practical:0,'Data-Driven':0};
      for(const [k,v] of data.entries()){
        const map = {logic:'Analytical',people:'People-Oriented',creative:'Creative',hands:'Practical',data:'Data-Driven'};
        scores[map[k]] += Number(v);
      }
      const sorted = Object.entries(scores).sort((a,b)=>b[1]-a[1]);
      const topTrait = sorted[0][0];
      const recs = traitToRecommendations(topTrait);
      document.getElementById('quiz-result').innerHTML = `<div class="glass card"><div><strong>Your dominant trait:</strong> ${topTrait}</div><div style="margin-top:6px"><strong>Suggested paths:</strong> ${recs.join(', ')}</div></div>`;
    });
  }

  // Timeline add
  const tlAdd = document.getElementById('tl-add');
  if(tlAdd){
    tlAdd.addEventListener('click', ()=>{
      const form = document.getElementById('tl-form');
      const fd = new FormData(form);
      const item = { id: crypto.randomUUID(), title: fd.get('title')?.toString().trim(), date: fd.get('date')?.toString() };
      if(!item.title || !item.date) return;
      const items = readJson(StorageKeys.timeline, []);
      items.push(item);
      writeJson(StorageKeys.timeline, items);
      navigate('#/timeline');
    });
  }

  // Wrapped generate
  const wrapBtn = document.getElementById('wrap-generate');
  if(wrapBtn){
    wrapBtn.addEventListener('click', ()=>{
      const months = Number(document.getElementById('wrap-months').value || 1);
      const end = new Date();
      const start = new Date(); start.setMonth(start.getMonth() - months);
      const items = readJson(StorageKeys.timeline, []);
      const inRange = items.filter(it=>{ const d=new Date(it.date); return d>=start && d<=end; });
      const achievements = inRange.length;
      const topWords = getTopWords(inRange.map(i=>i.title).join(' '));
      const emoji = ['🚀','🎯','📈','💼','🧠','🎓'][achievements%6];
      const html = `<div class="glass card">
        <h3>${emoji} Your ${months}-month Career Wrapped</h3>
        <div class="grid cols-3" style="margin-top:10px">
          <div class="kpi"><div class="value">${achievements}</div><div class="label">Milestones</div></div>
          <div class="kpi"><div class="value">${topWords[0]||'—'}</div><div class="label">Theme</div></div>
          <div class="kpi"><div class="value">${formatDate(start)} → ${formatDate(end)}</div><div class="label">Period</div></div>
        </div>
        <div style="margin-top:12px" class="muted">Highlights</div>
        <ul>${inRange.map(i=>`<li>${formatDate(new Date(i.date))}: ${escapeHtml(i.title)}</li>`).join('')}</ul>
      </div>`;
      document.getElementById('wrap-result').innerHTML = html;
    });
  }
}

// Utilities and data
function escapeHtml(s){ return s.replace(/[&<>"']/g, m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m])); }
function formatDate(d){ return d.toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'}); }

function fakeChatbotAnswer(q){
  const profile = readJson(StorageKeys.profile, {});
  const name = profile.name || 'friend';
  const base = `Hi ${name}, here are some ideas:`;
  if(/college|university|program/i.test(q)) return `${base} Explore programs aligned with your interests (${(profile.interests||['your interests']).join(', ')}). Use the Colleges page to filter by program and city. Consider internships for applied learning.`;
  if(/resume|cv/i.test(q)) return `${base} Tailor your resume to a target role, quantify outcomes, and include 2-3 relevant projects. Use the Timeline to track progress.`;
  if(/switch|transition/i.test(q)) return `${base} Map your current skills to adjacent roles via the Career Paths visualizer, then fill gaps with 1-2 targeted courses.`;
  return `${base} Try the Aptitude Quiz for strengths, browse Career Paths, and set 2 short-term goals in the Timeline.`;
}

function traitToRecommendations(trait){
  switch(trait){
    case 'Analytical': return ['Software Engineer','Business Analyst','Quant Research','Systems Engineer'];
    case 'People-Oriented': return ['Product Manager','HR Specialist','Customer Success','Sales Engineer'];
    case 'Creative': return ['UX/UI Designer','Content Strategist','Brand Designer','Game Designer'];
    case 'Practical': return ['Operations','Mechanical Tech','Field Engineer','Supply Chain'];
    case 'Data-Driven': return ['Data Analyst','Data Scientist','BI Engineer','ML Engineer'];
    default: return ['Generalist'];
  }
}

function getCareerRoles(){
  return [
    { title:'Software Engineer', cluster:'Technology', levels:['Intern','Junior','Mid','Senior','Staff'] },
    { title:'DevOps Engineer', cluster:'Technology', levels:['Associate','Engineer','Senior','Lead'] },
    { title:'Cloud Engineer', cluster:'Technology', levels:['Associate','Engineer','Senior','Architect'] },
    { title:'Cybersecurity Analyst', cluster:'Technology', levels:['Junior','Mid','Senior'] },
    { title:'Data Analyst', cluster:'Data', levels:['Junior','Mid','Senior','Lead'] },
    { title:'Data Scientist', cluster:'Data', levels:['Junior','Mid','Senior','Lead'] },
    { title:'ML Engineer', cluster:'Data', levels:['Junior','Mid','Senior'] },
    { title:'BI Engineer', cluster:'Data', levels:['Junior','Mid','Senior'] },
    { title:'Product Manager', cluster:'Business', levels:['Associate','PM','Senior PM','Lead'] },
    { title:'Business Analyst', cluster:'Business', levels:['Analyst','Senior','Manager'] },
    { title:'Marketing Specialist', cluster:'Business', levels:['Associate','Specialist','Manager'] },
    { title:'Growth Marketer', cluster:'Business', levels:['Associate','Manager','Lead'] },
    { title:'UX Designer', cluster:'Design', levels:['Junior','Mid','Senior','Lead'] },
    { title:'Product Designer', cluster:'Design', levels:['Junior','Mid','Senior'] },
    { title:'Content Designer', cluster:'Design', levels:['Junior','Mid','Senior'] },
    { title:'Motion Designer', cluster:'Design', levels:['Junior','Mid','Senior'] },
    { title:'Healthcare Administrator', cluster:'Healthcare', levels:['Coordinator','Manager','Director'] },
    { title:'Clinical Data Manager', cluster:'Healthcare', levels:['Associate','Manager','Lead'] },
    { title:'Public Health Analyst', cluster:'Healthcare', levels:['Analyst','Senior','Lead'] },
    { title:'Civil Engineer', cluster:'Public Sector', levels:['Junior','Engineer','Senior','Principal'] },
    { title:'Urban Planner', cluster:'Public Sector', levels:['Junior','Mid','Senior'] },
    { title:'Policy Analyst', cluster:'Public Sector', levels:['Analyst','Senior','Lead'] },
    { title:'Operations Manager', cluster:'Business', levels:['Associate','Manager','Director'] },
    { title:'Systems Engineer', cluster:'Technology', levels:['Junior','Mid','Senior'] },
  ];
}

function renderCareerSvg(roles){
  const width = 1000, height = 280;
  const clusters = [...new Set(roles.map(r=>r.cluster))];
  const clusterX = (i)=> 80 + i * ((width-160) / Math.max(1,clusters.length-1));
  const nodes = [];
  clusters.forEach((c,i)=>{ nodes.push({id:`c-${c}`, label:c, x:clusterX(i), y:40, type:'cluster'}); });
  roles.forEach((r,idx)=>{ nodes.push({id:`r-${idx}`, label:r.title, cluster:r.cluster, x:clusterX(clusters.indexOf(r.cluster)), y:90 + (idx%7)*26, type:'role'}); });
  let svg = `<svg viewBox="0 0 ${width} ${height}" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#4682B4" stop-opacity="0.9"/><stop offset="100%" stop-color="#ffffff" stop-opacity="0.2"/></linearGradient></defs>`;
  // connectors
  nodes.filter(n=>n.type==='role').forEach(n=>{
    svg += `<line x1="${n.x}" y1="${n.y-10}" x2="${n.x}" y2="60" stroke="url(#g)" stroke-width="2" opacity="0.6"/>`;
  });
  // nodes
  nodes.forEach(n=>{
    const w = n.type==='cluster'? 150 : 180; const h = 26;
    const x = n.x - w/2; const y = n.y - h/2;
    svg += `<rect x="${x}" y="${y}" rx="10" ry="10" width="${w}" height="${h}" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" />`;
    svg += `<text x="${n.x}" y="${n.y+5}" fill="#ECECEC" font-size="12" text-anchor="middle">${n.label}</text>`;
  });
  svg += `</svg>`;
  return svg;
}

function getSampleColleges(){
  return [
    { name:'TechVille Institute of Technology', city:'Pune', programs:['Computer Science','AI','Data Science'] },
    { name:'Northshore University', city:'Delhi', programs:['Business','Finance','Marketing'] },
    { name:'Crest Design School', city:'Bengaluru', programs:['Design','UX/UI','Animation'] },
    { name:'Greenfield Medical College', city:'Chennai', programs:['Healthcare Admin','Nursing','Biotech'] },
  ];
}
function renderCollegeCard(c){
  return `<div class="glass card"><div style="font-weight:700">${c.name}</div><div class="muted">${c.city}</div><div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap">${c.programs.map(p=>`<span class="hero tag">${p}</span>`).join('')}</div></div>`;
}

function pseudoAiInsight(cluster){
  const trends = {
    'Technology':'Hiring steady in platform engineering and cybersecurity; AI-assisted tooling rising.',
    'Business':'Product-led growth and data literacy in demand; fintech resilient.',
    'Design':'UX research and systems design trending; motion skills add edge.',
    'Healthcare':'Telehealth operations, informatics, and compliance roles expanding.',
    'Data':'Analytics engineering and MLOps on the rise; governance a plus.',
    'Public Sector':'Civic tech, infra modernization, and sustainability programs growing.',
  };
  const roles = {
    'Technology':['Software Engineer','Cloud Engineer','Security Analyst','DevOps Engineer'],
    'Business':['Product Manager','Business Analyst','Growth Marketer','Ops Manager'],
    'Design':['UX Designer','Product Designer','Content Designer','Motion Designer'],
    'Healthcare':['Health Admin','Clinical Data Manager','Public Health Analyst'],
    'Data':['Data Analyst','Data Scientist','BI Engineer','ML Engineer'],
    'Public Sector':['Civil Engineer','Urban Planner','Policy Analyst'],
  };
  return { trend: trends[cluster], topRoles: roles[cluster] };
}

function getTopWords(text){
  const stop = new Set(['the','and','of','to','a','in','for','on','with','at','by','is','it','my','our','your']);
  const counts = {};
  text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean).forEach(w=>{ if(!stop.has(w)){ counts[w]=(counts[w]||0)+1; } });
  return Object.entries(counts).sort((a,b)=>b[1]-a[1]).map(([w])=>w);
}

// timeline helpers
function renderTimelineItem(it){
  return `<div class="glass card"><div style="font-weight:600">${escapeHtml(it.title)}</div><div class="muted">${formatDate(new Date(it.date))}</div></div>`;
}

window.addEventListener('hashchange', render);
window.addEventListener('DOMContentLoaded', ()=>{
  // First-time users go to onboarding
  if(!readJson(StorageKeys.profile, null) && (location.hash==='' || location.hash==='#/' )) {
    navigate('#/onboarding');
  } else {
    render();
  }
  // search handler for colleges
  document.addEventListener('input', (e)=>{
    if(e.target && e.target.id==='college-search'){
      const q = e.target.value.toLowerCase();
      const sample = getSampleColleges();
      const filtered = sample.filter(c=> c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q) || c.programs.some(p=>p.toLowerCase().includes(q)) );
      const list = document.getElementById('college-list');
      if(list) list.innerHTML = filtered.map(renderCollegeCard).join('');
    }
  });
});