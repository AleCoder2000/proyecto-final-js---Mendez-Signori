


// Obtener carrito desde el localStorage
const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Obtener productos desde un archivo JSON utilizando fetch
fetch('./productos.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cargar los productos');
        }
        return response.json();
    })
    .then(productos => {
        console.log('Productos cargados:', productos);
        // para trabajar con los productos cargados
    })
    .catch(error => {
        console.error('Error:', error);
    });

const productos = [
    {
        id: "articulo-1",
        titulo: "Carpa modelo Himalaya",
        precio: 550000,
        img: "./images/carpa1.webp",
    },
    {
        id: "articulo-2",
        titulo: "Carpa modelo Everest",
        precio: 650000,
        img: "./images/carpa2.webp",
    },
    {
        id: "articulo-3",
        titulo: "Carpa modelo Aconcagua",
        precio: 590000,
        img: "./images/carpa3.webp",
    },
    {
        id: "articulo-4",
        titulo: "Mochila 60 lts.",
        precio: 350000,
        img: "./images/mochila1.webp",
    },
    {
        id: "articulo-5",
        titulo: "Mochila 65 lts.",
        precio: 450000,
        img: "./images/mochila2.webp",
    },
    {
        id: "articulo-6",
        titulo: "Mochila 70 lts.",
        precio: 500000,
        img: "./images/mochila3.webp",
    }
];

const contenedorProductos = document.querySelector("#productos");
const carritoVacio = document.querySelector("#carrito-vacio");
const carritoProductos = document.querySelector("#carrito-productos");
const carritoTotal = document.querySelector("#carrito-total");
const vaciarCarrito = document.querySelector("#vaciar-carrito");
const irAlCarrito = document.querySelector("#ir-al-carrito");

productos.forEach((producto) => {

    let div = document.createElement("div");
    div.classList.add("producto");
    div.innerHTML = `
        <img class="producto-img" src="${producto.img}" alt="">
        <h3>${producto.titulo}</h3>
        <p>$${producto.precio.toLocaleString()}</p>
    `;

    let button = document.createElement("button");
    button.classList.add("producto-btn");
    button.innerText = "Agregar al carrito";
    button.addEventListener("click", () => {
        agregarAlCarrito(producto);
    })

    div.append(button);
    contenedorProductos.append(div);
});

const agregarAlCarrito = (producto) => {
    let productoEnCarrito = carrito.find((item) => item.id === producto.id);
    
    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else {
        carrito.push({...producto, cantidad: 1});
    }

    actualizarCarrito();

    Toastify({
        text: producto.titulo + " agregado",
        avatar: producto.img,
        duration: 1200,
        close: true,
        className: "toast-agregar",
        style: {
          background: "#9b8bf1",
          color: "#d9e4f2",
      },
      }).showToast();
}

function actualizarCarrito() {
    if (carrito.length === 0) {
        carritoVacio.classList.remove("d-none");
        carritoProductos.classList.add("d-none");
        vaciarCarrito.classList.add("d-none");
        irAlCarrito.classList.add("d-none");
    } else {
        carritoVacio.classList.add("d-none");
        carritoProductos.classList.remove("d-none");
        vaciarCarrito.classList.remove("d-none");
        irAlCarrito.classList.remove("d-none");

        carritoProductos.innerHTML = "";
        carrito.forEach((producto) => {
            let div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <h3>${producto.titulo}</h3>
                <p>$${producto.precio.toLocaleString()}</p>
                <p>${producto.cantidad}</p>
                <p>$${(producto.cantidad * producto.precio).toLocaleString()}</p>
            `;

            let button = document.createElement("button");
            button.classList.add("carrito-producto-btn");
            button.innerText = "✖️";
            button.addEventListener("click", () => {
                borrarDelCarrito(producto);
            })

            div.append(button);
            carritoProductos.append(div);
        })
    }
    actualizarTotal();

    localStorage.setItem("carrito", JSON.stringify(carrito));
}
actualizarCarrito();

function borrarDelCarrito(producto) {
    const indice = carrito.findIndex((item) => item.id === producto.id);
    carrito.splice(indice, 1);
    actualizarCarrito();
}

function actualizarTotal() {
    const total = carrito.reduce((acc, prod) => acc + (prod.precio * prod.cantidad), 0);
    carritoTotal.innerText = "$" + total.toLocaleString();
}

vaciarCarrito.addEventListener("click", () => {
    const cantidadTotal = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
    Swal.fire({
        title: "¿Eliminar compras?",
        text: "Se van a borrar " + cantidadTotal + " productos.",
        icon: "question",
        showDenyButton: true,
        denyButtonText: "No",
        confirmButtonText: "Sí"
      }).then((result) => {
        if (result.isConfirmed) {
            carrito.length = 0;
            actualizarCarrito();
            Swal.fire({
                icon: "success",
                title: "Carrito vacío",
                showConfirmButton: false,
                timer: 1500
            });
        }
      })
})