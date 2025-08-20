document.getElementById("checkBtn").addEventListener("click", async () => {
  const refNumber = document.getElementById("refNumber").value;
  const year = document.getElementById("year").value; 
  const resultDiv = document.getElementById("result");

  if (!refNumber || !year) {
    resultDiv.innerHTML = `<span class="text-red-600">Veuillez entrer le numéro et l'année.</span>`;
    return;
  }

  try {
    const response = await fetch(`http://localhost:8080/conge/checkRef?refNumber=${refNumber}&year=${year}`);
    const text = await response.text();

    const congeRef = `${refNumber}/DRH/${year}`;

    if (response.ok) {
      resultDiv.innerHTML = `<span class="text-green-600">Référence trouvée : <b>${congeRef}</b></span>`;
      setTimeout(() => {
        // on passe la ref complète, encodée (car elle contient des /)
        window.location.href = `src/html/priseconge.html?congeRef=${encodeURIComponent(congeRef)}`;
      }, 1000);
    } else {
      resultDiv.innerHTML = `<span class="text-red-600">${text}</span>`;
    }

  } catch (error) {
    resultDiv.innerHTML = `<span class="text-red-600">Erreur: ${error.message}</span>`;
  }
});
