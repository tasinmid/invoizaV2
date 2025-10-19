
let countdownInterval;

function startCountdown() {
    const countdownElement = document.getElementById('countdown-timer');
    if (!countdownElement) return;

    const targetDate = new Date('2025-12-01T00:00:00').getTime();

    const update = () => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            countdownElement.innerHTML = "<span>EXPIRED</span>";
            clearInterval(countdownInterval);
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdownElement.innerHTML = `
            <div><span>${days}</span><p>Days</p></div>
            <div><span>${hours}</span><p>Hours</p></div>
            <div><span>${minutes}</span><p>Mins</p></div>
            <div><span>${seconds}</span><p>Secs</p></div>
        `;
    };

    update();
    countdownInterval = setInterval(update, 1000);
}

function stopCountdown() {
    clearInterval(countdownInterval);
}

export function showPreregModal() {
    const clicked = sessionStorage.getItem('clicked');
    if (clicked === 'true') {
        console.log('Pre-registration modal skipped because it was already handled.');
        return;
    }

    const preregModalElement = document.getElementById('preregModal');
    if (!preregModalElement) return;

    const preregModal = new bootstrap.Modal(preregModalElement);
    const reserveBtn = document.getElementById('reserveSpotBtn');
    const giveUpBtn = document.getElementById('giveUpBtn');

    preregModalElement.addEventListener('shown.bs.modal', () => {
        startCountdown();
        setTimeout(() => {
            giveUpBtn.style.opacity = '1';
            giveUpBtn.style.transform = 'translateY(0)';
        }, 2000);
    });

    preregModalElement.addEventListener('hidden.bs.modal', () => {
        stopCountdown();
    });

    reserveBtn.addEventListener('click', () => {
        sessionStorage.setItem('clicked', 'true');
        preregModal.hide();
        window.open('https://solven.app', '_blank');
    });

    giveUpBtn.addEventListener('click', () => {
        preregModal.hide();
    });

    preregModal.show();
}

export function initPrereg() {
    // This function can be used for any initial setup if needed in the future.
    // For now, we just need to make sure the modal can be triggered.
    console.log('Pre-registration module initialized.');
}
