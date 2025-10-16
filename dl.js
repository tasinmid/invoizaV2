// This module is self-contained. It creates, styles, and manages the loading and success popups.

let popupElement = null;
let currentPopupType = null; // 'loading' or 'success'

function createPopup(type, message, iconHtml) {
    // If popup already exists and is of the same type, just update content
    if (popupElement && currentPopupType === type) {
        popupElement.querySelector('.popup-content').innerHTML = iconHtml + `<p>${message}</p>`;
        return;
    }

    // If popup exists but is of a different type, remove it first
    if (popupElement) {
        hidePopup(0); // Hide immediately
    }

    // 1. Create Overlay
    const overlay = document.createElement('div');
    overlay.id = 'dl-popup-overlay';
    Object.assign(overlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: '9999',
        opacity: '0',
        transition: 'opacity 0.3s ease'
    });

    // 2. Create Popup Card
    const card = document.createElement('div');
    Object.assign(card.style, {
        position: 'relative', // For positioning the close button
        padding: '40px 50px',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        textAlign: 'center',
        transform: 'scale(0.8)',
        transition: 'transform 0.3s ease',
        maxWidth: '90%',
        boxSizing: 'border-box'
    });

    // 3. Create Close Button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&times;'; // 'x' icon
    Object.assign(closeButton.style, {
        position: 'absolute',
        top: '10px',
        right: '15px',
        background: 'none',
        border: 'none',
        fontSize: '2rem',
        color: '#333',
        cursor: 'pointer',
        lineHeight: '1',
        padding: '5px 10px',
        // Prevent blue box on touch
        '-webkit-tap-highlight-color': 'transparent',
        'tap-highlight-color': 'transparent',
        outline: 'none'
    });
    closeButton.addEventListener('click', hidePopup);

    // 4. Create Content Area
    const contentArea = document.createElement('div');
    contentArea.classList.add('popup-content');
    contentArea.innerHTML = iconHtml + `<p style="margin-top: 20px; font-size: 18px; color: #2E073F; font-weight: 500; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;">${message}</p>`;

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
    if (!popupElement) return; // Should not happen if createPopup is called first

    // Use a short timeout to ensure the element is in the DOM before starting the transition
    setTimeout(() => {
        popupElement.style.opacity = '1';
        popupElement.querySelector('div').style.transform = 'scale(1)';
    }, 10);
}

function hidePopup(delay = 300) {
    if (popupElement) {
        popupElement.style.opacity = '0';
        popupElement.querySelector('div').style.transform = 'scale(0.8)';
        
        // Remove the element from the DOM after the transition is complete
        setTimeout(() => {
            if (popupElement) {
                popupElement.remove();
                popupElement = null;
                currentPopupType = null;
                document.removeEventListener('keydown', handleEscapeKey);
            }
        }, delay); // Must match the transition duration
    }
}

export function showLoadingPopup() {
    const successIconHtml = `
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM16.7071 9.29289C17.0976 8.90237 17.0976 8.26921 16.7071 7.87868C16.3166 7.48816 15.6834 7.48816 15.2929 7.87868L10.0001 13.1716L8.29291 11.4645C7.90239 11.0739 7.26922 11.0739 6.87870 11.4645C6.48818 11.855 6.48818 12.4882 6.87870 12.8787L9.29291 15.2929C9.68343 15.6834 10.3166 15.6834 10.7071 15.2929L16.7071 9.29289Z" fill="#28a745"/>
        </svg>
    `;
    createPopup('loading', 'Your PDF is generating and will be downloaded shortly.', successIconHtml);
    showPopup();
}

export { hidePopup }; // Export hidePopup for external use