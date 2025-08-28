function showMessage(message, type = "info") {
  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  const container = document.createElement("div");
  container.className = `${colors[type]} text-white px-4 py-2 rounded-lg shadow-lg fixed top-4 right-4 z-50 animate-bounce`;
  container.textContent = message;

  document.body.appendChild(container);

  // Disparaît après 4s
  setTimeout(() => {
    container.remove();
  }, 4000);
}
