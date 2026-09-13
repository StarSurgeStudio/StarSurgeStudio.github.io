(function () {
    "use strict";

    var cookieAlert = document.querySelector(".cookiealert");
    var acceptCookies = document.querySelector(".acceptcookies");

    if (!cookieAlert) {
       return;
    }

    cookieAlert.offsetHeight; // Force browser to trigger reflow (https://stackoverflow.com/a/39451131)

    // Show the alert if we cant find the "acceptCookies" cookie
    if (!getCookie("acceptCookies")) {
        cookieAlert.classList.add("show");
    }

    // When clicking on the agree button, create a 1 year
    // cookie to remember user's choice and close the banner
    acceptCookies.addEventListener("click", function () {
        setCookie("acceptCookies", true, 365);
        cookieAlert.classList.remove("show");

        // dispatch the accept event
        window.dispatchEvent(new Event("cookieAlertAccept"))
    });

    // Cookie functions from w3schools
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
})();

(function () {
    "use strict";

    var canvas = document.getElementById('galaxy-canvas');
    if (!canvas) {
        return;
    }

    class Star {
        constructor(canvas) {
            this.canvas = canvas;
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.8 + 0.2;
            this.twinkleSpeed = Math.random() * 0.02 + 0.01;
            this.twinkleDirection = Math.random() > 0.5 ? 1 : -1;
            this.color = this.getStarColor();
        }

        getStarColor() {
            const colors = [
                'rgba(255, 255, 255, 1)',
                'rgba(200, 180, 255, 1)',
                'rgba(180, 160, 255, 1)',
                'rgba(255, 200, 255, 1)',
                'rgba(150, 180, 255, 1)',
                'rgba(255, 220, 150, 1)'
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            this.opacity += this.twinkleSpeed * this.twinkleDirection;
            if (this.opacity >= 1 || this.opacity <= 0.2) {
                this.twinkleDirection *= -1;
            }

            if (this.x < 0) this.x = this.canvas.width;
            if (this.x > this.canvas.width) this.x = 0;
            if (this.y < 0) this.y = this.canvas.height;
            if (this.y > this.canvas.height) this.y = 0;
        }

        draw(ctx) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color.replace('1)', `${this.opacity})`);
            ctx.fill();

            if (this.size > 1.5) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
                const gradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, this.size * 2
                );
                gradient.addColorStop(0, this.color.replace('1)', `${this.opacity * 0.3})`));
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                ctx.fillStyle = gradient;
                ctx.fill();
            }
        }
    }

    class Galaxy {
        constructor() {
            this.canvas = document.getElementById('galaxy-canvas');
            this.ctx = this.canvas.getContext('2d');
            this.stars = [];
            this.mouseX = window.innerWidth / 2;
            this.mouseY = window.innerHeight / 2;
            this.resize();
            this.init();
            this.animate();

            window.addEventListener('resize', () => this.resize());
            window.addEventListener('pointermove', (e) => {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
            }, { passive: true });
            document.addEventListener('pointermove', (e) => {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
            }, { passive: true });
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        init() {
            const starCount = Math.min(150, Math.floor((this.canvas.width * this.canvas.height) / 10000));
            this.stars = [];
            for (let i = 0; i < starCount; i++) {
                this.stars.push(new Star(this.canvas));
            }
        }

        drawNebula() {
            const gradient1 = this.ctx.createRadialGradient(
                this.canvas.width * 0.3, this.canvas.height * 0.4, 0,
                this.canvas.width * 0.3, this.canvas.height * 0.4, this.canvas.width * 0.5
            );
            gradient1.addColorStop(0, 'rgba(100, 50, 150, 0.06)');
            gradient1.addColorStop(0.5, 'rgba(60, 30, 100, 0.03)');
            gradient1.addColorStop(1, 'rgba(0, 0, 0, 0)');

            const gradient2 = this.ctx.createRadialGradient(
                this.canvas.width * 0.7, this.canvas.height * 0.6, 0,
                this.canvas.width * 0.7, this.canvas.height * 0.6, this.canvas.width * 0.4
            );
            gradient2.addColorStop(0, 'rgba(80, 40, 120, 0.05)');
            gradient2.addColorStop(0.5, 'rgba(40, 20, 80, 0.03)');
            gradient2.addColorStop(1, 'rgba(0, 0, 0, 0)');

            this.ctx.fillStyle = gradient1;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            this.ctx.fillStyle = gradient2;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        animate() {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 1)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.drawNebula();

            this.stars.forEach(star => {
                star.update();
                star.draw(this.ctx);
            });

            this.stars.forEach(star => {
                const dx = this.mouseX - star.x;
                const dy = this.mouseY - star.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const influenceRadius = 180;
                if (distance < influenceRadius) {
                    const force = (influenceRadius - distance) / influenceRadius;
                    const drift = 0.08;
                    star.x += (dx / (distance || 1)) * force * drift * 18;
                    star.y += (dy / (distance || 1)) * force * drift * 18;
                }
            });

            requestAnimationFrame(() => this.animate());
        }
    }

    function initGalaxy() {
        if (!document.getElementById('galaxy-canvas')) {
            return;
        }

        if (window.__starSurgeGalaxy) {
            return;
        }

        window.__starSurgeGalaxy = new Galaxy();
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initGalaxy();
    } else {
        window.addEventListener('load', initGalaxy, { once: true });
    }
})();
