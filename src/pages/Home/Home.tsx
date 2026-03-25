import { useMemo, useState } from 'react'
import Header from '../../components/layout/Header'
import ItemCard from '../../features/items/components/ItemCard'
import { useItems } from '../../features/items/hooks/useItems'
import type { Item } from '../../features/items/types/item.types'
import ReserveModal from '../../features/reservations/components/ReserveModal'
import styles from './Home.module.css'

type FilterValue = 'all' | 'wanted' | 'owned'

export default function Home() {
  const { items, loading } = useItems()

  const [filter, setFilter] = useState<FilterValue>('all')
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)

  const filteredItems = useMemo(() => {
    if (filter === 'all') return items
    return items.filter((item) => item.status === filter)
  }, [items, filter])

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <Header filter={filter} setFilter={setFilter} />

        {loading ? (
          <p className={styles.loading}>Cargando artículos...</p>
        ) : filteredItems.length === 0 ? (
          <p className={styles.empty}>No hay artículos para este filtro.</p>
        ) : (
          <section className={styles.grid}>
            {filteredItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onReserve={(currentItem) => setSelectedItem(currentItem)}
              />
            ))}
          </section>
        )}
      </div>

      <ReserveModal
        isOpen={Boolean(selectedItem)}
        onClose={() => setSelectedItem(null)}
        itemId={selectedItem?.id ?? ''}
        itemName={selectedItem?.name ?? ''}
        options={selectedItem?.options ?? []}
      />
    </main>
  )
}