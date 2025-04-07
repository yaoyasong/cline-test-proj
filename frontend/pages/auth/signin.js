import { signIn } from 'next-auth/react'

export default function SignIn() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Sign In</h1>
      <button 
        onClick={() => signIn('github', { callbackUrl: '/' })}
        style={{ padding: '0.5rem 1rem' }}
      >
        Sign in with GitHub
      </button>
    </div>
  )
}
