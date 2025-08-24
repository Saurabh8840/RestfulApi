"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/Card";
import { Label } from "../components/ui/Label";
import axios from "axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [name, setName] = useState(""); // 👈 renamed from username → name
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all users
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/dashboard/getusers`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProfiles(res.data || []);
      })
      .catch((err) => {
        console.error(err);
        localStorage.removeItem("token");
        navigate("/login");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  // ✅ Add or Update user
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (editId) {
        // Update
        const res = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/dashboard/updateUser/${editId}`,
          { Name: name, email, age }, // 👈 match backend schema
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProfiles(profiles.map((p) => (p._id === editId ? res.data : p)));
        setEditId(null);
      } else {
        // Create
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/dashboard/newuser`,
          { Name: name, email, age }, // 👈 match backend schema
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setProfiles([ res.data,...profiles]);
      }

      // reset
      setName("");
      setEmail("");
      setAge("");
    } catch (error) {
      console.error(error);
      alert("Operation failed");
    }
  };

  // ✅ Delete user
  const deleteProfile = async (id) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/dashboard/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfiles(profiles.filter((profile) => profile._id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete profile");
    }
  };

  // ✅ Start editing
  const startEdit = (profile) => {
    setEditId(profile._id);
    setName(profile.Name); // 👈 backend uses Name
    setEmail(profile.email);
    setAge(profile.age);
  };

  if (loading) return <h2 className="p-6">Loading dashboard...</h2>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <Button
              variant="outline"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Form */}
        <div className="w-[30%] bg-white border-r border-gray-200 p-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {editId ? "Update Profile" : "Add New Profile"}
              </CardTitle>
              <CardDescription>
                {editId
                  ? "Update details and save"
                  : "Fill details to create a profile"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editId ? "Update" : "Submit"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right List */}
        <div className="w-[70%] p-6 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              All Profiles
            </h2>
            <p className="text-gray-600">Total profiles: {profiles.length}</p>
          </div>

          {profiles.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg">No profiles yet</div>
              <p className="text-gray-500 mt-2">
                Use the form to add a profile
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {profiles.map((profile) => (
                <Card key={profile._id} className="relative">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div>
                          <span className="font-medium text-gray-700">
                            Name:{" "}
                          </span>
                          {profile.Name}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Email:{" "}
                          </span>
                          {profile.email}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Age:{" "}
                          </span>
                          {profile.age}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEdit(profile)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteProfile(profile._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}


        </div>

      </div>
    </div>
  );
}
