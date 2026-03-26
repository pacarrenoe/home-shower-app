import { useMemo, useState } from 'react'
import styles from './Admin.module.css'
import { useItems } from '../../features/items/hooks/useItems'
import { useAdminItems } from '../../features/items/hooks/useAdminItems'
import AdminItemModal from '../../features/items/components/AdminItemModal'
import type { Item } from '../../features/items/types/item.types'
import { signOut } from 'firebase/auth'
import { auth } from '../../app/firebase'

export default function Admin() {
  const { items, loading } = useItems()
  const {
    handleCreate,
    handleUpdate,
    handleDelete,
    handleMarkOwned,
    handleReset,
    handleMarkWanted,
  } = useAdminItems()

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)

  const metrics = useMemo(() => {
    const total = items.length
    const owned = items.filter((i) => i.status === 'owned').length
    const reserved = items.filter((i) => i.reserved).length
    const available = items.filter(
      (i) => i.status !== 'owned' && !i.reserved,
    ).length

    return { total, owned, reserved, available }
  }, [items])

  const openCreate = () => {
    setModalMode('create')
    setSelectedItem(null)
    setModalOpen(true)
  }

  const handleLogout = async () => {
    await signOut(auth)
  }

  const openEdit = (item: Item) => {
    setModalMode('edit')
    setSelectedItem(item)
    setModalOpen(true)
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.topbar}>
          <div>
            <h1 className={styles.title}>Dashboard</h1>
            <p className={styles.subtitle}>
              Administra artículos del home shower
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className={styles.primaryButton} onClick={openCreate}>
              + Nuevo
            </button>

            <button className={styles.logoutButton} onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        </header>

        {/* KPIs */}
        <section className={styles.kpiGrid}>
          <div className={styles.kpiCard}>
            <span>Total</span>
            <strong>{metrics.total}</strong>
          </div>
          <div className={styles.kpiCard}>
            <span>Disponibles</span>
            <strong>{metrics.available}</strong>
          </div>
          <div className={styles.kpiCard}>
            <span>Reservados</span>
            <strong>{metrics.reserved}</strong>
          </div>
          <div className={styles.kpiCard}>
            <span>Recibidos</span>
            <strong>{metrics.owned}</strong>
          </div>
        </section>

        {/* GRID DASHBOARD */}
        {loading ? (
          <p className={styles.empty}>Cargando...</p>
        ) : (
          <section className={styles.cardGrid}>
            {items.map((item) => {
              const isOwned = item.status === 'owned'
              const isReserved = item.reserved

              return (
                <article key={item.id} className={styles.card}>
                  <div className={styles.imageWrapper}>
                    <img src={item.image} className={styles.image} />

                    <span
                      className={`${styles.badge} ${isOwned
                        ? styles.badgeOwned
                        : isReserved
                          ? styles.badgeReserved
                          : styles.badgeAvailable
                        }`}
                    >
                      {isOwned
                        ? 'Recibido'
                        : isReserved
                          ? `Reservado por ${item.reservedBy}`
                          : 'Disponible'}
                    </span>
                  </div>

                  <div className={styles.cardBody}>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                  </div>

                  <div className={styles.cardActions}>
                    {isReserved && (
                      <button onClick={() => handleReset(item.id)}>
                        Liberar
                      </button>
                    )}

                    {!isOwned ? (
                      <button onClick={() => handleMarkOwned(item.id)}>
                        Recibido
                      </button>
                    ) : (
                      <button onClick={() => handleMarkWanted(item.id)}>
                        Reabrir
                      </button>
                    )}

                    <button onClick={() => openEdit(item)}>Editar</button>

                    <button
                      className={styles.danger}
                      onClick={() => handleDelete(item.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </article>
              )
            })}
          </section>
        )}
      </div>

      <AdminItemModal
        isOpen={modalOpen}
        mode={modalMode}
        item={selectedItem}
        onClose={() => setModalOpen(false)}
        onSubmit={async (data) => {
          if (modalMode === 'create') return handleCreate(data)
          if (!selectedItem) return
          return handleUpdate(selectedItem.id, data)
        }}
      />
    </main>
  )
}