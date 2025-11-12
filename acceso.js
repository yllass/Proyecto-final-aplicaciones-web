const API_BASE = "https://portfolio-api-three-black.vercel.app/api/v1";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const logoutBtn = document.getElementById("logoutBtn");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        console.log("Respuesta del servidor:", data);

        if (!res.ok) throw new Error("Credenciales incorrectas");

        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userId", data.userPublicData.id);
        mostrarMensaje("✅ Sesión iniciada correctamente.", "success");
        setTimeout(() => (window.location.href = "home.html"), 1500);
      } catch (err) {
        mostrarMensaje("❌ " + err.message, "error");
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const itsonId = document.getElementById("itsonId").value;
      const password = document.getElementById("password").value;

      try {
        const res = await fetch(`${API_BASE}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, itsonId, password }),
        });
        const data = await res.json();
        console.log("Respuesta del servidor:", data);

        if (!res.ok) throw new Error(data.message || "Error al registrar");

        mostrarMensaje("✅ Registro exitoso. Inicia sesión.", "success");
        setTimeout(() => (window.location.href = "logindex.html"), 1500);
      } catch (err) {
        mostrarMensaje("❌ " + err.message, "error");
      }
    });
  }

  if (window.location.pathname.includes("home.html")) {
    const token = localStorage.getItem("authToken");
    if (!token) {
      window.location.href = "logindex.html";
    }
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "logindex.html";
    });
  }
});

function mostrarMensaje(texto, tipo = "info") {
  let msg = document.getElementById("msgBox");
  if (!msg) {
    msg = document.createElement("div");
    msg.id = "msgBox";
    document.body.appendChild(msg);
  }

  msg.textContent = texto;
  msg.className = tipo;
  msg.style.display = "block";

  setTimeout(() => {
    msg.style.display = "none";
  }, 4000);
}
