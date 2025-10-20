// This module is self-contained. It creates, styles, and manages the loading and success popups.

let popupElement = null;
let currentPopupType = null; // 'loading' or 'success'

function createPopup(type, message, iconHtml) {
    // If popup already exists, just update content if the type is the same.
    if (popupElement && currentPopupType === type) {
        popupElement.querySelector('.popup-content').innerHTML = iconHtml + `<p class="popup-message">${message}</p>`;
        return;
    }

    // If a popup of a different type exists, remove it instantly.
    if (popupElement) {
        hidePopup(0);
    }

    // 1. Create Overlay
    const overlay = document.createElement('div');
    overlay.id = 'dl-popup-overlay';
    overlay.className = 'dl-popup-overlay';

    // 2. Create Popup Card
    const card = document.createElement('div');
    card.className = 'dl-popup-card';

    // 3. Create Close Button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&times;';
    closeButton.className = 'btn-close popup-close-btn';
    closeButton.setAttribute('aria-label', 'Close');
    closeButton.addEventListener('click', () => hidePopup());

    // 4. Create Content Area
    const contentArea = document.createElement('div');
    contentArea.className = 'popup-content';
    contentArea.innerHTML = iconHtml + `<p class="popup-message">${message}</p>`;

    // 5. Assemble and append to body
    card.appendChild(closeButton);
    card.appendChild(contentArea);
    overlay.appendChild(card);
    document.body.appendChild(overlay);

    popupElement = overlay;
    currentPopupType = type;

    // Add Escape key listener
    document.addEventListener('keydown', handleEscapeKey);
}

function handleEscapeKey(event) {
    if (event.key === 'Escape') {
        hidePopup();
    }
}

function showPopup() {
    if (!popupElement) return;

    // Use a short timeout to ensure the element is in the DOM before starting the transition
    setTimeout(() => {
        popupElement.classList.add('visible');
    }, 10);
}

function hidePopup(delay = 300) {
    if (popupElement) {
        popupElement.classList.remove('visible');
        
        // Remove the element from the DOM after the transition is complete
        setTimeout(() => {
            if (popupElement) {
                popupElement.remove();
                popupElement = null;
                currentPopupType = null;
                document.removeEventListener('keydown', handleEscapeKey);
            }
        }, delay);
    }
}

export function showLoadingPopup() {
    const downloadIconHtml = `
        <div class="download-animation">
            <svg class="download-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path class="arrow" d="M12 5V15M12 15L8 11M12 15L16 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path class="tray" d="M4 18H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
        </div>
    `;
    createPopup('loading', 'Your PDF will be downloaded shortly.', downloadIconHtml);
    showPopup();
}

export { hidePopup };
