import styles from './Header.module.css'

type FilterValue = 'all' | 'wanted' | 'owned'

type HeaderProps = {
  filter: FilterValue
  setFilter: (value: FilterValue) => void
}

export default function Header({ filter, setFilter }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <h1 className={styles.title}> Home Shower N&P ✨</h1>
        <p className={styles.subtitle}>Ayúdanos a armar nuestro nuevo hogar, cada granito cuenta 🌻</p>
      </div>

      <div className={styles.filters} role="tablist" aria-label="Filtros de artículos">
        <button
          type="button"
          className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
          onClick={() => setFilter('all')}
        >
          Todo
        </button>

        <button
          type="button"
          className={`${styles.filterButton} ${filter === 'wanted' ? styles.active : ''}`}
          onClick={() => setFilter('wanted')}
        >
          Lo queremos
        </button>

        <button
          type="button"
          className={`${styles.filterButton} ${filter === 'owned' ? styles.active : ''}`}
          onClick={() => setFilter('owned')}
        >
          Ya lo tenemos
        </button>
      </div>
    </header>
  )
}