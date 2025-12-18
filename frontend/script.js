const API_URL = "https://login-page-p86k.onrender.com/api";

// Simple field validation helpers for login/register forms
function attachFieldValidation() {
  // Check if we're on login page
  const loginEmail = document.getElementById("email");
  const loginPassword = document.getElementById("password");
  const loginEmailError = document.getElementById("email-error");
  const loginPasswordError = document.getElementById("password-error");

  if (loginEmail && loginPassword && loginEmailError && loginPasswordError) {
    const loginFields = [
      { input: loginEmail, error: loginEmailError, label: "Email" },
      { input: loginPassword, error: loginPasswordError, label: "Password" }
    ];

    loginFields.forEach(({ input, error, label }) => {
      input.addEventListener("focus", () => {
        error.textContent = "";
        input.parentElement.classList.remove("field--invalid");
      });

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

  // Check if we're on register page
  const registerUsername = document.getElementById("username");
  const registerEmail = document.getElementById("email");
  const registerPassword = document.getElementById("password");
  const registerUsernameError = document.getElementById("username-error");
  const registerEmailError = document.getElementById("email-error");
  const registerPasswordError = document.getElementById("password-error");

  if (registerUsername && registerEmail && registerPassword) {
    const registerFields = [
      { input: registerUsername, error: registerUsernameError, label: "Username" },
      { input: registerEmail, error: registerEmailError, label: "Email" },
      { input: registerPassword, error: registerPasswordError, label: "Password" }
    ];

    registerFields.forEach(({ input, error, label }) => {
      if (!input || !error) return;

      input.addEventListener("focus", () => {
        error.textContent = "";
        input.parentElement.classList.remove("field--invalid");
      });

      input.addEventListener("blur", () => {
        if (!input.value.trim()) {
          error.textContent = `${label} is required`;
          input.parentElement.classList.add("field--invalid");
        } else {
          // Additional validation for email
          if (label === "Email" && input.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value.trim())) {
              error.textContent = "Please enter a valid email address";
              input.parentElement.classList.add("field--invalid");
              return;
            }
          }
          // Additional validation for password
          if (label === "Password" && input.value.trim().length < 6) {
            error.textContent = "Password must be at least 6 characters";
            input.parentElement.classList.add("field--invalid");
            return;
          }
          error.textContent = "";
          input.parentElement.classList.remove("field--invalid");
        }
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", attachFieldValidation);

async function register() {
  const usernameInput = document.getElementById("username");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  // Validate fields
  let hasError = false;

  if (!username) {
    const errorEl = document.getElementById("username-error");
    if (errorEl) {
      errorEl.textContent = "Username is required";
      usernameInput.parentElement.classList.add("field--invalid");
    }
    hasError = true;
  }

  if (!email) {
    const errorEl = document.getElementById("email-error");
    if (errorEl) {
      errorEl.textContent = "Email is required";
      emailInput.parentElement.classList.add("field--invalid");
    }
    hasError = true;
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const errorEl = document.getElementById("email-error");
      if (errorEl) {
        errorEl.textContent = "Please enter a valid email address";
        emailInput.parentElement.classList.add("field--invalid");
      }
      hasError = true;
    }
  }

  if (!password) {
    const errorEl = document.getElementById("password-error");
    if (errorEl) {
      errorEl.textContent = "Password is required";
      passwordInput.parentElement.classList.add("field--invalid");
    }
    hasError = true;
  } else if (password.length < 6) {
    const errorEl = document.getElementById("password-error");
    if (errorEl) {
      errorEl.textContent = "Password must be at least 6 characters";
      passwordInput.parentElement.classList.add("field--invalid");
    }
    hasError = true;
  }

  if (hasError) return;

  try {
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();
    
    if (res.ok) {
      // Show success message
      alert(data.message || "Registration successful!");
      window.location.href = "index.html";
    } else {
      // Show error message
      alert(data.error || "Registration failed. Please try again.");
    }
  } catch (err) {
    console.error("Registration error:", err);
    alert("Network error. Please check your connection and try again.");
  }
}

async function login() {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  // Validate fields
  let hasError = false;

  if (!email) {
    const errorEl = document.getElementById("email-error");
    if (errorEl) {
      errorEl.textContent = "Email is required";
      emailInput.parentElement.classList.add("field--invalid");
    }
    hasError = true;
  }

  if (!password) {
    const errorEl = document.getElementById("password-error");
    if (errorEl) {
      errorEl.textContent = "Password is required";
      passwordInput.parentElement.classList.add("field--invalid");
    }
    hasError = true;
  }

  if (hasError) return;

  try {
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
      alert(data.error || "Login failed. Please check your credentials.");
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("Network error. Please check your connection and try again.");
  }
}
