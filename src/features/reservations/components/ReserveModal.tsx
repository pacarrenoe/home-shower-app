import { useState } from 'react'
import styles from './ReserveModal.module.css'
import type { ItemOption } from '../../items/types/item.types'
import { createReservation } from '../services/reservation.service'

type Props = {
  isOpen: boolean
  onClose: () => void
  options: ItemOption[]
  itemName: string
}

export default function ReserveModal({
  isOpen,
  onClose,
  options,
  itemName,
}: Props) {
  const [name, setName] = useState('')
  const [selectedOption, setSelectedOption] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async () => {
    setLoading(true)

    await createReservation({
      name,
      itemName,
      optionId: selectedOption,
    })

    setLoading(false)
    onClose()
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>Regalar: {itemName}</h2>

        <input
          placeholder="Tu nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className={styles.options}>
          {options.map((opt) => (
            <label key={opt.id} className={styles.option}>
              <input
                type="radio"
                name="option"
                value={opt.id}
                onChange={() => setSelectedOption(opt.id)}
              />
              {opt.store} ${opt.price.toLocaleString('es-CL')}
            </label>
          ))}
        </div>

        <button
          disabled={!name || !selectedOption || loading}
          className={styles.confirm}
          onClick={handleSubmit}
        >
          {loading ? 'Guardando...' : 'Confirmar regalo'}
        </button>

        <button className={styles.cancel} onClick={onClose}>
          Cancelar
        </button>
      </div>
    </div>
  )
}