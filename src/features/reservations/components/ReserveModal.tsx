import { useEffect, useMemo, useState } from 'react'
import styles from './ReserveModal.module.css'
import type { ItemOption } from '../../items/types/item.types'
import { useReserveItem } from '../hooks/useReserveItem'

type Props = {
  isOpen: boolean
  onClose: () => void
  itemId: string
  itemName: string
  options: ItemOption[]
}

export default function ReserveModal({
  isOpen,
  onClose,
  itemId,
  itemName,
  options,
}: Props) {
  const [name, setName] = useState('')
  const [selectedOptionId, setSelectedOptionId] = useState('')

  const { handleReserve, loading, error, clearError } = useReserveItem()

  const selectedOption = useMemo(
    () => options.find((option) => option.id === selectedOptionId) ?? null,
    [options, selectedOptionId],
  )

  useEffect(() => {
    if (!isOpen) {
      setName('')
      setSelectedOptionId('')
      clearError()
    }
  }, [isOpen, clearError])

  if (!isOpen) return null

  const submitReservation = async () => {
    if (!name.trim() || !selectedOption) return

    const ok = await handleReserve(itemId, name.trim(), selectedOption)

    if (!ok) return

    onClose()
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="reserve-title">
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 id="reserve-title" className={styles.title}>
            Yo te lo regalaré
          </h2>
          <p className={styles.subtitle}>{itemName}</p>
        </div>

        <div className={styles.field}>
          <label htmlFor="guest-name" className={styles.label}>
            Tu nombre
          </label>
          <input
            id="guest-name"
            className={styles.input}
            type="text"
            placeholder="Escribe tu nombre"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Elige una opción</span>

          <div className={styles.options}>
            {options.map((option) => {
              const active = selectedOptionId === option.id

              return (
                <label
                  key={option.id}
                  className={`${styles.option} ${active ? styles.optionActive : ''}`}
                >
                  <input
                    className={styles.radio}
                    type="radio"
                    name="gift-option"
                    value={option.id}
                    checked={active}
                    onChange={() => setSelectedOptionId(option.id)}
                  />

                  <span className={styles.optionText}>
                    <span className={styles.optionStore}>{option.store}</span>
                    <span className={styles.optionPrice}>
                      ${option.price.toLocaleString('es-CL')}
                    </span>
                  </span>
                </label>
              )
            })}
          </div>
        </div>

        {error ? <p className={styles.error}>{error}</p> : null}

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancel}
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>

          <button
            type="button"
            className={styles.confirm}
            onClick={submitReservation}
            disabled={loading || !name.trim() || !selectedOption}
          >
            {loading ? 'Guardando...' : 'Confirmar regalo'}
          </button>
        </div>
      </div>
    </div>
  )
}