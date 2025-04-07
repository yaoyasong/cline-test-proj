import { useRouter } from 'next/router'

export default function ErrorPage() {
  const router = useRouter()
  const { error } = router.query

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Authentication Error</h1>
      <p>{error || 'An error occurred during authentication'}</p>
      <button 
        onClick={() => router.push('/auth/signin')}
        style={{ padding: '0.5rem 1rem', marginTop: '1rem' }}
      >
        Back to Sign In
      </button>
    </div>
  )
}
