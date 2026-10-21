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
    const navbar = document.querySelector(".navbar");
    const hasEnteredSite = sessionStorage.getItem("portfolio_entered");

    if (paperContainer) {
        if (!hasEnteredSite) {
            // Pertama kali buka website di session ini: Jalankan animasi Paper Unfold penuh
            lenis.stop();

            if (navbar) {
                gsap.set(navbar, { opacity: 0 });
            }

            const tl = gsap.timeline({
                onComplete: () => {
                    lenis.start();
                    document.body.style.backgroundColor = "var(--bg-paper)";
                    // Simpan status bahwa user sudah masuk situs
                    sessionStorage.setItem("portfolio_entered", "true");
                    if (navbar) {
                        navbar.style.opacity = "1";
                    }
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

            if (navbar) {
                tl.to(navbar, {
                    opacity: 1,
                    duration: 0.4,
                    ease: "power2.out"
                }, "-=0.3");
            }
        } else {
            // Saat berpindah halaman: Langsung tampilkan koran tanpa menunggu/memutar unfold
            if (navbar) {
                navbar.style.opacity = "1";
            }
            gsap.set(paperContainer, {
                clearProps: "transform,willChange",
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

    // 3. FULLSCREEN MENU TOGGLE DENGAN EFEK AIR CAT MEREMBET (PAINT DRIP LIQUID TRANSITION)
    const openNavBtn = document.getElementById("openNavBtn");
    const closeNavBtn = document.getElementById("closeNavBtn");
    const fullscreenNav = document.getElementById("fullscreenNav");
    const navItems = document.querySelectorAll(".nav-item");
    const navTop = document.querySelector(".nav-top");
    const navSocials = document.querySelector(".nav-socials");

    if (fullscreenNav && openNavBtn) {
        let canvas = document.getElementById("paintDripCanvas");
        if (!canvas) {
            canvas = document.createElement("canvas");
            canvas.id = "paintDripCanvas";
            canvas.className = "paint-drip-canvas";
            fullscreenNav.prepend(canvas);
        }

        const ctx = canvas.getContext("2d");
        let dpr = 1;
        let width = 0;
        let height = 0;
        let drips = [];

        const animState = {
            progress: 0,
            isOpen: false,
            isAnimating: false
        };

        function resizeCanvas() {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);
            canvas.style.width = width + "px";
            canvas.style.height = height + "px";
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            generateDrips();
            render();
        }

        function generateDrips() {
            drips = [];
            const count = Math.max(9, Math.min(22, Math.floor(width / 75)));
            const colWidth = width / count;

            for (let i = 0; i < count; i++) {
                const seed = (i * 1.618) % 1;
                const seed2 = ((i + 3) * 2.718) % 1;
                const seed3 = ((i + 7) * 3.141) % 1;

                const x = i * colWidth + colWidth * 0.5 + (seed - 0.5) * (colWidth * 0.35);
                const dripWidth = Math.max(22, colWidth * (0.35 + seed2 * 0.28));

                let reachMultiplier;
                if (i % 3 === 0) {
                    reachMultiplier = 0.38 + seed3 * 0.26; // Drip panjang
                } else if (i % 3 === 1) {
                    reachMultiplier = 0.22 + seed3 * 0.16; // Drip sedang
                } else {
                    reachMultiplier = 0.12 + seed3 * 0.10; // Drip pendek
                }

                const reach = height * reachMultiplier;
                const delay = seed * 0.12;
                const bulbRadius = dripWidth * 0.55 * (1.1 + seed2 * 0.32);

                drips.push({
                    x,
                    width: dripWidth,
                    reach,
                    delay,
                    bulbRadius,
                    hasDrop: reachMultiplier > 0.32
                });
            }
        }

        function drawPaintLayer(color, progress, reachScale, isAccent) {
            if (progress <= 0.001) return;

            const baseY = -60 + progress * (height + 140);

            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, Math.max(0, baseY));

            let prevRight = 0;

            for (let i = 0; i < drips.length; i++) {
                const d = drips[i];
                const pDrip = Math.max(0, Math.min(1, (progress - d.delay) / (1 - d.delay)));
                const stretch = Math.min(1, Math.pow(pDrip, 1.4) * 1.35);
                const tipY = baseY + d.reach * stretch * reachScale;
                const bulbR = d.bulbRadius * (0.75 + stretch * 0.35);

                const shoulderW = d.width * 0.85;
                const neckW = d.width * (0.42 - stretch * 0.08);

                let leftShX = Math.max(0, d.x - shoulderW);
                const rightShX = Math.min(width, d.x + shoulderW);

                if (leftShX < prevRight) {
                    leftShX = (prevRight + d.x) * 0.5;
                }

                // Lengkungan permukaan cairan (surface tension meniscus) antar lelehan
                if (i === 0) {
                    ctx.quadraticCurveTo(leftShX * 0.5, Math.max(0, baseY - 8), leftShX, baseY);
                } else {
                    const midX = (prevRight + leftShX) * 0.5;
                    const valleyW = leftShX - prevRight;
                    const archLift = Math.min(22, Math.max(4, valleyW * 0.2));
                    ctx.quadraticCurveTo(midX, Math.max(0, baseY - archLift), leftShX, baseY);
                }

                const leftNeckX = d.x - neckW;
                const rightNeckX = d.x + neckW;
                const bulbLeftX = d.x - bulbR;
                const bulbRightX = d.x + bulbR;

                const stemHeight = tipY - baseY;

                if (stemHeight < 6) {
                    ctx.lineTo(d.x, baseY);
                } else {
                    const neckY = baseY + stemHeight * 0.52;

                    ctx.lineTo(leftShX, baseY);
                    ctx.bezierCurveTo(
                        leftShX, baseY + stemHeight * 0.28,
                        leftNeckX, neckY - stemHeight * 0.2,
                        leftNeckX, neckY
                    );

                    ctx.bezierCurveTo(
                        leftNeckX, neckY + stemHeight * 0.25,
                        bulbLeftX, tipY - bulbR * 0.4,
                        bulbLeftX, tipY
                    );

                    ctx.bezierCurveTo(
                        bulbLeftX, tipY + bulbR * 1.35,
                        bulbRightX, tipY + bulbR * 1.35,
                        bulbRightX, tipY
                    );

                    ctx.bezierCurveTo(
                        bulbRightX, tipY - bulbR * 0.4,
                        rightNeckX, neckY + stemHeight * 0.25,
                        rightNeckX, neckY
                    );

                    ctx.bezierCurveTo(
                        rightNeckX, neckY - stemHeight * 0.2,
                        rightShX, baseY + stemHeight * 0.28,
                        rightShX, baseY
                    );
                }
                prevRight = rightShX;
            }

            ctx.quadraticCurveTo((prevRight + width) * 0.5, Math.max(0, baseY - 8), width, Math.max(0, baseY));
            ctx.lineTo(width, 0);
            ctx.closePath();
            ctx.fill();

            // Tetesan air cat yang jatuh mendahului aliran (Detached falling droplets)
            for (let i = 0; i < drips.length; i++) {
                const d = drips[i];
                if (!d.hasDrop) continue;

                const pDrip = Math.max(0, Math.min(1, (progress - d.delay) / (1 - d.delay)));
                if (pDrip > 0.22 && pDrip < 0.92) {
                    const dropProgress = (pDrip - 0.22) / 0.7;
                    const dropStretch = Math.min(1, Math.pow(pDrip, 1.4) * 1.35);
                    const tipY = baseY + d.reach * dropStretch * reachScale;
                    const dropY = tipY + 25 + Math.pow(dropProgress, 1.8) * (height * 0.38);

                    if (dropY < height + 40 && dropY > baseY) {
                        const dropR = Math.max(3, d.bulbRadius * 0.32 * (1 - dropProgress * 0.3));
                        ctx.beginPath();
                        ctx.ellipse(d.x, dropY, dropR * 0.85, dropR * 1.15, 0, 0, Math.PI * 2);
                        ctx.fill();

                        if (dropProgress > 0.35 && dropProgress < 0.8) {
                            const satY = dropY + dropR * 2.5;
                            if (satY < height + 40) {
                                ctx.beginPath();
                                ctx.arc(d.x, satY, dropR * 0.45, 0, Math.PI * 2);
                                ctx.fill();
                            }
                        }
                    }
                }
            }

            // Kilau basah (wet gloss specular highlight) pada ujung tetesan cat
            if (!isAccent && progress > 0.15 && progress < 0.95) {
                ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
                for (let i = 0; i < drips.length; i++) {
                    const d = drips[i];
                    const pDrip = Math.max(0, Math.min(1, (progress - d.delay) / (1 - d.delay)));
                    const stretch = Math.min(1, Math.pow(pDrip, 1.4) * 1.35);
                    const tipY = baseY + d.reach * stretch * reachScale;
                    const stemHeight = tipY - baseY;

                    if (stemHeight > 20 && tipY < height + 50) {
                        const bulbR = d.bulbRadius * (0.75 + stretch * 0.35);
                        ctx.beginPath();
                        ctx.arc(d.x - bulbR * 0.3, tipY - bulbR * 0.15, bulbR * 0.28, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }
        }

        function render() {
            ctx.clearRect(0, 0, width, height);

            const p = animState.progress;
            if (p <= 0.0001) return;

            if (p >= 0.999) {
                ctx.fillStyle = "#1C1C19";
                ctx.fillRect(0, 0, width, height);
                return;
            }

            // Hanya 1 warna: Tinta hitam koran (#1C1C19) tanpa aksen oranye
            drawPaintLayer("#1C1C19", p, 1.0, false);
        }

        window.addEventListener("resize", () => {
            resizeCanvas();
        });

        resizeCanvas();

        // Inisialisasi awal elemen menu agar tersembunyi dengan benar
        gsap.set(navItems, { yPercent: 120, opacity: 0 });
        if (navTop) gsap.set(navTop, { y: -25, opacity: 0 });
        if (navSocials) gsap.set(navSocials, { y: 25, opacity: 0 });

        let navTimeline = null;

        function openMenu() {
            if (animState.isAnimating && animState.isOpen) return;
            animState.isOpen = true;
            animState.isAnimating = true;

            if (typeof lenis !== "undefined" && lenis.stop) {
                lenis.stop();
            }

            fullscreenNav.classList.add("active");

            if (navTimeline) navTimeline.kill();

            // Set kondisi awal teks menu sebelum cat merembet
            gsap.set(navItems, { yPercent: 120, opacity: 0, skewY: 4 });
            if (navTop) gsap.set(navTop, { y: -25, opacity: 0 });
            if (navSocials) gsap.set(navSocials, { y: 25, opacity: 0 });

            navTimeline = gsap.timeline({
                onComplete: () => {
                    animState.isAnimating = false;
                }
            });

            // 1. Animasi cat merembet ke bawah (dipercepat & dinamis)
            navTimeline.to(animState, {
                progress: 1,
                duration: 0.75,
                ease: "power2.out",
                onUpdate: render
            }, 0);

            // 2. Munculkan teks Navigasi lebih cepat sesudah menu terbuka (HOME, PROFILE, ABOUT)
            if (navTop) {
                navTimeline.to(navTop, {
                    y: 0,
                    opacity: 1,
                    duration: 0.35,
                    ease: "power3.out"
                }, 0.20);
            }

            navTimeline.to(navItems, {
                yPercent: 0,
                opacity: 1,
                skewY: 0,
                duration: 0.42,
                stagger: 0.07,
                ease: "power3.out",
                onComplete: () => {
                    gsap.set(navItems, { clearProps: "skewY" });
                }
            }, 0.24);

            if (navSocials) {
                navTimeline.to(navSocials, {
                    y: 0,
                    opacity: 1,
                    duration: 0.35,
                    ease: "power3.out"
                }, 0.38);
            }
        }

        function closeMenu(onFinished) {
            if (animState.isAnimating && !animState.isOpen) return;
            animState.isOpen = false;
            animState.isAnimating = true;

            if (navTimeline) navTimeline.kill();

            navTimeline = gsap.timeline({
                onComplete: () => {
                    fullscreenNav.classList.remove("active");
                    animState.progress = 0;
                    render();
                    animState.isAnimating = false;
                    if (typeof lenis !== "undefined" && lenis.start) {
                        lenis.start();
                    }
                    if (typeof onFinished === "function") onFinished();
                }
            });

            // Sembunyikan tulisan dengan cepat ke bawah
            navTimeline.to(navItems, {
                yPercent: 120,
                opacity: 0,
                duration: 0.25,
                stagger: 0.04,
                ease: "power2.in"
            }, 0);

            const outElements = [navTop, navSocials].filter(Boolean);
            if (outElements.length > 0) {
                navTimeline.to(outElements, {
                    opacity: 0,
                    duration: 0.2,
                    ease: "power2.in"
                }, 0);
            }

            // Cat ditarik kembali ke atas
            navTimeline.to(animState, {
                progress: 0,
                duration: 0.5,
                ease: "power2.inOut",
                onUpdate: render
            }, 0.12);
        }

        openNavBtn.addEventListener("click", () => {
            openMenu();
        });

        if (closeNavBtn) {
            closeNavBtn.addEventListener("click", () => {
                closeMenu();
            });
        }

        // Tutup menu saat menekan tombol Escape di keyboard
        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && animState.isOpen) {
                closeMenu();
            }
        });

        // Interaksi klik pada item menu
        if (navItems.length > 0) {
            navItems.forEach((item) => {
                item.addEventListener("click", (e) => {
                    const href = item.getAttribute("href");
                    const currentPath = window.location.pathname.split("/").pop() || "index.html";

                    // Jika mengklik halaman yang sedang aktif dibuka
                    if (href === currentPath || (href === "index.html" && currentPath === "")) {
                        e.preventDefault();
                        closeMenu();
                    }
                });
            });
        }
    }

    // 4. SMART NAVBAR (HIDE ON SCROLL DOWN, REVEAL ON SCROLL UP)
    if (navbar) {
        let lastScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
        let isNavHidden = false;

        const handleNavbarScroll = (currentY, direction) => {
            // Jika berada di dekat bagian paling atas (<= 25px)
            if (currentY <= 25) {
                if (isNavHidden) {
                    navbar.classList.remove("nav-hidden");
                    isNavHidden = false;
                }
                navbar.classList.remove("nav-scrolled");
                return;
            }

            // Tambahkan shadow paper saat halaman discroll
            navbar.classList.add("nav-scrolled");

            // Direction: > 0 = scroll ke bawah, < 0 = scroll ke atas
            if (direction > 0 && currentY > 80) {
                // Scroll ke bawah: sembunyikan navbar (tertinggal di atas)
                if (!isNavHidden) {
                    navbar.classList.add("nav-hidden");
                    isNavHidden = true;
                }
            } else if (direction < 0) {
                // Scroll ke atas: langsung tampilkan navbar kembali
                if (isNavHidden) {
                    navbar.classList.remove("nav-hidden");
                    isNavHidden = false;
                }
            }
        };

        // Integrasi dengan Lenis smooth scroll
        if (typeof lenis !== "undefined") {
            lenis.on("scroll", (e) => {
                handleNavbarScroll(e.scroll, e.direction);
                lastScrollY = e.scroll;
            });
        }

        // Fallback untuk native window scroll
        window.addEventListener("scroll", () => {
            const currentY = window.pageYOffset || document.documentElement.scrollTop || 0;
            const diff = currentY - lastScrollY;
            if (Math.abs(diff) > 3) {
                handleNavbarScroll(currentY, diff > 0 ? 1 : -1);
                lastScrollY = currentY;
            }
        }, { passive: true });
    }

    // 5. INTERACTIVE 3-PHOTO PROFILE SWITCHER
    // Tiga foto profil asli Fathul Aziz Saifuddin dengan status awal berbeda di setiap halaman
    const profilePhotos = [
        "images/profile/profil-0.webp",
        "images/profile/profil-1.webp",
        "images/profile/profil-2.webp"
    ];

    // Preload ketiga foto agar pergantian foto instan tanpa jeda
    profilePhotos.forEach((src) => {
        const img = new Image();
        img.src = src;
    });

    const profileWrappers = document.querySelectorAll(".interactive-profile-wrapper");
    profileWrappers.forEach((wrapper) => {
        const switchPhoto = () => {
            const img = wrapper.querySelector(".interactive-profile-img") || wrapper.querySelector("img");
            if (!img) return;

            let curIdx = parseInt(img.getAttribute("data-profile-index"));
            if (isNaN(curIdx)) curIdx = 0;
            const nextIdx = (curIdx + 1) % profilePhotos.length;

            // Transisi fade-out halus
            img.classList.add("is-switching");

            setTimeout(() => {
                img.src = profilePhotos[nextIdx];
                img.setAttribute("data-profile-index", nextIdx.toString());

                // Transisi fade-in
                img.classList.remove("is-switching");
            }, 140);
        };

        wrapper.addEventListener("click", switchPhoto);
        wrapper.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                switchPhoto();
            }
        });
    });

    // 6. DRAGGABLE CAROUSEL DENGAN EFEK VELOCITY SKEW (Halaman index.html)
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

    // 5. INTERACTIVE BOOKSHELF ACCORDION & VIEW MODE TOGGLE (Halaman profile.html & work.html)
    const spines = document.querySelectorAll(".book-spine");
    const bookshelfContainer = document.getElementById("bookshelfContainer");
    const projectsShelfContainer = document.getElementById("projectsShelfContainer");
    const projectBookCards = document.querySelectorAll(".project-book-card");
    const viewShelfBtn = document.getElementById("viewShelfBtn");
    const viewGridBtn = document.getElementById("viewGridBtn");

    // Interaktivitas Horizontal Bookshelf Proyek (Rak Kesamping)
    // Hover: buku terseleksi visual & terangkat sesuai tema (ditangani via CSS :hover)
    // Klik: membuka buku proyek menjadi aktif
    if (projectBookCards.length > 0) {
        projectBookCards.forEach((card) => {
            card.addEventListener("click", (e) => {
                // Jika sedang dalam Grid mode, biarkan kartu terbuka biasa
                if (projectsShelfContainer && projectsShelfContainer.classList.contains("grid-mode")) return;
                
                // Jangan cegah klik jika pengguna mengklik link tombol Source Code atau Demo
                if (e.target.closest("a") || e.target.closest("button")) return;

                // Buka buku yang diklik, tutup buku lainnya
                projectBookCards.forEach((c) => c.classList.remove("active"));
                card.classList.add("active");
            });
        });
    }

    // Interaktivitas Vertical Bookshelf Arsip Pengalaman (Lipatan Keatas-Bawah)
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

    // Tombol ganti mode tampilan: Bookshelf vs Grid (Mengontrol Proyek & Arsip Sekaligus)
    if (viewShelfBtn && viewGridBtn) {
        viewShelfBtn.addEventListener("click", () => {
            if (bookshelfContainer) bookshelfContainer.classList.remove("grid-mode");
            if (projectsShelfContainer) projectsShelfContainer.classList.remove("grid-mode");
            viewShelfBtn.classList.add("active");
            viewGridBtn.classList.remove("active");
        });

        viewGridBtn.addEventListener("click", () => {
            if (bookshelfContainer) bookshelfContainer.classList.add("grid-mode");
            if (projectsShelfContainer) projectsShelfContainer.classList.add("grid-mode");
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