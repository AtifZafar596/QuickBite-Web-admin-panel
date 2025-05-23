import React, { useState, useEffect } from 'react';
import { storesApi, categoriesApi } from '../services/api';
import './Stores.css';

const initialForm = { 
  name: '', 
  description: '', 
  image_url: '', 
  category_id: '',
  opening_time: '',
  closing_time: ''
};

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [editingStore, setEditingStore] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchStores();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoriesApi.getAll();
      setCategories(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchStores = async () => {
    try {
      setLoading(true);
      const response = await storesApi.getAll();
      setStores(Array.isArray(response) ? response : []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch stores');
      setStores([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (store) => {
    setEditingStore(store);
    setForm({
      name: store.name || '',
      description: store.description || '',
      image_url: store.image_url || '',
      category_id: store.category_id || '',
      opening_time: store.opening_time || '',
      closing_time: store.closing_time || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this store?')) return;
    setDeletingId(id);
    try {
      await storesApi.delete(id);
      fetchStores();
    } catch (err) {
      setError('Failed to delete store');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStore) {
        await storesApi.update(editingStore.id, form);
      } else {
        await storesApi.create(form);
      }
      setForm(initialForm);
      setEditingStore(null);
      setShowForm(false);
      fetchStores();
    } catch (err) {
      setError('Failed to save store');
    }
  };

  const handleCancel = () => {
    setForm(initialForm);
    setEditingStore(null);
    setShowForm(false);
  };

  return (
    <div className="stores-page">
      <h1>Stores</h1>
      <button className="btn-primary" onClick={() => { setShowForm(true); setEditingStore(null); setForm(initialForm); }}>
        + Add Store
      </button>
      {error && <div className="error">{error}</div>}
      {showForm && (
        <form className="store-form" onSubmit={handleSubmit}>
          <input name="name" value={form.name} onChange={handleFormChange} placeholder="Store Name" required />
          <input name="description" value={form.description} onChange={handleFormChange} placeholder="Description" />
          <input name="image_url" value={form.image_url} onChange={handleFormChange} placeholder="Image URL" />
          <select 
            name="category_id" 
            value={form.category_id} 
            onChange={handleFormChange}
            required
            className="category-select"
          >
            <option value="">Select a Category</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <input 
            type="time" 
            name="opening_time" 
            value={form.opening_time} 
            onChange={handleFormChange} 
            placeholder="Opening Time" 
          />
          <input 
            type="time" 
            name="closing_time" 
            value={form.closing_time} 
            onChange={handleFormChange} 
            placeholder="Closing Time" 
          />
          <button type="submit" className="btn-primary">{editingStore ? 'Update' : 'Create'}</button>
          <button type="button" className="btn-secondary" onClick={handleCancel}>Cancel</button>
        </form>
      )}
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="stores-list">
          <table className="stores-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Image</th>
                <th>Category</th>
                <th>Opening Time</th>
                <th>Closing Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store) => (
                <tr key={store.id}>
                  <td>{store.name}</td>
                  <td>{store.description}</td>
                  <td>{store.image_url ? <img src={store.image_url} alt="store" style={{ width: 40, height: 40, objectFit: 'cover' }} /> : 'N/A'}</td>
                  <td>
                    {categories.find(cat => cat.id === store.category_id)?.name || 'N/A'}
                  </td>
                  <td>{store.opening_time || 'N/A'}</td>
                  <td>{store.closing_time || 'N/A'}</td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(store)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(store.id)} disabled={deletingId === store.id}>
                      {deletingId === store.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Stores; 