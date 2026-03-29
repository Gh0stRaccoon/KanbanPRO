document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("form-tarjeta");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = form.title.value;
    const listId = form.listId.value;

    try {
      const response = await fetch(`/api/listas/${listId}/tarjetas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include", // 🔑 usa cookies
        body: JSON.stringify({
          titulo: title,
          descripcion: ""
        })
      });

      const data = await response.json();

      if (!response.ok) {

        // 🔥 manejo inteligente de auth
        if (response.status === 401 || response.status === 403) {
          alert("Sesión expirada, inicia sesión nuevamente");
          window.location.href = "/login";
          return;
        }

        alert(data.error || "Error");
        return;
      }

      location.reload();

    } catch (error) {
      console.error(error);
      alert("Error de conexión");
    }
  });

});