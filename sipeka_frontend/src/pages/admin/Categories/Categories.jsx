import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faSearch } from '@fortawesome/free-solid-svg-icons';
import {
  deleteCategory,
  getCategories,
  createCategory,
  updateCategory,
} from "../../../_services/category";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [updateMode, setUpdateMode] = useState(false);
  const [updateCategoryId, setUpdateCategoryId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryData = await getCategories();
        setCategories(categoryData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (category_id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this category?");
    if (confirmDelete) {
      try {
        await deleteCategory(category_id);
        setCategories(categories.filter((c) => c.category_id !== category_id));
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (updateMode && updateCategoryId !== null) {
        const updated = await updateCategory(updateCategoryId, { name: categoryName });
        setCategories(categories.map(c => c.category_id === updateCategoryId ? updated : c));
      } else {
        const created = await createCategory({ name: categoryName });
        setCategories([...categories, created]);
      }
      resetForm();
    } catch (error) {
      console.error("Error submitting category:", error);
    }
  };

  const resetForm = () => {
    setCategoryName("");
    setUpdateMode(false);
    setUpdateCategoryId(null);
    setShowForm(false);
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Category Management</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-[#204c3f] text-white px-4 py-2 rounded hover:bg-green-800"
        >
          
          Tambah Category
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-4 flex items-center">
        
        <input
          type="text"
          placeholder="Cari kategori..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 mb-4 w-full md:w-1/3"
        />
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 bg-gray-100 p-4 rounded space-y-3">
          <div>
            <label className="block mb-1 font-medium">Nama Kategori:</label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-[#204c3f] text-white px-4 py-2 rounded hover:bg-green800"
            >
              {updateMode ? (
                <>
                  
                  Update
                </>
              ) : (
                <>
                  
                  Simpan
                </>
              )}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="bg-white shadow rounded">
        <table className="w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Nama</th>
              <th className="px-4 py-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((category) => (
              <tr key={category.category_id} className="border-t hover:bg-gray-100">
                <td className="px-4 py-2">{category.name}</td>
                <td className="px-4 py-2 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setCategoryName(category.name);
                        setUpdateMode(true);
                        setUpdateCategoryId(category.category_id);
                        setShowForm(true);
                      }}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.category_id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredCategories.length === 0 && (
              <tr>
                <td colSpan="2" className="px-4 py-4 text-center text-gray-500">
                  Tidak ada data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
