import { useMemo, useState } from 'react'
import Header from '../../components/layout/Header'
import ItemCard from '../../features/items/components/ItemCard'
import { useItems } from '../../features/items/hooks/useItems'
import type { ItemStatus } from '../../features/items/types/item.types'
import styles from './Home.module.css'

type FilterValue = 'all' | ItemStatus

export default function Home() {
  const [filter, setFilter] = useState<FilterValue>('all')
  const { items } = useItems()

  const filteredItems = useMemo(() => {
    if (filter === 'all') return items
    return items.filter((item) => item.status === filter)
  }, [filter, items])

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <Header filter={filter} setFilter={setFilter} />

        <section className={styles.grid} aria-label="Listado de regalos">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </section>
      </div>
    </main>
  )
}