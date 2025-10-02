import { useAuth } from "../context/AuthContext";

const { login } = useAuth();

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  try {
    const response = await fetch("http://localhost:5000/api/receptionists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (response.ok) {
      const data = await response.json();
      // Auto login receptionist
      login("receptionist", { name: form.name, email: form.email });
      setSuccess("Receptionist registered & logged in!");
      setForm({ name: "", email: "", password: "", phone: "" });
    } else {
      const data = await response.json();
      setError(data.message || "Registration failed.");
    }
  } catch (err) {
    setError("Could not connect to server.");
  }
};
