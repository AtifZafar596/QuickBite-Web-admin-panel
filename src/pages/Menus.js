import React, { useState, useEffect } from 'react';
import { storesApi, menusApi } from '../services/api';
import './Menus.css';

const initialForm = { name: '', description: '', price: '', image_url: '' };

const Menus = () => {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState('');
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [editingMenu, setEditingMenu] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    if (selectedStore) fetchMenus(selectedStore);
    else setMenus([]);
  }, [selectedStore]);

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

  const fetchMenus = async (storeId) => {
    try {
      setLoading(true);
      const response = await menusApi.getAllByStore(storeId);
      setMenus(Array.isArray(response) ? response : []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch menu items');
      setMenus([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (menu) => {
    setEditingMenu(menu);
    setForm({
      name: menu.name || '',
      description: menu.description || '',
      price: menu.price || '',
      image_url: menu.image_url || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    setDeletingId(id);
    try {
      await menusApi.delete(id);
      fetchMenus(selectedStore);
    } catch (err) {
      setError('Failed to delete menu item');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMenu) {
        await menusApi.update(editingMenu.id, form);
      } else {
        await menusApi.createForStore(selectedStore, form);
      }
      setForm(initialForm);
      setEditingMenu(null);
      setShowForm(false);
      fetchMenus(selectedStore);
    } catch (err) {
      setError('Failed to save menu item');
    }
  };

  const handleCancel = () => {
    setForm(initialForm);
    setEditingMenu(null);
    setShowForm(false);
  };

  return (
    <div className="menus-page">
      <h1>Menus</h1>
      <div className="store-selector">
        <label>Select Store: </label>
        <select value={selectedStore} onChange={e => setSelectedStore(e.target.value)}>
          <option value="">-- Select Store --</option>
          {stores.map(store => (
            <option key={store.id} value={store.id}>{store.name}</option>
          ))}
        </select>
      </div>
      {selectedStore && (
        <button className="btn-primary" onClick={() => { setShowForm(true); setEditingMenu(null); setForm(initialForm); }}>
          + Add Menu Item
        </button>
      )}
      {error && <div className="error">{error}</div>}
      {showForm && (
        <form className="menu-form" onSubmit={handleSubmit}>
          <input name="name" value={form.name} onChange={handleFormChange} placeholder="Menu Item Name" required />
          <input name="description" value={form.description} onChange={handleFormChange} placeholder="Description" />
          <input name="price" value={form.price} onChange={handleFormChange} placeholder="Price" type="number" min="0" step="0.01" required />
          <input name="image_url" value={form.image_url} onChange={handleFormChange} placeholder="Image URL" />
          <button type="submit" className="btn-primary">{editingMenu ? 'Update' : 'Create'}</button>
          <button type="button" className="btn-secondary" onClick={handleCancel}>Cancel</button>
        </form>
      )}
      {loading ? (
        <div className="loading">Loading...</div>
      ) : selectedStore && (
        <div className="menus-list">
          <table className="menus-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {menus.map((menu) => (
                <tr key={menu.id}>
                  <td>{menu.name}</td>
                  <td>{menu.description}</td>
                  <td>AED{menu.price?.toFixed ? menu.price.toFixed(2) : menu.price}</td>
                  <td>{menu.image_url ? <img src={menu.image_url} alt="menu" style={{ width: 40, height: 40, objectFit: 'cover' }} /> : 'N/A'}</td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(menu)}>Edit</button>
                    <button className="btn-delete" onClick={() => handleDelete(menu.id)} disabled={deletingId === menu.id}>
                      {deletingId === menu.id ? 'Deleting...' : 'Delete'}
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

export default Menus; 
 