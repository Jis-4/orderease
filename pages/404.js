import Link from 'next/link'
export default function NotFound() {
  return (
    <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center',padding:'2rem'}}>
      <div style={{fontSize:48,fontWeight:700,color:'var(--green)',letterSpacing:-2,marginBottom:8}}>404</div>
      <div style={{fontSize:20,fontWeight:700,marginBottom:8}}>Page not found</div>
      <div style={{fontSize:14,color:'var(--text-muted)',marginBottom:'1.5rem'}}>The shop link or page you are looking for does not exist.</div>
      <Link href="/" className="btn-primary">Go home</Link>
    </div>
  )
}
