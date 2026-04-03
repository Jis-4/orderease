import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'

export default function Dashboard() {
  const router = useRouter()
  const [tab, setTab] = useState('orders')
  const [seller, setSeller] = useState(null)
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [newProduct, setNewProduct] = useState({ name:'', price:'', emoji:'', description:'' })
  const [addingProduct, setAddingProduct] = useState(false)
  const [showAddProduct, setShowAddProduct] = useState(false)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }
    const { data: sellerData } = await supabase.from('sellers').select('*').eq('user_id', user.id).single()
    if (!sellerData) { router.push('/signup'); return }
    setSeller(sellerData)
    const { data: ordersData } = await supabase.from('orders').select('*').eq('seller_id', sellerData.id).order('created_at', { ascending: false })
    const { data: productsData } = await supabase.from('products').select('*').eq('seller_id', sellerData.id)
    setOrders(ordersData || [])
    setProducts(productsData || [])
    setLoading(false)
  }

  async function updateOrderStatus(id, status) {
    await supabase.from('orders').update({ status }).eq('id', id)
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
  }

  async function addProduct(e) {
    e.preventDefault()
    setAddingProduct(true)
    const { data, error } = await supabase.from('products').insert({
      seller_id: seller.id,
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      emoji: newProduct.emoji || '',
      description: newProduct.description,
      is_active: true
    }).select().single()
    if (!error) {
      setProducts(prev => [...prev, data])
      setNewProduct({ name:'', price:'', emoji:'', description:'' })
      setShowAddProduct(false)
    }
    setAddingProduct(false)
  }

  async function toggleProduct(id, current) {
    await supabase.from('products').update({ is_active: !current }).eq('id', id)
    setProducts(prev => prev.map(p => p.id === id ? { ...p, is_active: !current } : p))
  }

  async function logout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter)
  const totalRevenue = orders.reduce((s, o) => s + (o.total_price || 0), 0)
  const pending = orders.filter(o => o.status === 'pending').length
  const delivered = orders.filter(o => o.status === 'delivered').length
  const now = new Date()
  const monthRevenue = orders.filter(o => {
    const d = new Date(o.created_at)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).reduce((s, o) => s + (o.total_price || 0), 0)
  const avgOrder = orders.length ? Math.round(totalRevenue / orders.length) : 0
  const topProduct = (() => {
    const m = {}
    orders.forEach(o => { m[o.product_name] = (m[o.product_name] || 0) + (o.total_price || 0) })
    const e = Object.entries(m).sort((a, b) => b[1] - a[1])[0]
    return e ? e[0] : 'None yet'
  })()

  if (loading) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',fontSize:14,color:'#666'}}>
      Loading your dashboard...
    </div>
  )

  return (
    <>
      <Head><title>Dashboard - OrderEase</title></Head>
      <style>{`
        .dash { max-width:900px; margin:0 auto; }
        .topbar { display:flex; align-items:center; justify-content:space-between; padding:0.875rem 1.5rem; border-bottom:1px solid var(--border); }
        .logo { font-size:16px; font-weight:700; letter-spacing:-0.3px; }
        .logo span { color:var(--green); }
        .shop-pill { background:var(--bg-secondary); border:1px solid var(--border); border-radius:20px; padding:3px 12px; font-size:12px; color:var(--text-muted); margin-left:10px; }
        .topbar-right { display:flex; align-items:center; gap:10px; }
        .av { width:32px; height:32px; border-radius:50%; background:var(--green-light); color:var(--green-dark); font-size:12px; font-weight:700; display:flex; align-items:center; justify-content:center; }
        .tabs { display:flex; border-bottom:1px solid var(--border); padding:0 1.5rem; }
        .tab { padding:0.75rem 1rem; font-size:13px; color:var(--text-muted); cursor:pointer; border-bottom:2px solid transparent; margin-bottom:-1px; }
        .tab.active { color:var(--green); border-bottom-color:var(--green); font-weight:600; }
        .content { padding:1.5rem; }
        .metrics { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin-bottom:1.5rem; }
        .metric { background:var(--bg-secondary); border-radius:var(--radius); padding:1rem; }
        .metric-label { font-size:11px; color:var(--text-muted); font-weight:600; text-transform:uppercase; letter-spacing:0.4px; margin-bottom:6px; }
        .metric-val { font-size:22px; font-weight:700; letter-spacing:-0.5px; }
        .metric-sub { font-size:11px; color:var(--green); margin-top:3px; }
        .sec-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:0.875rem; }
        .sec-title { font-size:15px; font-weight:700; }
        .filters { display:flex; gap:6px; }
        .fbtn { padding:4px 12px; border:1px solid var(--border); border-radius:20px; font-size:12px; color:var(--text-muted); background:var(--bg); cursor:pointer; }
        .fbtn.active { background:var(--green-light); color:var(--green-dark); border-color:var(--green); font-weight:600; }
        .tbl { width:100%; border-collapse:collapse; font-size:13px; }
        .tbl th { text-align:left; padding:8px 10px; border-bottom:1px solid var(--border); font-size:11px; color:var(--text-muted); font-weight:600; text-transform:uppercase; letter-spacing:0.4px; }
        .tbl td { padding:11px 10px; border-bottom:1px solid var(--border); vertical-align:middle; }
        .tbl tr:last-child td { border:none; }
        .tbl tr:hover td { background:var(--bg-secondary); }
        .abtn { padding:4px 10px; border:1px solid var(--border); border-radius:var(--radius); font-size:11px; background:var(--bg); color:var(--text-muted); cursor:pointer; margin-right:4px; }
        .abtn:hover { background:var(--bg-secondary); }
        .add-form { background:var(--bg-secondary); border-radius:var(--radius-lg); padding:1.25rem; margin-bottom:1rem; border:1px dashed var(--border); }
        .product-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:12px; }
        .product-card { border:1px solid var(--border); border-radius:var(--radius-lg); padding:1.25rem; background:var(--bg); }
        .empty { text-align:center; padding:3rem; color:var(--text-muted); font-size:14px; }
      `}</style>

      <div className="dash">
        <div className="topbar">
          <div style={{display:'flex',alignItems:'center'}}>
            <div className="logo">Order<span>Ease</span></div>
            {seller && <span className="shop-pill">/shop/{seller.shop_slug}</span>}
          </div>
          <div className="topbar-right">
            {seller && <Link href={`/shop/${seller.shop_slug}`} target="_blank" className="btn-primary" style={{padding:'7px 16px',fontSize:'13px'}}>View shop</Link>}
            <button className="btn-outline" style={{padding:'7px 16px',fontSize:'13px'}} onClick={logout}>Log out</button>
            {seller && <div className="av">{seller.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()}</div>}
          </div>
        </div>

        <div className="tabs">
          {['orders','products','analytics'].map(t => (
            <div key={t} className={`tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </div>
          ))}
        </div>

        <div className="content">
          {tab === 'orders' && (
            <>
              <div className="metrics">
                <div className="metric"><div className="metric-label">Total orders</div><div className="metric-val">{orders.length}</div></div>
                <div className="metric"><div className="metric-label">Revenue</div><div className="metric-val">Rs.{Math.round(totalRevenue).toLocaleString('en-IN')}</div></div>
                <div className="metric"><div className="metric-label">Pending</div><div className="metric-val">{pending}</div>{pending > 0 && <div className="metric-sub">Action needed</div>}</div>
                <div className="metric"><div className="metric-label">Delivered</div><div className="metric-val">{delivered}</div></div>
              </div>
              <div className="sec-header">
                <div className="sec-title">Orders</div>
                <div className="filters">
                  {['all','pending','shipped','delivered'].map(f => (
                    <button key={f} className={`fbtn${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              {filteredOrders.length === 0 ? (
                <div className="empty">No orders yet. Share your shop link to get started!</div>
              ) : (
                <table className="tbl">
                  <thead>
                    <tr><th>ID</th><th>Customer</th><th>Product</th><th>Amount</th><th>Status</th><th>Date</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(o => (
                      <tr key={o.id}>
                        <td style={{fontFamily:'monospace',fontSize:11}}>#{o.id.slice(0,8).toUpperCase()}</td>
                        <td><div style={{fontWeight:600}}>{o.customer_name}</div><div style={{fontSize:12,color:'var(--text-muted)'}}>{o.customer_phone}</div></td>
                        <td>{o.product_name} x {o.quantity}</td>
                        <td style={{fontWeight:700}}>Rs.{(o.total_price||0).toLocaleString('en-IN')}</td>
                        <td><span className={`pill pill-${o.status}`}>{o.status}</span></td>
                        <td style={{fontSize:12,color:'var(--text-muted)'}}>{new Date(o.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</td>
                        <td>
                          {o.status === 'pending' && <button className="abtn" onClick={() => updateOrderStatus(o.id,'shipped')}>Ship</button>}
                          {o.status === 'shipped' && <button className="abtn" onClick={() => updateOrderStatus(o.id,'delivered')}>Done</button>}
                          {o.status !== 'cancelled' && <button className="abtn" style={{color:'#791F1F'}} onClick={() => updateOrderStatus(o.id,'cancelled')}>Cancel</button>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}

          {tab === 'products' && (
            <>
              <div className="sec-header">
                <div className="sec-title">Products ({products.length})</div>
                <button className="btn-primary" style={{padding:'8px 16px',fontSize:'13px'}} onClick={() => setShowAddProduct(!showAddProduct)}>+ Add product</button>
              </div>
              {showAddProduct && (
                <form className="add-form" onSubmit={addProduct}>
                  <div style={{fontSize:14,fontWeight:700,marginBottom:12}}>New product</div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                    <div className="field"><label>Name</label><input placeholder="e.g. Pearl Earrings" value={newProduct.name} onChange={e=>setNewProduct(p=>({...p,name:e.target.value}))} required /></div>
                    <div className="field"><label>Price</label><input type="number" placeholder="349" value={newProduct.price} onChange={e=>setNewProduct(p=>({...p,price:e.target.value}))} required /></div>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'80px 1fr',gap:10}}>
                    <div className="field"><label>Emoji</label><input placeholder="optional" value={newProduct.emoji} onChange={e=>setNewProduct(p=>({...p,emoji:e.target.value}))} /></div>
                    <div className="field"><label>Description</label><input placeholder="Short description" value={newProduct.description} onChange={e=>setNewProduct(p=>({...p,description:e.target.value}))} /></div>
                  </div>
                  <div style={{display:'flex',gap:8}}>
                    <button type="submit" className="btn-primary" style={{padding:'8px 20px',fontSize:'13px'}} disabled={addingProduct}>{addingProduct ? 'Adding...' : 'Add product'}</button>
                    <button type="button" className="btn-outline" style={{padding:'8px 16px',fontSize:'13px'}} onClick={() => setShowAddProduct(false)}>Cancel</button>
                  </div>
                </form>
              )}
              {products.length === 0 ? (
                <div className="empty">No products yet. Add your first product above.</div>
              ) : (
                <div className="product-grid">
                  {products.map(p => (
                    <div key={p.id} className="product-card">
                      <div style={{fontSize:28,marginBottom:8}}>{p.emoji || ''}</div>
                      <div style={{fontWeight:700,fontSize:15,marginBottom:4}}>{p.name}</div>
                      <div style={{fontSize:20,fontWeight:700,color:'var(--green)',marginBottom:4}}>Rs.{p.price}</div>
                      {p.description && <div style={{fontSize:12,color:'var(--text-muted)',marginBottom:12}}>{p.description}</div>}
                      <div style={{display:'flex',gap:8,alignItems:'center'}}>
                        <span className={`pill ${p.is_active ? 'pill-delivered' : 'pill-cancelled'}`}>{p.is_active ? 'Active' : 'Hidden'}</span>
                        <button className="abtn" onClick={() => toggleProduct(p.id, p.is_active)}>{p.is_active ? 'Hide' : 'Show'}</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {tab === 'analytics' && (
            <>
              <div className="metrics" style={{gridTemplateColumns:'repeat(4,1fr)'}}>
                <div className="metric"><div className="metric-label">This month</div><div className="metric-val">Rs.{Math.round(monthRevenue).toLocaleString('en-IN')}</div></div>
                <div className="metric"><div className="metric-label">Avg order</div><div className="metric-val">Rs.{avgOrder.toLocaleString('en-IN')}</div></div>
                <div className="metric"><div className="metric-label">Total orders</div><div className="metric-val">{orders.length}</div></div>
                <div className="metric"><div className="metric-label">Top product</div><div className="metric-val" style={{fontSize:13}}>{topProduct}</div></div>
              </div>
              <div style={{background:'var(--bg-secondary)',borderRadius:'var(--radius-lg)',padding:'1.5rem',marginTop:'0.5rem'}}>
                <div style={{fontSize:14,fontWeight:700,marginBottom:'1rem'}}>Revenue by product</div>
                {(() => {
                  const m = {}
                  orders.forEach(o => { m[o.product_name] = (m[o.product_name]||0)+(o.total_price||0) })
                  const sorted = Object.entries(m).sort((a,b) => b[1]-a[1])
                  const max = sorted[0] ? sorted[0][1] : 1
                  return sorted.length === 0
                    ? <div style={{color:'var(--text-muted)',fontSize:13}}>No orders yet.</div>
                    : sorted.map(([name, rev]) => (
                      <div key={name} style={{marginBottom:12}}>
                        <div style={{display:'flex',justifyContent:'space-between',fontSize:13,marginBottom:4}}>
                          <span style={{fontWeight:600}}>{name}</span>
                          <span style={{color:'var(--text-muted)'}}>Rs.{Math.round(rev).toLocaleString('en-IN')}</span>
                        </div>
                        <div style={{background:'var(--border)',borderRadius:4,height:8}}>
                          <div style={{background:'var(--green)',height:8,borderRadius:4,width:Math.round(rev/max*100)+'%'}}></div>
                        </div>
                      </div>
                    ))
                })()}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
