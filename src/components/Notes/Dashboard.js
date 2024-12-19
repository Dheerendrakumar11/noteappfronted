import React, { useState, useEffect } from "react";
import axios from "axios";
import NoteForm from "./NoteForm";
import { Navbar, Nav, NavDropdown, Modal, Form, Button, Card } from "react-bootstrap";

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  console.log(notes)
  const [updatedName, setUpdatedName] = useState(""); // Name for profile update
  const [updatedEmail, setUpdatedEmail] = useState(""); // Profile picture URL
  const [showUpdateModal, setShowUpdateModal] = useState(false); // Update Profile modal visibility
  const [showProfileModal, setShowProfileModal] = useState(false); // User Profile modal visibility
  const [user, setUser] = useState({ name: "", email: "", profilePicture: "" }); // Store user data

  // Modal toggle handlers
  const handleCloseUpdateModal = () => setShowUpdateModal(false); 
  const handleShowUpdateModal = () => {
    setShowUpdateModal(true)
    setUpdatedName(user.name); // Set the name field with the current user name
    setUpdatedEmail(user.email);
  };

  const handleCloseProfileModal = () => setShowProfileModal(false);
  const handleShowProfileModal = () => setShowProfileModal(true);

  // Handle user profile update
  const handleUpdate = async ({id}) => {
    try {
      const updatedUser = {
        name: updatedName || user.name, // Use updated name if provided, else keep the existing one
        email: updatedEmail || user.email, // Same for profile picture
      };

      const { data } = await axios.put(
        `http://localhost:5000/api/users/update/${id}`, // Update endpoint
        updatedUser,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setUser(data); // Update user state with backend response
      handleCloseUpdateModal(); // Close the modal
      window.location.href="/login"
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Fetch notes from the backend
  const fetchNotes = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/notes", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  // Fetch user details on component mount
  useEffect(() => {
    fetchNotes();

    const fetchUser = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/users/detail", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <Navbar bg="primary" variant="dark" expand="lg" className="px-5 fixed-top">
        <Navbar.Brand href="/">Notes App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <NavDropdown title={<span>{user.name}</span>} id="basic-nav-dropdown">
              <NavDropdown.Item onClick={handleShowProfileModal}>View Profile</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleShowUpdateModal}>Update Profile</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/login">Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* Update Profile Modal */}
      <Modal show={showUpdateModal} onHide={handleCloseUpdateModal} centered >
        <Modal.Header closeButton>
          <Modal.Title>Update Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
                placeholder="Enter your name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={updatedEmail}
                placeholder="Enter email"
                onChange={(e) => setUpdatedEmail(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseUpdateModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>

      {/* User Profile Modal */}
      <Modal show={showProfileModal} onHide={handleCloseProfileModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>User Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card style={{ width: "100%" }}>
            <Card.Body>
              <Card.Text>Name: {user.name}</Card.Text>
              <Card.Text>Email: {user.email}</Card.Text>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseProfileModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="container pt-5">
        <NoteForm fetchNotes={fetchNotes} />
      </div>
    </>
  );
};

export default Dashboard;
