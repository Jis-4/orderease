import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function Signup() {
  const router = useRouter()
  const [form, setForm] = useState({ name:'', email:'', shopName:'', slug:'', password:'' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    const val = e.target.value
    const key = e.target.name
    setForm(prev => ({
      ...prev,
      [key]: val,
      ...(key === 'shopName' ? { slug: val.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') } : {})
    }))
  }

  async function handleSignup(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); setLoading(false); return }
    const { data, error: authErr } = await supabase.auth.signUp({ email: form.email, password: form.password })
    if (authErr) { setError(authErr.message); setLoading(false); return }
    if (data.user) {
      const { error: sellerErr } = await supabase.from('sellers').insert({
        user_id: data.user.id,
        name: form.name,
        shop_name: form.shopName,
        shop_slug: form.slug,
        plan: 'free'
      })
      if (sellerErr) { setError(sellerErr.message); setLoading(false); return }
    }
    setSuccess(true)
    setLoading(false)
  }

  return (
    <>
      <Head><title>Sign up - OrderEase</title></Head>
      <style>{`
        .auth-page { min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:1.5rem; background:var(--bg-secondary); }
        .auth-logo { font-size:22px; font-weight:700; letter-spacing:-0.5px; margin-bottom:1.75rem; }
        .auth-logo span { color:var(--green); }
        .auth-card { background:var(--bg); border:1px solid var(--border); border-radius:var(--radius-lg); padding:2rem; width:100%; max-width:420px; }
        .auth-title { font-size:20px; font-weight:700; margin-bottom:4px; }
        .auth-sub { font-size:13px; color:var(--text-muted); margin-bottom:1.75rem; line-height:1.5; }
        .slug-row { display:flex; align-items:center; border:1px solid var(--border); border-radius:var(--radius); overflow:hidden; transition:border-color 0.15s; }
        .slug-row:focus-within { border-color:var(--green); box-shadow:0 0 0 3px var(--green-light); }
        .slug-pre { padding:10px 10px; background:var(--bg-secondary); font-size:12px; color:var(--text-muted); white-space:nowrap; border-right:1px solid var(--border); }
        .slug-row input { border:none; border-radius:0; box-shadow:none !important; }
        .switch-row { text-align:center; font-size:13px; color:var(--text-muted); margin-top:1.25rem; }
        .switch-row a { color:var(--green); font-weight:600; }
        .terms { font-size:12px; color:var(--text-muted); text-align:center; margin-top:1rem; line-height:1.6; }
        .terms a { color:var(--green); }
      `}</style>
      <div className="auth-page">
        <div className="auth-logo">Order<span>Ease</span></div>
        <div className="auth-card">
          {success ? (
            <div style={{textAlign:'center',padding:'1rem 0'}}>
              <div style={{width:52,height:52,background:'var(--green-light)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 1rem'}}>
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M5 12l4 4 10-10" stroke="#0F6E56" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div style={{fontSize:18,fontWeight:700,marginBottom:8}}>Shop created!</div>
              <div style={{fontSize:13,color:'var(--text-muted)',lineHeight:1.6,marginBottom:'1.5rem'}}>Check your email to confirm your account, then log in to start managing orders.</div>
              <Link href="/login" className="btn-primary" style={{display:'block',textAlign:'center'}}>Go to login</Link>
            </div>
          ) : (
            <>
              <div className="auth-title">Create your shop</div>
              <div className="auth-sub">Free to start. No card needed. Live in 3 minutes.</div>
              {error && <div className="error-box">{error}</div>}
              <form onSubmit={handleSignup}>
                <div className="field"><label>Your name</label><input name="name" placeholder="e.g. Riya Sharma" value={form.name} onChange={handleChange} required /></div>
                <div className="field"><label>Email address</label><input name="email" type="email" placeholder="you@email.com" value={form.email} onChange={handleChange} required /></div>
                <div className="field"><label>Shop name</label><input name="shopName" placeholder="e.g. Riya Boutique" value={form.shopName} onChange={handleChange} required /></div>
                <div className="field">
                  <label>Your shop URL</label>
                  <div className="slug-row">
                    <span className="slug-pre">/shop/</span>
                    <input name="slug" placeholder="yourshop" value={form.slug} onChange={handleChange} required />
                  </div>
                </div>
                <div className="field"><label>Password</label><input name="password" type="password" placeholder="Min. 8 characters" value={form.password} onChange={handleChange} required /></div>
                <button type="submit" className="btn-primary" style={{width:'100%'}} disabled={loading}>{loading ? 'Creating shop...' : 'Create my shop'}</button>
              </form>
              <div className="terms">By signing up you agree to our Terms and Privacy Policy</div>
              <div className="switch-row">Have an account? <Link href="/login">Log in</Link></div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
