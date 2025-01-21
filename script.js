document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("productoForm");
    const productosContainer = document.getElementById("productosContainer");
    let productos = JSON.parse(localStorage.getItem("productos")) || []; // Cargar productos de LocalStorage

    renderizarProductos(); // Renderizar productos al iniciar la página

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Evita que el formulario se envíe automáticamente

        // Capturar valores de los campos
        const nombre = document.getElementById("nombre").value.trim();
        const precio = document.getElementById("precio").value.trim();
        const imagen = document.getElementById("imagen").value.trim();

        // Validar los campos
        if (nombre === "") {
            alert("El nombre del producto no puede estar vacío.");
            return;
        }

        if (precio === "" || isNaN(precio) || Number(precio) <= 0) {
            alert("Ingrese un precio válido.");
            return;
        }

        if (!isValidURL(imagen)) {
            alert("Ingrese una URL de imagen válida.");
            return;
        }

        // Crear un objeto de producto
        const producto = {
            id: Date.now(), // Generar un ID único
            nombre,
            precio: Number(precio),
            imagen
        };

        // Agregar el producto al array
        productos.push(producto);

        // Guardar en LocalStorage
        localStorage.setItem("productos", JSON.stringify(productos));

        // Renderizar los productos en pantalla
        renderizarProductos();

        // Limpiar el formulario
        form.reset();
    });

    // Función para renderizar los productos en pantalla
    function renderizarProductos() {
        productosContainer.innerHTML = ""; // Limpiar el contenedor antes de renderizar

        productos.forEach((producto) => {
            const productoCard = document.createElement("div");
            productoCard.classList.add("producto");

            productoCard.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <h3>${producto.nombre}</h3>
                <p>$${producto.precio.toFixed(2)}</p>
                <button class="eliminar-btn" data-id="${producto.id}">Eliminar</button>
            `;

            productosContainer.appendChild(productoCard);
        });

        // Agregar eventos a los botones de eliminar
        document.querySelectorAll(".eliminar-btn").forEach((boton) => {
            boton.addEventListener("click", eliminarProducto);
        });
    }

    // Función para eliminar un producto
    function eliminarProducto(event) {
        const productoId = Number(event.target.getAttribute("data-id"));
        productos = productos.filter((producto) => producto.id !== productoId);

        // Guardar el nuevo array en LocalStorage
        localStorage.setItem("productos", JSON.stringify(productos));

        renderizarProductos(); // Volver a mostrar la lista sin el producto eliminado
    }

    // Función corregida para validar una URL de imagen
    function isValidURL(url) {
        try {
            const parsedURL = new URL(url);
            return /\.(jpeg|jpg|gif|png|webp)$/i.test(parsedURL.pathname);
        } catch (error) {
            return false;
        }
    }
});
