import React, { useState, useEffect } from 'react';
import { categoriesApi } from '../services/api';
import './Categories.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoriesApi.getAll();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch categories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await categoriesApi.update(editingCategory.id, formData);
      } else {
        await categoriesApi.create(formData);
      }
      setFormData({ name: '', description: '' });
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      setError('Failed to save category');
      console.error(err);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await categoriesApi.delete(id);
        fetchCategories();
      } catch (err) {
        setError('Failed to delete category');
        console.error(err);
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="categories-page">
      <h1>Categories</h1>
      
      <form onSubmit={handleSubmit} className="category-form">
        <input
          type="text"
          placeholder="Category Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <button type="submit" className="btn-primary">
          {editingCategory ? 'Update Category' : 'Add Category'}
        </button>
        {editingCategory && (
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setEditingCategory(null);
              setFormData({ name: '', description: '' });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <div className="categories-list">
        {categories.map((category) => (
          <div key={category.id} className="category-card">
            <h3>{category.name}</h3>
            <p>{category.description}</p>
            <div className="category-actions">
              <button
                className="btn-edit"
                onClick={() => handleEdit(category)}
              >
                Edit
              </button>
              <button
                className="btn-delete"
                onClick={() => handleDelete(category.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories; 