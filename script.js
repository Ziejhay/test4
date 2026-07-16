const themes = ["indigo", "emerald", "rose"];
let currentTheme = localStorage.getItem("zc-theme") || "indigo";

function applyTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem("zc-theme", themeName);
    currentTheme = themeName;
}

function cycleTheme() {
    const nextIndex = (themes.indexOf(currentTheme) + 1) % themes.length;
    applyTheme(themes[nextIndex]);
}

applyTheme(currentTheme);

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    setDynamicGreeting();
    updatePHTTime();
    setInterval(updatePHTTime, 1000);
    
    setTimeout(() => {
        const loader = document.getElementById('loadingScreen');
        loader.classList.add('opacity-0');
        setTimeout(() => {
            loader.style.display = 'none';
            document.body.classList.remove('overflow-hidden');
            document.getElementById('greetingText').classList.remove('opacity-0');
            document.getElementById('dateTimeWidget').classList.remove('opacity-0');
            document.getElementById('logoWidget').classList.remove('opacity-0');
        }, 700);
    }, 1500);
});

function updatePHTTime() {
    const now = new Date();
    const timeOptions = { timeZone: 'Asia/Manila', hour: '2-digit', minute: '2-digit', hour12: true };
    const dateOptions = { timeZone: 'Asia/Manila', weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    document.getElementById('liveTime').innerText = now.toLocaleTimeString('en-US', timeOptions);
    document.getElementById('liveDate').innerText = now.toLocaleDateString('en-US', dateOptions);
}

function setDynamicGreeting() {
    const phtString = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila', hour: 'numeric', hour12: false });
    const hour = parseInt(phtString, 10);
    let greeting = "Welcome";
    if (hour >= 0 && hour < 12) greeting = "Good Morning";
    else if (hour >= 12 && hour < 17) greeting = "Good Afternoon";
    else greeting = "Good Evening";
    document.getElementById('greetingText').innerText = greeting;
}

let modalRedirectUrl = "";

function openAuthModal(targetUrl, itemName) {
    modalRedirectUrl = targetUrl;
    document.getElementById('targetItemName').innerText = itemName;
    const modal = document.getElementById('authModal');
    const card = document.getElementById('modalCard');
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        card.classList.remove('scale-95', 'opacity-0');
    }, 10);
    document.getElementById('modalPasscode').focus();
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    const card = document.getElementById('modalCard');
    modal.classList.add('opacity-0');
    card.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
        document.getElementById('modalPasscode').value = '';
        document.getElementById('modalError').classList.add('hidden');
        modalRedirectUrl = "";
    }, 300);
}

// SECURE BACKEND AUTHENTICATION BLOCK
document.getElementById('modalForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const modalPassInput = document.getElementById('modalPasscode').value;
    const modalError = document.getElementById('modalError');

    try {
        const response = await fetch('/api/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                password: modalPassInput, 
                targetUrl: modalRedirectUrl 
            })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            modalError.classList.add('hidden');
            window.location.href = data.redirect;
        } else {
            modalError.classList.remove('hidden');
            document.getElementById('modalPasscode').value = '';
            document.getElementById('modalPasscode').focus();
        }
    } catch (error) {
        console.error('Security validation error:', error);
        modalError.classList.remove('hidden');
    }
});
