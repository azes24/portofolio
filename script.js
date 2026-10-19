document.addEventListener("DOMContentLoaded", () => {

    // 1. INISIALISASI LENIS SMOOTH SCROLL
    const lenis = new Lenis({
        duration: 1.25,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // 2. ANIMASI PEMBUKA "PAPER UNFOLD" (HANYA SAAT PERTAMA KALI MASUK WEBSITE)
    // Menggunakan sessionStorage agar saat berpindah halaman (Home, Profile, About), animasi pembuka tidak berulang
    const paperContainer = document.getElementById("paper-container");
    const hasEnteredSite = sessionStorage.getItem("portfolio_entered");

    if (paperContainer) {
        if (!hasEnteredSite) {
            // Pertama kali buka website di session ini: Jalankan animasi Paper Unfold penuh
            lenis.stop();

            const tl = gsap.timeline({
                onComplete: () => {
                    lenis.start();
                    document.body.style.backgroundColor = "var(--bg-paper)";
                    // Simpan status bahwa user sudah masuk situs
                    sessionStorage.setItem("portfolio_entered", "true");
                }
            });

            tl.set(paperContainer, {
                y: "100vh",
                scale: 0.45,
                rotation: 0,
                opacity: 1
            })
            .to(paperContainer, {
                y: "0vh",
                duration: 1.1,
                ease: "power3.out"
            })
            .to(paperContainer, {
                rotation: -360,
                scale: 1,
                duration: 1.35,
                ease: "power4.inOut"
            });
        } else {
            // Saat berpindah halaman: Langsung tampilkan koran tanpa menunggu/memutar unfold
            gsap.set(paperContainer, {
                y: "0vh",
                scale: 1,
                rotation: 0,
                opacity: 1
            });
            document.body.style.backgroundColor = "var(--bg-paper)";
            lenis.start();

            // Transisi halus dan cepat untuk kenyamanan navigasi
            gsap.fromTo(paperContainer, 
                { opacity: 0.85 }, 
                { opacity: 1, duration: 0.25, ease: "power2.out" }
            );
        }
    }

    // 3. FULLSCREEN MENU TOGGLE
    const openNavBtn = document.getElementById("openNavBtn");
    const closeNavBtn = document.getElementById("closeNavBtn");
    const fullscreenNav = document.getElementById("fullscreenNav");
    const navItems = document.querySelectorAll(".nav-item");

    if (openNavBtn && fullscreenNav) {
        openNavBtn.addEventListener("click", () => {
            fullscreenNav.classList.add("active");
        });
    }

    if (closeNavBtn && fullscreenNav) {
        closeNavBtn.addEventListener("click", () => {
            fullscreenNav.classList.remove("active");
        });
    }

    if (navItems.length > 0 && fullscreenNav) {
        navItems.forEach((item) => {
            item.addEventListener("click", () => {
                fullscreenNav.classList.remove("active");
            });
        });
    }

    // 4. DRAGGABLE CAROUSEL DENGAN EFEK VELOCITY SKEW (Halaman index.html)
    const viewport = document.getElementById("carouselViewport");
    const track = document.getElementById("carouselTrack");
    const cards = document.querySelectorAll(".slide-card");

    let isDown = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let lastMouseX = 0;
    let velocity = 0;

    if (viewport && track) {
        const getPositionX = (e) => e.type.includes('touch') ? e.touches[0].clientX : e.pageX;

        const handleDragStart = (e) => {
            isDown = true;
            startX = getPositionX(e);
            lastMouseX = startX;
        };

        const handleDragEnd = () => {
            if (!isDown) return;
            isDown = false;
            prevTranslate = currentTranslate;

            // Kembalikan kemiringan kartu ke normal saat dilepas
            if (cards.length > 0) {
                gsap.to(cards, {
                    skewX: 0,
                    duration: 0.4,
                    ease: "power2.out"
                });
            }
        };

        const handleDragMove = (e) => {
            if (!isDown) return;

            const currentX = getPositionX(e);
            const deltaX = currentX - startX;
            velocity = currentX - lastMouseX;
            lastMouseX = currentX;

            // Batasi agar slider tidak keluar jalur terlalu jauh
            const maxScroll = -(track.scrollWidth - viewport.clientWidth);
            currentTranslate = Math.max(Math.min(prevTranslate + deltaX, 0), maxScroll);

            gsap.to(track, {
                x: currentTranslate,
                duration: 0.25,
                ease: "power2.out"
            });

            // Efek miring (skew) proporsional terhadap kecepatan drag kursor
            if (cards.length > 0) {
                const skewAmount = Math.max(Math.min(velocity * 0.2, 7), -7);
                gsap.to(cards, {
                    skewX: skewAmount,
                    duration: 0.2,
                    ease: "power1.out"
                });
            }
        };

        // Mouse events
        viewport.addEventListener("mousedown", handleDragStart);
        window.addEventListener("mouseup", handleDragEnd);
        window.addEventListener("mousemove", (e) => {
            if (!isDown) return;
            e.preventDefault();
            handleDragMove(e);
        });

        // Touch events untuk Mobile HP
        viewport.addEventListener("touchstart", handleDragStart, { passive: true });
        window.addEventListener("touchend", handleDragEnd);
        window.addEventListener("touchmove", (e) => {
            if (!isDown) return;
            handleDragMove(e);
        }, { passive: true });
    }

    // 5. INTERACTIVE BOOKSHELF ACCORDION & VIEW MODE TOGGLE (Halaman work.html)
    const spines = document.querySelectorAll(".book-spine");
    const bookshelfContainer = document.getElementById("bookshelfContainer");
    const viewShelfBtn = document.getElementById("viewShelfBtn");
    const viewGridBtn = document.getElementById("viewGridBtn");

    if (spines.length > 0) {
        spines.forEach((spine) => {
            const header = spine.querySelector(".spine-header");
            if (header) {
                header.addEventListener("click", () => {
                    // Jika sedang mode Grid, tidak perlu buka-tutup accordion
                    if (bookshelfContainer && bookshelfContainer.classList.contains("grid-mode")) return;

                    const isOpen = spine.classList.contains("active");

                    // Tutup semua lipatan koran lain terlebih dahulu
                    spines.forEach((item) => item.classList.remove("active"));

                    // Buka yang diklik jika belum terbuka
                    if (!isOpen) {
                        spine.classList.add("active");
                    }
                });
            }
        });
    }

    // Tombol ganti mode tampilan: Bookshelf vs Grid
    if (viewShelfBtn && viewGridBtn && bookshelfContainer) {
        viewShelfBtn.addEventListener("click", () => {
            bookshelfContainer.classList.remove("grid-mode");
            viewShelfBtn.classList.add("active");
            viewGridBtn.classList.remove("active");
        });

        viewGridBtn.addEventListener("click", () => {
            bookshelfContainer.classList.add("grid-mode");
            viewGridBtn.classList.add("active");
            viewShelfBtn.classList.remove("active");
        });
    }

    // 6. FITUR SHARE LINK WEB & TOAST NOTIFIKASI
    const shareBtns = document.querySelectorAll(".share-web-btn");
    
    function showToast(message) {
        let toast = document.getElementById("shareToast");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "shareToast";
            toast.className = "share-toast";
            toast.innerHTML = `<i class="ri-checkbox-circle-fill"></i> <span id="toastMsg"></span>`;
            document.body.appendChild(toast);
        }
        const toastMsg = toast.querySelector("#toastMsg");
        if (toastMsg) toastMsg.textContent = message;

        toast.classList.add("show");
        setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    }

    if (shareBtns.length > 0) {
        shareBtns.forEach((btn) => {
            btn.addEventListener("click", async (e) => {
                e.preventDefault();
                const shareData = {
                    title: "Fathul Aziz Saifuddin — Portfolio",
                    text: "Portofolio Fathul Aziz Saifuddin (Web Developer & Multimedia Designer)",
                    url: window.location.href
                };

                if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                    try {
                        await navigator.share(shareData);
                    } catch (err) {
                        // User dismissed share dialog
                    }
                } else {
                    // Fallback: Salin tautan ke clipboard
                    try {
                        await navigator.clipboard.writeText(window.location.href);
                        showToast("Tautan portofolio berhasil disalin ke clipboard!");
                    } catch (err) {
                        // Fallback manual jika clipboard API tidak diizinkan
                        const tempInput = document.createElement("input");
                        tempInput.value = window.location.href;
                        document.body.appendChild(tempInput);
                        tempInput.select();
                        document.execCommand("copy");
                        document.body.removeChild(tempInput);
                        showToast("Tautan portofolio berhasil disalin!");
                    }
                }
            });
        });
    }
});