document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("form-tarjeta");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = form.title.value;
    const listId = form.listId.value;

    const token = localStorage.getItem("token");

    if (!token) {
      alert("No estás autenticado");
      return;
    }

    try {
      const response = await fetch(`/api/listas/${listId}/tarjetas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          titulo: title,
          descripcion: ""
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Error");
        return;
      }

      // 🔄 recargar para ver cambios
      location.reload();

    } catch (error) {
      console.error(error);
      alert("Error de conexión");
    }
  });

});