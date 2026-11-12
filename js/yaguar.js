
/* =========================================================
   YAGUAR TOURS
   JAVASCRIPT GENERAL
   Navegación, animaciones y efectos visuales
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const movimientoReducido = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    /* =====================================================
       1. AÑO AUTOMÁTICO
    ===================================================== */

    document.querySelectorAll("[data-year]").forEach(elemento => {
        elemento.textContent = new Date().getFullYear();
    });


    /* =====================================================
       2. MENÚ ACTIVO SEGÚN LA PÁGINA
    ===================================================== */

    const enlacesMenu = document.querySelectorAll(".nav-links a");

    const obtenerPagina = ruta => {
        try {
            const url = new URL(ruta, window.location.href);
            const nombre = url.pathname.split("/").pop();
            return nombre || "index.html";
        } catch {
            return "";
        }
    };

    const paginaActual = obtenerPagina(window.location.href);

    enlacesMenu.forEach(enlace => {
        const paginaEnlace = obtenerPagina(enlace.href);
        const activo = paginaEnlace === paginaActual;

        enlace.classList.toggle("active", activo);

        if (activo) {
            enlace.setAttribute("aria-current", "page");
        } else {
            enlace.removeAttribute("aria-current");
        }
    });


    /* =====================================================
       3. HEADER DINÁMICO AL HACER SCROLL
    ===================================================== */

    const navbar = document.querySelector(".navbar");

    const actualizarNavbar = () => {
        if (!navbar) return;

        navbar.classList.toggle(
            "navbar-scroll",
            window.scrollY > 40
        );
    };

    actualizarNavbar();

    window.addEventListener("scroll", actualizarNavbar, {
        passive: true
    });


    /* =====================================================
       4. ANIMACIONES AL ENTRAR EN PANTALLA
    ===================================================== */

    const selectoresAnimacion = [
        ".inicio-presentacion-imagen",
        ".inicio-presentacion-info",
        ".inicio-esencia-card",
        ".inicio-mensaje-info",
        ".inicio-mensaje-imagen",
        ".inicio-explora-card",

        ".identidad-empresa-grid",
        ".visual-concepto-grid",
        ".institucional-percepcion-grid",

        ".aplicacion-card",
        ".canal-card",
        ".diagnostico-card",
        ".propuesta-card",
        ".plan-card",
        ".resultado-card",

        ".pc-section",
        ".pc-panel",
        ".pc-foda-item",
        ".pc-audience-card",
        ".pc-highlight",
        ".pc-table-wrap"
    ];

    const elementosAnimados = document.querySelectorAll(
        selectoresAnimacion.join(",")
    );

    if (
        !movimientoReducido &&
        "IntersectionObserver" in window
    ) {

        // Ocultar solo cuando existe soporte de animación.
        elementosAnimados.forEach(elemento => {
            elemento.classList.add("yaguar-reveal");
        });

        const observador = new IntersectionObserver(
            (entradas, observer) => {

                entradas.forEach(entrada => {

                    if (!entrada.isIntersecting) return;

                    entrada.target.classList.add(
                        "yaguar-visible"
                    );

                    observer.unobserve(entrada.target);

                });

            },
            {
                threshold: 0.08,
                rootMargin: "0px 0px -30px 0px"
            }
        );

        elementosAnimados.forEach(elemento => {
            observador.observe(elemento);
        });

    } else {

        elementosAnimados.forEach(elemento => {
            elemento.classList.add("yaguar-visible");
        });

    }


    /* =====================================================
       5. ANIMACIÓN ESCALONADA DE TARJETAS
    ===================================================== */

    const gruposTarjetas = document.querySelectorAll(`
        .inicio-esencia-grid,
        .inicio-explora-grid,
        .diagnostico-grid,
        .propuestas-grid,
        .plan-grid,
        .resultado-grid,
        .pc-foda,
        .pc-grid-2
    `);

    gruposTarjetas.forEach(grupo => {

        Array.from(grupo.children).forEach(
            (tarjeta, indice) => {

                const retraso = Math.min(indice * 90, 450);

                tarjeta.style.setProperty(
                    "--delay",
                    `${retraso}ms`
                );

            }
        );

    });


    /* =====================================================
       6. SCROLL SUAVE PARA ENLACES INTERNOS
    ===================================================== */

    document.querySelectorAll('a[href^="#"]').forEach(
        enlace => {

            enlace.addEventListener("click", evento => {

                const destinoId = enlace.getAttribute("href");

                if (!destinoId || destinoId === "#") return;

                const destino = document.getElementById(
                    destinoId.substring(1)
                );

                if (!destino) return;

                evento.preventDefault();

                destino.scrollIntoView({
                    behavior: movimientoReducido
                        ? "auto"
                        : "smooth",
                    block: "start"
                });

                if (window.history.replaceState) {
                    window.history.replaceState(
                        null,
                        "",
                        destinoId
                    );
                }

            });

        }
    );


    /* =====================================================
       7. EFECTO DE CARGA DEL HERO PRINCIPAL
    ===================================================== */

    const elementosHero = document.querySelectorAll(`
        .inicio-hero-info,
        .inicio-hero-card,
        .inicio-hero-experiencia,
        .pc-hero-inner
    `);

    elementosHero.forEach((elemento, indice) => {

        const mostrar = () => {
            elemento.classList.add("inicio-hero-cargado");
        };

        if (movimientoReducido) {
            mostrar();
        } else {
            window.setTimeout(
                mostrar,
                indice * 140
            );
        }

    });


    /* =====================================================
       8. ÍNDICE ACTIVO DEL PLAN DE COMUNICACIÓN
    ===================================================== */

    const enlacesIndice = document.querySelectorAll(
        '.pc-sidebar a[href^="#"]'
    );

    const seccionesIndice = Array.from(enlacesIndice)
        .map(enlace => {

            const id = enlace.getAttribute("href").slice(1);

            return {
                enlace,
                seccion: document.getElementById(id)
            };

        })
        .filter(item => item.seccion);

    const actualizarIndice = () => {

        if (!seccionesIndice.length) return;

        const posicion = window.scrollY + 160;

        let seccionActual = seccionesIndice[0];

        seccionesIndice.forEach(item => {

            const inicio = item.seccion.getBoundingClientRect().top
                + window.scrollY;

            if (inicio <= posicion) {
                seccionActual = item;
            }

        });

        seccionesIndice.forEach(item => {

            const activo = item === seccionActual;

            item.enlace.classList.toggle(
                "pc-indice-activo",
                activo
            );

            if (activo) {
                item.enlace.setAttribute("aria-current", "location");
            } else {
                item.enlace.removeAttribute("aria-current");
            }

        });

    };

    if (seccionesIndice.length) {

        actualizarIndice();

        window.addEventListener(
            "scroll",
            actualizarIndice,
            { passive: true }
        );

        window.addEventListener(
            "resize",
            actualizarIndice
        );

    }


    /* =====================================================
       9. BOTÓN PARA VOLVER ARRIBA
    ===================================================== */

    const botonArriba = document.querySelector(
        "[data-volver-arriba]"
    );

    if (botonArriba) {

        const actualizarBoton = () => {

            const visible = window.scrollY > 400;

            botonArriba.classList.toggle(
                "mostrar",
                visible
            );

            botonArriba.setAttribute(
                "aria-hidden",
                String(!visible)
            );

            botonArriba.tabIndex = visible ? 0 : -1;

        };

        actualizarBoton();

        window.addEventListener(
            "scroll",
            actualizarBoton,
            { passive: true }
        );

        botonArriba.addEventListener("click", () => {

            window.scrollTo({
                top: 0,
                behavior: movimientoReducido
                    ? "auto"
                    : "smooth"
            });

        });

    }


    /* =====================================================
       10. IMÁGENES CON CARGA DIFERIDA
    ===================================================== */

    document.querySelectorAll(
        "main img:not([loading])"
    ).forEach(imagen => {

        // Mantener la carga inmediata de las imágenes hero.
        if (
            imagen.closest(
                ".inicio-hero, .pc-hero, .page-hero"
            )
        ) return;

        imagen.setAttribute("loading", "lazy");
        imagen.setAttribute("decoding", "async");

    });

});
