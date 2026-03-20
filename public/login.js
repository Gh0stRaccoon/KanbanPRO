document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("login-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.email.value;
    const password = form.password.value;

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Error en login");
        return;
      }

      // 🔑 AQUÍ VA EL PASO 4
      localStorage.setItem("token", data.token);

      // 🚀 redirigir
      window.location.href = "/dashboard";

    } catch (error) {
      console.error(error);
      alert("Error de conexión");
    }
  });

});