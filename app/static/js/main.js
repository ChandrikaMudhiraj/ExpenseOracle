// ExpenseOracle demo frontend JS
// - Simple routing by data-route buttons
// - Fetches backend endpoints and renders results
// - Inline comments explain what each section does

/* Helper: simple DOM mount */
const $ = (sel) => document.querySelector(sel)

// Render helpers
function renderDashboard(){
  const el = document.createElement('div')
  el.className='card'
  el.innerHTML = `
    <h2>Forecast & Autonomous Demo</h2>
    <div class="grid">
      <div>
        <button id="openChart" class="btn">Open Forecast Chart</button>
        <div style="margin-top:12px"><img id="chartImg" style="max-width:100%"/></div>
      </div>
      <div>
        <button id="runAuto" class="btn secondary">Run Autonomous Demo</button>
        <pre id="autoOut">No actions yet.</pre>
      </div>
    </div>
  `

  // attach events after element added
  setTimeout(()=>{
    document.getElementById('openChart').onclick = ()=>{
      // call the backend chart route (returns image/png)
      document.getElementById('chartImg').src = '/dashboard/forecast_chart?months=6'
    }
    document.getElementById('runAuto').onclick = async ()=>{
      const res = await fetch('/dashboard/autonomous_actions')
      const json = await res.json()
      document.getElementById('autoOut').textContent = JSON.stringify(json, null, 2)
    }
  },50)
  return el
}

function renderAssistant(){
  const el = document.createElement('div')
  el.className='card'
  el.innerHTML = `
    <h2>AI Assistant</h2>
    <p class="muted">Smart salary allocation, goals planner, emergency fund tracker.</p>
    <div>
      <label>Salary: <input id="salaryInput" value="50000"/></label>
      <button id="salaryBtn" class="btn">Get Allocation</button>
    </div>
    <pre id="assistOut">No result yet.</pre>
  `
  setTimeout(()=>{
    document.getElementById('salaryBtn').onclick = async ()=>{
      const salary = parseFloat(document.getElementById('salaryInput').value || 0)
      const body = {salary, profile:{monthly_savings:8000, income:50000}, expenses:[]}
      const res = await fetch('/assistant/salary_event', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)})
      const json = await res.json()
      document.getElementById('assistOut').textContent = JSON.stringify(json, null, 2)
    }
  },50)
  return el
}

function renderML(){
  const el = document.createElement('div')
  el.className='card'
  el.innerHTML = `
    <h2>ML Tools</h2>
    <p class="muted">Quick ML endpoints for diagnostics</p>
    <div><button id="metricsBtn" class="btn">Get ML Metrics</button></div>
    <pre id="mlOut">No data</pre>
  `
  setTimeout(()=>{
    document.getElementById('metricsBtn').onclick = async ()=>{
      const res = await fetch('/ml/model-metrics?user_id=0')
      const json = await res.json()
      document.getElementById('mlOut').textContent = JSON.stringify(json, null, 2)
    }
  },50)
  return el
}

// Basic router: map route names to render functions
const routes = {
  dashboard: renderDashboard,
  assistant: renderAssistant,
  ml: renderML,
}

function navigate(route){
  const main = $('#app')
  main.innerHTML = ''
  const view = routes[route]()
  main.appendChild(view)
}

// Setup nav buttons
document.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll('button[data-route]').forEach(b=>{
    b.onclick = ()=> navigate(b.getAttribute('data-route'))
  })
  // default route
  navigate('dashboard')
})
