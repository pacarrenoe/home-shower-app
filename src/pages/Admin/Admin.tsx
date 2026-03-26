import { useMemo, useState } from 'react'
import { signOut } from 'firebase/auth'
import styles from './Admin.module.css'
import { auth } from '../../app/firebase'
import { useItems } from '../../features/items/hooks/useItems'
import { useAdminItems } from '../../features/items/hooks/useAdminItems'
import AdminItemModal from '../../features/items/components/AdminItemModal'
import type { Item } from '../../features/items/types/item.types'

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
    const owned = items.filter((item) => item.status === 'owned').length
    const reserved = items.filter((item) => item.reserved).length
    const available = items.filter(
      (item) => item.status !== 'owned' && !item.reserved,
    ).length

    return {
      total,
      owned,
      reserved,
      available,
    }
  }, [items])

  const openCreate = () => {
    setModalMode('create')
    setSelectedItem(null)
    setModalOpen(true)
  }

  const openEdit = (item: Item) => {
    setModalMode('edit')
    setSelectedItem(item)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedItem(null)
  }

  const handleLogout = async () => {
    await signOut(auth)
  }

  const submitModal = async (data: {
    name: string
    image: string
    description: string
    status: 'wanted' | 'owned'
    options: Item['options']
  }) => {
    if (modalMode === 'create') {
      await handleCreate(data)
      return
    }

    if (!selectedItem) return

    await handleUpdate(selectedItem.id, data)
  }

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <header className={styles.topbar}>
          <div className={styles.topbarContent}>
            <h1 className={styles.title}>Dashboard</h1>
            <p className={styles.subtitle}>
              Administra artículos del home shower
            </p>
          </div>

          <button
            type="button"
            className={styles.logoutButton}
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </header>

        <section className={styles.kpiGrid}>
          <article className={styles.kpiCard}>
            <span className={styles.kpiLabel}>Total</span>
            <strong className={styles.kpiValue}>{metrics.total}</strong>
          </article>

          <article className={styles.kpiCard}>
            <span className={styles.kpiLabel}>Disponibles</span>
            <strong className={styles.kpiValue}>{metrics.available}</strong>
          </article>

          <article className={styles.kpiCard}>
            <span className={styles.kpiLabel}>Reservados</span>
            <strong className={styles.kpiValue}>{metrics.reserved}</strong>
          </article>

          <article className={styles.kpiCard}>
            <span className={styles.kpiLabel}>Recibidos</span>
            <strong className={styles.kpiValue}>{metrics.owned}</strong>
          </article>
        </section>

        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Artículos</h2>
            <p className={styles.sectionSubtitle}>
              Gestiona disponibilidad, edición y estado de entrega
            </p>
          </div>

          <button
            type="button"
            className={styles.primaryButton}
            onClick={openCreate}
          >
            Agregar artículo
          </button>
        </div>

        {loading ? (
          <p className={styles.emptyState}>Cargando artículos...</p>
        ) : items.length === 0 ? (
          <p className={styles.emptyState}>No hay artículos creados.</p>
        ) : (
          <section className={styles.cardGrid}>
            {items.map((item) => {
              const isOwned = item.status === 'owned'
              const isReserved = item.reserved

              return (
                <article key={item.id} className={styles.card}>
                  <div className={styles.imageWrapper}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className={styles.image}
                    />

                    <span
                      className={`${styles.badge} ${
                        isOwned
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
                    <h3 className={styles.cardTitle}>{item.name}</h3>
                    <p className={styles.cardDescription}>
                      {item.description || 'Sin descripción'}
                    </p>
                  </div>

                  <div className={styles.cardActions}>
                    {isReserved ? (
                      <button
                        type="button"
                        className={`${styles.actionButton} ${styles.warningButton}`}
                        onClick={() => handleReset(item.id)}
                      >
                        Liberar
                      </button>
                    ) : !isOwned ? (
                      <button
                        type="button"
                        className={`${styles.actionButton} ${styles.successButton}`}
                        onClick={() => handleMarkOwned(item.id)}
                      >
                        Marcar recibido
                      </button>
                    ) : (
                      <button
                        type="button"
                        className={`${styles.actionButton} ${styles.successButton}`}
                        onClick={() => handleMarkWanted(item.id)}
                      >
                        Reabrir
                      </button>
                    )}

                    <button
                      type="button"
                      className={`${styles.actionButton} ${styles.secondaryButton}`}
                      onClick={() => openEdit(item)}
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      className={`${styles.actionButton} ${styles.dangerButton} ${styles.fullWidth}`}
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
      </section>

      <AdminItemModal
        isOpen={modalOpen}
        mode={modalMode}
        item={selectedItem}
        onClose={closeModal}
        onSubmit={submitModal}
      />
    </main>
  )
}