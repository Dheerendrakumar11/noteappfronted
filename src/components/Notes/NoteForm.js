import React, { useState, useEffect } from "react";
import axios from "axios";

const NotesManager = () => {
  const [notes, setNotes] = useState([]);
  const [noteData, setNoteData] = useState({ title: "", content: "", category: "" });
  const [editId, setEditId] = useState(null);
  const [searchCategory, setSearchCategory] = useState("");

  
  const fetchNotes = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found. Please log in.");
      return;
    }

    try {
      const response = await axios.get("https://my-backend-u9o9.onrender.com/api/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error.response?.data?.message || error.message);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    setNoteData({ ...noteData, [e.target.name]: e.target.value });
  };

  // Handle form submission (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found. Please log in.");
      return;
    }

    try {
      if (editId) {
        await axios.put(`https://my-backend-u9o9.onrender.com/api/notes/${editId}`, noteData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("https://my-backend-u9o9.onrender.com/api/notes", noteData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setNoteData({ title: "", content: "", category: "" });
      setEditId(null);
      fetchNotes();
    } catch (error) {
      console.error("Error saving note:", error.response?.data?.message || error.message);
    }
  };

  const handleEdit = (note) => {
    setNoteData({ title: note.title, content: note.content, category: note.category });
    setEditId(note._id);
  };


  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found. Please log in.");
      return;
    }

    try {
      await axios.delete(`https://my-backend-u9o9.onrender.com/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error.response?.data?.message || error.message);
    }
  };

  
  const handleSearchChange = (e) => {
    setSearchCategory(e.target.value);
  };

  
  const filteredNotes = notes.filter((note) =>
    note.category.toLowerCase().includes(searchCategory.toLowerCase())
  );

  
  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-center">Notes</h1>

     

      {/* Note Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={noteData.title}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="content" className="form-label">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            value={noteData.content}
            onChange={handleChange}
            className="form-control"
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="category" className="form-label">
            Category
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={noteData.category}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          {editId ? "Update Note" : "Add Note"}
        </button>
      </form>
      <div>

      <h2>All Notes</h2>
       {/* Search Input */}
       <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by category"
          value={searchCategory}
          onChange={handleSearchChange}
        />
      </div>
      </div>
      {filteredNotes.length > 0 ? (
        <div className="row">
          {filteredNotes.map((note) => (
            <div key={note._id} className="col-md-4 col-sm-6 mb-4">
              <div className="card card-hover">
                <div className="card-body">
                  <h5 className="card-title">{note.title}</h5>
                  <p className="card-text">{note.content}</p>
                  <small className="text-muted">Category: {note.category}</small>
                  <div className="mt-3">
                    <button onClick={() => handleEdit(note)} className="btn btn-warning me-2">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(note._id)} className="btn btn-danger">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No notes available for the selected category.</p>
      )}
    </div>
  );
};

export default NotesManager;
