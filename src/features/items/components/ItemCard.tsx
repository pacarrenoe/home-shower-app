import styles from './ItemCard.module.css'
import type { Item } from '../types/item.types'

type Props = {
  item: Item
  onReserve: (item: Item) => void
}

export default function ItemCard({ item, onReserve }: Props) {
  const isOwned = item.status === 'owned'
  const isReserved = item.reserved

  return (
    <article
      className={`${styles.card} ${isOwned ? styles.owned : ''} ${isReserved ? styles.reserved : ''}`}
    >
      <img
        src={item.image}
        alt={item.name}
        className={`${styles.image} ${isOwned ? styles.imageMuted : ''}`}
      />

      <div className={styles.content}>
        <div className={styles.top}>
          <h2 className={styles.title}>{item.name}</h2>

          {item.description ? (
            <p className={styles.description}>{item.description}</p>
          ) : null}

          {!isOwned && item.options.length > 0 ? (
            <div className={styles.options}>
              {item.options.map((option) => (
                <a
                  key={option.id}
                  href={option.url}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.optionLink}
                >
                  {option.store} ${option.price.toLocaleString('es-CL')}
                </a>
              ))}
            </div>
          ) : null}
        </div>

        {isOwned ? (
          <p className={styles.ownedText}>¡Ya lo tenemos!</p>
        ) : isReserved ? (
          <p className={styles.reservedText}>Reservado por {item.reservedBy}</p>
        ) : (
          <button
            type="button"
            className={styles.actionButton}
            onClick={() => onReserve(item)}
          >
            ¡Yo te lo regalaré!
          </button>
        )}
      </div>
    </article>
  )
}