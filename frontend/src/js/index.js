document.getElementById("checkBtn").addEventListener("click", async () => {
  const refNumber = document.getElementById("refNumber").value;
  // Récupérer la valeur du champ 'year'
  const year = document.getElementById("year").value; 
  const resultDiv = document.getElementById("result");

  if (!refNumber || !year) {
    resultDiv.innerHTML = `<span class="text-red-600">Veuillez entrer le numéro et l'année.</span>`;
    return;
  }

  try {
    // Modifier la requête pour inclure l'année
    const response = await fetch(`http://localhost:8080/conge/checkRef?refNumber=${refNumber}&year=${year}`);
    const text = await response.text();

    if (response.ok) {
      resultDiv.innerHTML = `<span class="text-green-600">${text}</span>`;

      // Redirection après 1s
      setTimeout(() => {
        window.location.href = `src/html/priseconge.html?ref=${refNumber}`;
      }, 1000);

    } else {
      resultDiv.innerHTML = `<span class="text-red-600">${text}</span>`;
    }

  } catch (error) {
    resultDiv.innerHTML = `<span class="text-red-600">Erreur: ${error.message}</span>`;
  }
});