import { useMemo, useState } from 'react'
import styles from './ReserveModal.module.css'
import type { Item } from '../../items/types/item.types'
import { useReserveItem } from '../hooks/useReserveItem'

type Props = {
  isOpen: boolean
  onClose: () => void
  item: Item | null
}

export default function ReserveModal({ isOpen, onClose, item }: Props) {
  const [selectedOption, setSelectedOption] = useState<string>('')
  const [name, setName] = useState('')

  const { handleReserve, loading, error, clearError } = useReserveItem()

  const formatCLP = (value: number) =>
    new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0,
    }).format(value)

  const sortedOptions = useMemo(() => {
    if (!item) return []
    return [...item.options].sort((a, b) => a.price - b.price)
  }, [item])

  const cheapest = sortedOptions[0]

  if (!isOpen || !item) return null

  const handleSubmit = async () => {
    const option = item.options.find(o => o.id === selectedOption)
    if (!option || !name.trim()) return

    const success = await handleReserve(item.id, name, option)

    if (success) {
      setSelectedOption('')
      setName('')
      clearError()
      onClose()
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>
          ¡Gracias por tu regalo! 🎁
        </h2>

        <p className={styles.subtitle}>
          Estás reservando:{' '}
          <b style={{ color: '#000' }}>{item.name}</b>. <br />
          Contamos con ello, así que si más adelante no puedes,
          avísanos, no hay problema.
        </p>

        {/* 🔥 Si ya está reservado */}
        {item.reserved && (
          <p style={{ color: '#10b981', fontWeight: 600, textAlign: 'center' }}>
            Este regalo ya fue reservado por {item.reservedBy}
          </p>
        )}

        {/* Opciones */}
        {!item.reserved && (
          <div className={styles.options}>
            {sortedOptions.map((opt) => {
              const isCheapest = opt.id === cheapest?.id
              const ahorro = opt.price - (cheapest?.price || 0)

              return (
                <label
                  key={opt.id}
                  className={`${styles.option} ${
                    selectedOption === opt.id ? styles.active : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="option"
                    value={opt.id}
                    checked={selectedOption === opt.id}
                    onChange={() => setSelectedOption(opt.id)}
                  />

                  <span className={styles.store}>{opt.store}</span>

                  <span className={styles.price}>
                    {formatCLP(opt.price)}
                  </span>

                  {isCheapest && (
                    <span className={styles.badge}>Más barato</span>
                  )}

                  {!isCheapest && (
                    <span className={styles.saving}>
                      +{formatCLP(ahorro)}
                    </span>
                  )}
                </label>
              )
            })}
          </div>
        )}

        {/* Input */}
        {!item.reserved && (
          <input
            className={styles.input}
            placeholder="Tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        {/* Error */}
        {error && (
          <p style={{ color: '#ef4444', fontSize: 12, textAlign: 'center' }}>
            {error}
          </p>
        )}

        {/* Actions */}
        <div className={styles.actions}>
          <button
            className={styles.cancel}
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>

          {!item.reserved && (
            <button
              className={styles.confirm}
              onClick={handleSubmit}
              disabled={!selectedOption || !name.trim() || loading}
            >
              {loading ? 'Reservando...' : 'Reservar'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}