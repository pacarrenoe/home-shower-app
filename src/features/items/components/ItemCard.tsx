import { useState } from 'react'
import type { Item } from '../types/item.types'
import styles from './ItemCard.module.css'
import ReserveModal from '../../reservations/components/ReserveModal'

export default function ItemCard({ item }: { item: Item }) {
  const [open, setOpen] = useState(false)

  const isOwned = item.status === 'owned'

  return (
    <>
      <article className={`${styles.card} ${isOwned ? styles.owned : ''}`}>
        <img
          className={`${styles.image} ${isOwned ? styles.imageOwned : ''}`}
          src={item.image}
          alt={item.name}
        />

        <div className={styles.content}>
          <div className={styles.info}>
            <h2 className={styles.title}>{item.name}</h2>

            {item.description && (
              <p className={styles.description}>{item.description}</p>
            )}

            {!isOwned && (
              <div className={styles.options}>
                {(item.options || []).map((opt, i) => (
                  <div key={i} className={styles.option}>
                    {opt.store} ${opt.price.toLocaleString('es-CL')}
                  </div>
                ))}
              </div>
            )}

            {isOwned && (
              <p className={styles.ownedText}>¡Ya lo tenemos!</p>
            )}
          </div>

          {!isOwned && (
            <button
              className={styles.actionButton}
              onClick={() => setOpen(true)}
            >
              ¡Yo te lo regalaré!
            </button>
          )}
        </div>
      </article>

      <ReserveModal
        isOpen={open}
        onClose={() => setOpen(false)}
        options={item.options || []}
        itemName={item.name}
      />
    </>
  )
}