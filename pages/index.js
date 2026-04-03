import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Head>
        <title>OrderEase — Order management for Indian sellers</title>
        <meta name="description" content="Stop managing orders through messy DMs. OrderEase gives Instagram and WhatsApp sellers a clean order page and dashboard." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        .nav { display:flex; align-items:center; justify-content:space-between; padding:1rem 2rem; border-bottom:1px solid var(--border); max-width:1100px; margin:0 auto; }
        .logo { font-size:20px; font-weight:700; letter-spacing:-0.5px; }
        .logo span { color:var(--green); }
        .nav-links { display:flex; gap:12px; align-items:center; }
        .hero { text-align:center; padding:5rem 1.5rem 3rem; max-width:680px; margin:0 auto; }
        .badge { display:inline-block; background:var(--green-light); color:var(--green-dark); font-size:12px; font-weight:600; padding:5px 14px; border-radius:20px; margin-bottom:1.5rem; }
        .hero h1 { font-size:42px; font-weight:700; line-height:1.15; letter-spacing:-1.5px; margin-bottom:1.25rem; }
        .hero h1 em { color:var(--green); font-style:normal; }
        .hero p { font-size:17px; color:var(--text-muted); line-height:1.7; margin-bottom:2rem; }
        .hero-btns { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }
        .stats { display:grid; grid-template-columns:repeat(3,1fr); max-width:520px; margin:3rem auto; border:1px solid var(--border); border-radius:var(--radius-lg); overflow:hidden; }
        .stat { padding:1.5rem; text-align:center; border-right:1px solid var(--border); }
        .stat:last-child { border-right:none; }
        .stat-n { font-size:28px; font-weight:700; color:var(--green); letter-spacing:-1px; }
        .stat-l { font-size:12px; color:var(--text-muted); margin-top:4px; }
        .section { padding:4rem 1.5rem; max-width:900px; margin:0 auto; }
        .section-tag { font-size:12px; font-weight:700; color:var(--green); text-transform:uppercase; letter-spacing:1px; margin-bottom:8px; }
        .section h2 { font-size:30px; font-weight:700; letter-spacing:-0.75px; margin-bottom:0.75rem; }
        .section > p { font-size:16px; color:var(--text-muted); margin-bottom:2.5rem; max-width:520px; }
        .features { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:16px; }
        .feat { background:var(--bg-secondary); border-radius:var(--radius-lg); padding:1.5rem; }
        .feat-icon { width:40px; height:40px; background:var(--green-light); border-radius:var(--radius); display:flex; align-items:center; justify-content:center; margin-bottom:1rem; }
        .feat h3 { font-size:15px; font-weight:600; margin-bottom:8px; }
        .feat p { font-size:13px; color:var(--text-muted); line-height:1.6; }
        .steps { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:16px; }
        .step { text-align:center; padding:1rem; }
        .step-n { width:40px; height:40px; background:var(--green); color:#fff; font-weight:700; font-size:16px; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 1rem; }
        .step h3 { font-size:15px; font-weight:600; margin-bottom:6px; }
        .step p { font-size:13px; color:var(--text-muted); line-height:1.6; }
        .pricing { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:20px; }
        .plan { border:1px solid var(--border); border-radius:var(--radius-lg); padding:1.75rem; }
        .plan.featured { border:2px solid var(--green); }
        .plan-tag { display:inline-block; background:var(--green-light); color:var(--green-dark); font-size:11px; font-weight:700; padding:3px 10px; border-radius:20px; margin-bottom:12px; }
        .plan h3 { font-size:18px; font-weight:700; margin-bottom:4px; }
        .plan .price { font-size:32px; font-weight:700; letter-spacing:-1px; margin:12px 0 4px; }
        .plan .price span { font-size:14px; font-weight:400; color:var(--text-muted); }
        .plan .desc { font-size:13px; color:var(--text-muted); margin-bottom:1.25rem; }
        .plan ul { list-style:none; margin-bottom:1.5rem; display:flex; flex-direction:column; gap:8px; }
        .plan ul li { font-size:13px; color:var(--text-muted); display:flex; align-items:center; gap:8px; }
        .plan ul li::before { content:'checkmark'; color:var(--green); font-weight:700; font-size:12px; }
        .cta-section { text-align:center; padding:4rem 1.5rem; background:var(--bg-secondary); margin-top:2rem; }
        .cta-section h2 { font-size:28px; font-weight:700; letter-spacing:-0.75px; margin-bottom:0.75rem; }
        .cta-section p { font-size:16px; color:var(--text-muted); margin-bottom:1.75rem; }
        .footer { text-align:center; padding:1.5rem; border-top:1px solid var(--border); font-size:13px; color:var(--text-muted); }
      `}</style>

      <nav>
        <div className="nav">
          <div className="logo">Order<span>Ease</span></div>
          <div className="nav-links">
            <Link href="/login" className="btn-outline" style={{padding:'8px 18px',fontSize:'13px'}}>Log in</Link>
            <Link href="/signup" className="btn-primary" style={{padding:'8px 18px',fontSize:'13px'}}>Get started free</Link>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="badge">Built for Indian sellers</div>
        <h1>Stop managing orders<br />through <em>messy DMs</em></h1>
        <p>OrderEase gives Instagram and WhatsApp sellers a clean order page, automatic tracking, and a dashboard so you can focus on selling, not sorting chats.</p>
        <div className="hero-btns">
          <Link href="/signup" className="btn-primary" style={{padding:'13px 32px',fontSize:'16px'}}>Start free — no card needed</Link>
          <Link href="/shop/riyasboutique" className="btn-outline" style={{padding:'13px 32px',fontSize:'16px'}}>See a live demo</Link>
        </div>
      </section>

      <div className="stats">
        <div className="stat"><div className="stat-n">40+</div><div className="stat-l">sellers onboarded</div></div>
        <div className="stat"><div className="stat-n">0</div><div className="stat-l">setup cost</div></div>
        <div className="stat"><div className="stat-n">3 min</div><div className="stat-l">to go live</div></div>
      </div>

      <section className="section">
        <div className="section-tag">Features</div>
        <h2>Everything a small seller needs</h2>
        <p>No complicated setup. No team needed. Just a link you share with your customers.</p>
        <div className="features">
          <div className="feat">
            <div className="feat-icon">
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect x="3" y="3" width="14" height="14" rx="2" stroke="#0F6E56" strokeWidth="1.5"/><path d="M6 10h8M6 7h8M6 13h5" stroke="#0F6E56" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <h3>Your own order page</h3>
            <p>Share a clean link with your customers. They fill a form, you get the order instantly.</p>
          </div>
          <div className="feat">
            <div className="feat-icon">
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect x="3" y="5" width="14" height="12" rx="2" stroke="#0F6E56" strokeWidth="1.5"/><path d="M7 5V4a3 3 0 016 0v1" stroke="#0F6E56" strokeWidth="1.5"/><path d="M7 10l2 2 4-4" stroke="#0F6E56" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h3>Order dashboard</h3>
            <p>See all orders in one place. Mark them pending, shipped, or delivered.</p>
          </div>
          <div className="feat">
            <div className="feat-icon">
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M3 14V8l7-5 7 5v6" stroke="#0F6E56" strokeWidth="1.5" strokeLinejoin="round"/><rect x="7" y="10" width="6" height="6" rx="1" stroke="#0F6E56" strokeWidth="1.5"/></svg>
            </div>
            <h3>Revenue analytics</h3>
            <p>Monthly earnings, top products, order counts all updated live.</p>
          </div>
          <div className="feat">
            <div className="feat-icon">
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="7" stroke="#0F6E56" strokeWidth="1.5"/><path d="M10 6v4l3 3" stroke="#0F6E56" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <h3>Zero maintenance</h3>
            <p>Hosted for free. No servers to manage. Works 24/7 even when you are offline.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-tag">How it works</div>
        <h2>Live in 3 minutes</h2>
        <p>Less time than replying to 10 DMs.</p>
        <div className="steps">
          <div className="step"><div className="step-n">1</div><h3>Sign up</h3><p>Create your seller account and set your shop name.</p></div>
          <div className="step"><div className="step-n">2</div><h3>Add products</h3><p>List the items you sell with prices and descriptions.</p></div>
          <div className="step"><div className="step-n">3</div><h3>Share your link</h3><p>Post your order link on Instagram bio or WhatsApp status.</p></div>
          <div className="step"><div className="step-n">4</div><h3>Get orders</h3><p>Customers place orders. You manage from your dashboard.</p></div>
        </div>
      </section>

      <section className="section">
        <div className="section-tag">Pricing</div>
        <h2>Simple, honest pricing</h2>
        <p>Start free. Upgrade only when your business grows.</p>
        <div className="pricing">
          <div className="plan">
            <h3>Free</h3>
            <div className="price">0 <span>/ month</span></div>
            <div className="desc">Perfect to get started.</div>
            <ul><li>1 shop page</li><li>Up to 30 orders/month</li><li>Basic dashboard</li><li>OrderEase branding</li></ul>
            <Link href="/signup" className="btn-outline" style={{display:'block',textAlign:'center'}}>Get started free</Link>
          </div>
          <div className="plan featured">
            <div className="plan-tag">Most popular</div>
            <h3>Basic</h3>
            <div className="price">299 <span>/ month</span></div>
            <div className="desc">For sellers getting consistent orders.</div>
            <ul><li>1 shop page</li><li>Unlimited orders</li><li>Full analytics</li><li>Remove branding</li><li>WhatsApp notifications</li></ul>
            <Link href="/signup" className="btn-primary" style={{display:'block',textAlign:'center'}}>Start Basic plan</Link>
          </div>
          <div className="plan">
            <h3>Pro</h3>
            <div className="price">599 <span>/ month</span></div>
            <div className="desc">For power sellers and small businesses.</div>
            <ul><li>3 shop pages</li><li>Unlimited orders</li><li>Advanced analytics</li><li>Custom domain</li><li>Priority support</li></ul>
            <Link href="/signup" className="btn-outline" style={{display:'block',textAlign:'center'}}>Start Pro plan</Link>
          </div>
        </div>
      </section>

      <div className="cta-section">
        <h2>Ready to clean up your order chaos?</h2>
        <p>Join sellers across India who ditched DM-based order management.</p>
        <Link href="/signup" className="btn-primary" style={{padding:'14px 36px',fontSize:'16px'}}>Get started free</Link>
      </div>

      <footer className="footer">
        OrderEase - Made for Indian sellers - Free to start
      </footer>
    </>
  )
}
