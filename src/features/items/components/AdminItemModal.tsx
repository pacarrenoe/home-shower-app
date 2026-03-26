import { useEffect, useState } from 'react'
import styles from './AdminItemModal.module.css'
import type { Item, ItemOption } from '../types/item.types'
import { uploadImage } from '../services/upload.service'

type Props = {
  isOpen: boolean
  mode: 'create' | 'edit'
  item: Item | null
  onClose: () => void
  onSubmit: (data: {
    name: string
    image: string
    description: string
    status: 'wanted' | 'owned'
    options: ItemOption[]
  }) => Promise<void>
}

const buildEmptyOption = (id: string): ItemOption => ({
  id,
  store: '',
  price: 0,
  url: '',
})

export default function AdminItemModal({
  isOpen,
  mode,
  item,
  onClose,
  onSubmit,
}: Props) {
  const [name, setName] = useState('')
  const [image, setImage] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<'wanted' | 'owned'>('wanted')
  const [options, setOptions] = useState<ItemOption[]>([buildEmptyOption('1')])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    if (mode === 'edit' && item) {
      setName(item.name)
      setImage(item.image)
      setDescription(item.description)
      setStatus(item.status)
      setOptions(item.options.length ? item.options : [buildEmptyOption('1')])
      return
    }

    setName('')
    setImage('')
    setDescription('')
    setStatus('wanted')
    setOptions([buildEmptyOption('1')])
  }, [isOpen, mode, item])

  if (!isOpen) return null

  const updateOption = (
    index: number,
    field: keyof ItemOption,
    value: string | number,
  ) => {
    setOptions((prev) =>
      prev.map((option, currentIndex) =>
        currentIndex === index
          ? { ...option, [field]: value }
          : option,
      ),
    )
  }

  const addOption = () => {
    setOptions((prev) => [...prev, buildEmptyOption(String(prev.length + 1))])
  }

  const removeOption = (index: number) => {
    setOptions((prev) => {
      const next = prev.filter((_, currentIndex) => currentIndex !== index)

      if (next.length === 0) {
        return [buildEmptyOption('1')]
      }

      return next.map((option, currentIndex) => ({
        ...option,
        id: String(currentIndex + 1),
      }))
    })
  }

  const handleSubmit = async () => {
    const cleanOptions = options
      .map((option, index) => ({
        id: String(index + 1),
        store: option.store.trim(),
        price: Number(option.price) || 0,
        url: option.url.trim(),
      }))
      .filter((option) => option.store && option.url)

    if (!name.trim()) return

    setLoading(true)

    try {
      await onSubmit({
        name: name.trim(),
        image: image.trim(),
        description: description.trim(),
        status,
        options: status === 'owned' ? [] : cleanOptions,
      })

      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {mode === 'create' ? 'Nuevo artículo' : 'Editar artículo'}
          </h2>
        </div>

        <div className={styles.form}>
          <input
            className={styles.input}
            placeholder="Nombre"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <div className={styles.block}>
            <label className={styles.fileInput}>
              Subir imagen
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return

                  setLoading(true)

                  try {
                    const url = await uploadImage(file)
                    setImage(url)
                  } finally {
                    setLoading(false)
                  }
                }}
              />
            </label>

            {image && <img src={image} className={styles.preview} />}
          </div>

          <textarea
            className={styles.textarea}
            placeholder="Descripción"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />

          <select
            className={styles.input}
            value={status}
            onChange={(event) => setStatus(event.target.value as 'wanted' | 'owned')}
          >
            <option value="wanted">Lo queremos</option>
            <option value="owned">Ya lo tenemos</option>
          </select>

          {status === 'wanted' ? (
            <div className={styles.optionsBlock}>
              <div className={styles.optionsHeader}>
                <h3 className={styles.optionsTitle}>Opciones</h3>
                <button
                  type="button"
                  className={styles.addButton}
                  onClick={addOption}
                >
                  + Agregar opción
                </button>
              </div>

              {options.map((option, index) => (
                <div key={option.id} className={styles.optionCard}>
                  <input
                    className={styles.input}
                    placeholder="Tienda"
                    value={option.store}
                    onChange={(event) =>
                      updateOption(index, 'store', event.target.value)
                    }
                  />

                  <input
                    className={styles.input}
                    type="number"
                    placeholder="Precio"
                    value={option.price || ''}
                    onChange={(event) =>
                      updateOption(index, 'price', Number(event.target.value))
                    }
                  />

                  <input
                    className={styles.input}
                    placeholder="URL producto"
                    value={option.url}
                    onChange={(event) =>
                      updateOption(index, 'url', event.target.value)
                    }
                  />

                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => removeOption(index)}
                  >
                    Eliminar opción
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>

          <button
            type="button"
            className={styles.primaryButton}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}