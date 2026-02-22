import React, {useState} from 'react'

// Simple SPA: Dashboard + Assistant tabs. Fetches backend endpoints.
export default function App(){
  const [tab, setTab] = useState('dashboard')
  return (
    <div style={{fontFamily:'Arial, sans-serif', padding:20}}>
      <h1>ExpenseOracle Demo</h1>
      <nav style={{marginBottom:12}}>
        <button onClick={()=>setTab('dashboard')}>Dashboard</button>
        <button onClick={()=>setTab('assistant')} style={{marginLeft:8}}>Assistant</button>
      </nav>
      <div>
        {tab==='dashboard' ? <Dashboard /> : <Assistant />}
      </div>
    </div>
  )
}

function Dashboard(){
  const [chartUrl] = useState('/dashboard/forecast_chart?months=6')
  const [actions, setActions] = useState(null)

  async function runActions(){
    const res = await fetch('/dashboard/autonomous_actions')
    const j = await res.json()
    setActions(j)
  }

  return (
    <div>
      <h2>Visual Dashboard</h2>
      <div>
        <img src={chartUrl} alt="forecast" style={{maxWidth:800}} />
      </div>
      <div style={{marginTop:12}}>
        <button onClick={runActions}>Run Autonomous Demo</button>
        {actions && <pre style={{background:'#f6f8fa', padding:12}}>{JSON.stringify(actions, null, 2)}</pre>}
      </div>
    </div>
  )
}

function Assistant(){
  const [salary, setSalary] = useState(50000)
  const [result, setResult] = useState(null)

  async function submit(){
    const payload = {salary, profile:{monthly_savings:5000}, expenses:[]}
    const res = await fetch('/assistant/salary_event', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)})
    setResult(await res.json())
  }

  return (
    <div>
      <h2>Assistant</h2>
      <div>
        <label>Monthly Salary: </label>
        <input value={salary} onChange={e=>setSalary(Number(e.target.value))} />
        <button onClick={submit} style={{marginLeft:8}}>Suggest Allocation</button>
      </div>
      {result && <pre style={{background:'#f6f8fa', padding:12, marginTop:12}}>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  )
}
