import { useState } from 'react'
import Head from 'next/head'
import { supabase } from '../../lib/supabaseClient'

export async function getServerSideProps({ params }) {
  const { slug } = params
  const { data: seller } = await supabase.from('sellers').select('*').eq('shop_slug', slug).single()
  if (!seller) return { notFound: true }
  const { data: products } = await supabase.from('products').select('*').eq('seller_id', seller.id).eq('is_active', true)
  return { props: { seller, products: products || [] } }
}

export default function ShopPage({ seller, products }) {
  const [selectedProduct, setSelectedProduct] = useState(products[0] || null)
  const [qty, setQty] = useState(1)
  const [form, setForm] = useState({ name:'', phone:'', address:'', notes:'' })
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState(null)
  const [error, setError] = useState('')

  const total = selectedProduct ? selectedProduct.price * qty : 0
  const initials = seller.shop_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  async function handleSubmit(e) {
    e.preventDefault()
    if (!selectedProduct) return
    setLoading(true)
    setError('')
    const { data, error: err } = await supabase.from('orders').insert({
      seller_id: seller.id,
      customer_name: form.name,
      customer_phone: form.phone,
      customer_address: form.address,
      product_name: selectedProduct.name,
      product_id: selectedProduct.id,
      quantity: qty,
      total_price: total,
      notes: form.notes,
      status: 'pending'
    }).select().single()
    if (err) { setError(err.message); setLoading(false); return }
    setOrderId(data.id)
    setLoading(false)
  }

  return (
    <>
      <Head><title>{seller.shop_name} - Place an order</title></Head>
      <style>{`
        .shop-page { max-width:480px; margin:0 auto; padding:1.5rem; }
        .shop-header { text-align:center; padding:1.5rem 0 1rem; }
        .shop-av { width:64px; height:64px; border-radius:50%; background:var(--green-light); color:var(--green-dark); font-size:22px; font-weight:700; display:flex; align-items:center; justify-content:center; margin:0 auto 0.875rem; }
        .shop-name { font-size:20px; font-weight:700; }
        .shop-desc { font-size:13px; color:var(--text-muted); margin-top:4px; }
        .badge-live { display:inline-flex; align-items:center; gap:6px; background:var(--green-light); color:var(--green-dark); font-size:11px; font-weight:600; padding:4px 12px; border-radius:20px; margin-top:8px; }
        .dot { width:7px; height:7px; border-radius:50%; background:var(--green); }
        .card-title { font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px; margin-bottom:0.875rem; }
        .pitem { display:flex; align-items:center; justify-content:space-between; padding:10px 12px; border:1.5px solid var(--border); border-radius:var(--radius); cursor:pointer; margin-bottom:8px; transition:all 0.15s; }
        .pitem:last-child { margin-bottom:0; }
        .pitem.sel { border-color:var(--green); background:var(--green-light); }
        .pitem-left { display:flex; align-items:center; gap:10px; }
        .picon { width:38px; height:38px; background:var(--bg-secondary); border-radius:var(--radius); display:flex; align-items:center; justify-content:center; font-size:18px; }
        .pname { font-size:14px; font-weight:600; }
        .pprice { font-size:12px; color:var(--text-muted); margin-top:2px; }
        .pcheck { width:20px; height:20px; border-radius:50%; border:1.5px solid var(--border); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .pitem.sel .pcheck { background:var(--green); border-color:var(--green); }
        .qty-row { display:flex; align-items:center; justify-content:space-between; margin-top:1rem; padding-top:1rem; border-top:1px solid var(--border); }
        .qty-label { font-size:14px; color:var(--text-muted); }
        .qty-ctrl { display:flex; align-items:center; gap:12px; }
        .qbtn { width:30px; height:30px; border:1px solid var(--border); border-radius:var(--radius); background:var(--bg); font-size:18px; display:flex; align-items:center; justify-content:center; line-height:1; padding:0; }
        .qval { font-size:16px; font-weight:600; min-width:24px; text-align:center; }
        .summary { background:var(--bg-secondary); border-radius:var(--radius); padding:1rem; margin-bottom:1rem; }
        .srow { display:flex; justify-content:space-between; font-size:13px; color:var(--text-muted); margin-bottom:6px; }
        .srow.total { font-size:15px; font-weight:700; color:var(--text); border-top:1px solid var(--border); padding-top:8px; margin-top:4px; margin-bottom:0; }
        .success { text-align:center; padding:3rem 1rem; }
        .success-icon { width:60px; height:60px; background:var(--green-light); border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 1rem; }
        .oid { display:inline-block; background:var(--bg-secondary); padding:6px 16px; border-radius:var(--radius); font-size:13px; color:var(--text-muted); margin-top:0.75rem; font-family:monospace; }
      `}</style>

      <div className="shop-page">
        {orderId ? (
          <div className="success">
            <div className="success-icon">
              <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><path d="M5 14l5 5 13-13" stroke="#0F6E56" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h2 style={{fontSize:22,fontWeight:700,marginBottom:8}}>Order placed!</h2>
            <p style={{fontSize:14,color:'var(--text-muted)',lineHeight:1.6}}>{seller.shop_name} will confirm your order shortly. Keep your phone handy.</p>
            <div className="oid">#{orderId.slice(0, 8).toUpperCase()}</div>
            {seller.phone && <p style={{fontSize:13,color:'var(--text-muted)',marginTop:'1.5rem'}}>Need help? WhatsApp at {seller.phone}</p>}
          </div>
        ) : (
          <>
            <div className="shop-header">
              <div className="shop-av">{initials}</div>
              <div className="shop-name">{seller.shop_name}</div>
              {seller.description && <div className="shop-desc">{seller.description}</div>}
              <div className="badge-live"><span className="dot"></span> Accepting orders</div>
            </div>

            {error && <div className="error-box">{error}</div>}

            <form onSubmit={handleSubmit}>
              {products.length > 0 && (
                <div className="card" style={{marginBottom:'1rem'}}>
                  <div className="card-title">Select a product</div>
                  {products.map(p => (
                    <div key={p.id} className={`pitem${selectedProduct && selectedProduct.id === p.id ? ' sel' : ''}`} onClick={() => setSelectedProduct(p)}>
                      <div className="pitem-left">
                        <div className="picon">{p.emoji || '!'}</div>
                        <div>
                          <div className="pname">{p.name}</div>
                          <div className="pprice">Rs.{p.price}</div>
                        </div>
                      </div>
                      <div className="pcheck">
                        {selectedProduct && selectedProduct.id === p.id && <svg width="10" height="10" fill="none" viewBox="0 0 10 10"><path d="M2 5l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                    </div>
                  ))}
                  <div className="qty-row">
                    <span className="qty-label">Quantity</span>
                    <div className="qty-ctrl">
                      <button type="button" className="qbtn" onClick={() => setQty(q => Math.max(1, q - 1))}>-</button>
                      <span className="qval">{qty}</span>
                      <button type="button" className="qbtn" onClick={() => setQty(q => Math.min(10, q + 1))}>+</button>
                    </div>
                  </div>
                </div>
              )}

              <div className="card" style={{marginBottom:'1rem'}}>
                <div className="card-title">Your details</div>
                <div className="field"><label>Full name</label><input placeholder="e.g. Priya Sharma" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required /></div>
                <div className="field"><label>WhatsApp number</label><input type="tel" placeholder="9876543210" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} required /></div>
                <div className="field"><label>Delivery address</label><textarea placeholder="House no, street, city, pincode" rows={3} value={form.address} onChange={e => setForm(f => ({...f, address: e.target.value}))} required /></div>
                <div className="field" style={{marginBottom:0}}><label>Notes (optional)</label><input placeholder="e.g. gift wrap please" value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} /></div>
              </div>

              <div className="summary">
                <div className="srow"><span>{selectedProduct ? selectedProduct.name + ' x ' + qty : 'No product selected'}</span><span>{selectedProduct ? 'Rs.' + total.toLocaleString('en-IN') : '-'}</span></div>
                <div className="srow"><span>Delivery</span><span style={{color:'var(--green)',fontWeight:600}}>Free</span></div>
                <div className="srow total"><span>Total</span><span>Rs.{total.toLocaleString('en-IN')}</span></div>
              </div>

              <button type="submit" className="btn-primary" style={{width:'100%',padding:'13px',fontSize:'15px'}} disabled={loading || !selectedProduct}>
                {loading ? 'Placing order...' : 'Place order'}
              </button>
            </form>
          </>
        )}
      </div>
    </>
  )
}
