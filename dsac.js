<input type="text" id="nombreUsuario" placeholder="Ingrese su nombre de Minecraft">
<button id="buscar">Buscar</button>
<p id="resultado"></p>

<script>
    document.getElementById("buscar").addEventListener("click", () => {
        let usuario = document.getElementById("nombreUsuario").value;
        
        fetch("economia.json")
            .then(response => response.json())
            .then(data => {
                let balance = data[usuario] ? data[usuario].balance : "No encontrado";
                document.getElementById("resultado").innerText = `Balance: ${balance}`;
            })
            .catch(error => console.error("Error al obtener datos", error));
    });
</script>
