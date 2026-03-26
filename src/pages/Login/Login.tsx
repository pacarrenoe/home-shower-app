import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../app/firebase'
import { useNavigate } from 'react-router-dom'
import styles from './Login.module.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Completa todos los campos')
      return
    }

    try {
      setLoading(true)
      setError('')
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/admin')
    } catch (err) {
      setError('Credenciales incorrectas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Panel Admin</h2>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.inputGroup}>
          <input
            className={styles.input}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className={styles.inputGroup}>
          <input
            className={styles.input}
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            className={styles.toggle}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? 'Ocultar' : 'Ver'}
          </button>
        </div>

        <button
          className={styles.button}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </div>
    </div>
  )
}