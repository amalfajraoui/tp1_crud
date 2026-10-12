import { useEffect, useState } from 'react'
import './App.css'

const API_URL = 'http://127.0.0.1:8000/products'

function App() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
  })
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function loadProducts() {
    try {
      const response = await fetch(API_URL)
      if (!response.ok) throw new Error()
      setProducts(await response.json())
      setError('')
    } catch {
      setError('Connexion impossible. Vérifie que FastAPI fonctionne sur le port 8000.')
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  function resetForm() {
    setForm({ name: '', description: '', price: '', quantity: '' })
    setEditingId(null)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    setError('')

    const product = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: Number(form.price),
      quantity: Number(form.quantity),
    }

    try {
      const response = await fetch(
        editingId ? `${API_URL}/${editingId}` : API_URL,
        {
          method: editingId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product),
        }
      )

      const data = await response.json()
      if (!response.ok) throw new Error(data.detail || 'Une erreur est survenue.')

      setMessage(editingId ? 'Produit modifié avec succès.' : 'Produit ajouté avec succès.')
      resetForm()
      await loadProducts()
    } catch (err) {
      setError(err.message || 'Erreur de connexion au serveur.')
    }
  }

  function startEdit(product) {
    setForm({
      name: product.name,
      description: product.description || '',
      price: String(product.price),
      quantity: String(product.quantity),
    })
    setEditingId(product.id)
    setMessage('')
    setError('')
  }

  async function handleDelete(product) {
    if (!window.confirm(`Supprimer le produit « ${product.name} » ?`)) return

    try {
      const response = await fetch(`${API_URL}/${product.id}`, {
        method: 'DELETE',
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.detail || 'Suppression impossible.')

      setMessage('Produit supprimé avec succès.')
      if (editingId === product.id) resetForm()
      await loadProducts()
    } catch (err) {
      setError(err.message || 'Erreur de connexion au serveur.')
    }
  }

  return (
    <main className="page">
      <header className="hero">
        <div className="hero-icon">📦</div>
        <div className="hero-text">
          <p className="eyebrow">APPLICATION FULL STACK</p>
          <h1>Gestion des produits</h1>
          <p className="subtitle">Gérez votre stock simplement et efficacement.</p>
        </div>
        <div className="hero-count">
          <span>{products.length}</span>
          <small>produit(s)</small>
        </div>
      </header>

      {message && <div className="notice success">{message}</div>}
      {error && <div className="notice error">{error}</div>}

      <section className="content-grid">
        <section className="panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{editingId ? 'MISE À JOUR' : 'NOUVEAU PRODUIT'}</p>
              <h2>{editingId ? 'Modifier le produit' : 'Ajouter un produit'}</h2>
            </div>
            <span className="heading-icon">{editingId ? '✏️' : '＋'}</span>
          </div>

          <form onSubmit={handleSubmit}>
            <label>
              Nom du produit
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ex. Clavier Gamer"
                maxLength="100"
                required
              />
            </label>

            <label>
              Description
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description du produit"
                rows="3"
              />
            </label>

            <div className="field-row">
              <label>
                Prix (DT)
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                />
              </label>

              <label>
                Quantité
                <input
                  name="quantity"
                  type="number"
                  min="0"
                  step="1"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="0"
                  required
                />
              </label>
            </div>

            <button className="primary-button" type="submit">
              {editingId ? 'Enregistrer les modifications' : 'Ajouter le produit'}
            </button>

            {editingId && (
              <button className="secondary-button" type="button" onClick={resetForm}>
                Annuler la modification
              </button>
            )}
          </form>
        </section>

        <section className="panel list-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">INVENTAIRE</p>
              <h2>Liste des produits</h2>
            </div>
            <button className="refresh-button" onClick={loadProducts} type="button">
              ↻ Actualiser
            </button>
          </div>

          {products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>Aucun produit pour le moment</h3>
              <p>Ajoutez votre premier produit avec le formulaire.</p>
            </div>
          ) : (
            <div className="product-list">
              {products.map((product) => (
                <article className="product-card" key={product.id}>
                  <div className="product-icon">📦</div>

                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p>{product.description || 'Aucune description'}</p>
                    <div className="product-meta">
                      <span>{Number(product.price).toFixed(2)} DT</span>
                      <span className={product.quantity < 5 ? 'stock low' : 'stock'}>
                        Stock : {product.quantity}
                      </span>
                    </div>
                  </div>

                  <div className="actions">
                    <button
                      className="edit-button"
                      onClick={() => startEdit(product)}
                      type="button"
                    >
                      Modifier
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(product)}
                      type="button"
                    >
                      Supprimer
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>

      <footer>React · FastAPI · PostgreSQL <span>•</span> TP1 CRUD</footer>
    </main>
  )
}

export default App