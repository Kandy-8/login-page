const API_URL = "http://localhost:5000/api";

// Simple field validation helpers for login/register forms
function attachFieldValidation() {
  const fields = [
    { input: document.getElementById("email"), error: document.getElementById("email-error"), label: "Email" },
    { input: document.getElementById("password"), error: document.getElementById("password-error"), label: "Password" }
  ];

  fields.forEach(({ input, error, label }) => {
    if (!input || !error) return;

    // Clear error when focusing the field
    input.addEventListener("focus", () => {
      error.textContent = "";
      input.parentElement.classList.remove("field--invalid");
    });

    // On blur, if empty, show error
    input.addEventListener("blur", () => {
      if (!input.value.trim()) {
        error.textContent = `${label} is required`;
        input.parentElement.classList.add("field--invalid");
      } else {
        error.textContent = "";
        input.parentElement.classList.remove("field--invalid");
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", attachFieldValidation);

async function register() {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password })
  });

  const data = await res.json();
  alert(data.message || data.error);
  if (res.ok) window.location.href = "index.html";
}

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (res.ok) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username);
    window.location.href = "dashboard.html";
  } else {
    alert(data.error);
  }
}
