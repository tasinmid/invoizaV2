export function initializeTooltips() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}

export function handleButtonGroup(groupElement, callback) {
    groupElement.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button || button.classList.contains('active')) return;

        Array.from(groupElement.children).forEach(child => child.classList.remove('active'));
        button.classList.add('active');

        if (callback) callback(button.dataset.value);
    });
    return groupElement.querySelector('.active').dataset.value;
}

export function togglePaymentMethodFields(activeValue) {
    const bankDetailsFields = document.getElementById('bankDetailsFields');
    const paypalFields = document.getElementById('paypalFields');
    const paymentLinkFields = document.getElementById('paymentLinkFields');
    const otherPaymentNote = document.getElementById('otherPaymentNote');

    const fields = {
        bd: [document.getElementById('pm_bn'), document.getElementById('pm_sc'), document.getElementById('pm_an')],
        pp: [document.getElementById('pm_em')],
        pl: [document.getElementById('pl_url')]
    };

    // Deactivate, disable, and un-require all fields first.
    Object.values(fields).flat().forEach(field => {
        if (field) {
            field.required = false;
            field.disabled = true;
        }
    });

    // Hide all field containers
    if(bankDetailsFields) bankDetailsFields.classList.remove('active');
    if(paypalFields) paypalFields.classList.remove('active');
    if(paymentLinkFields) paymentLinkFields.classList.remove('active');
    if(otherPaymentNote) otherPaymentNote.classList.remove('active');

    // Activate and enable the fields for the selected method
    if (activeValue === 'bd') {
        if(bankDetailsFields) bankDetailsFields.classList.add('active');
        fields.bd.forEach(field => {
            if (field) {
                field.required = true;
                field.disabled = false;
            }
        });
    } else if (activeValue === 'pp') {
        if(paypalFields) paypalFields.classList.add('active');
        fields.pp.forEach(field => {
            if (field) {
                field.required = true;
                field.disabled = false;
            }
        });
    } else if (activeValue === 'pl') {
        if(paymentLinkFields) paymentLinkFields.classList.add('active');
        fields.pl.forEach(field => {
            if (field) {
                field.required = true;
                field.disabled = false;
            }
        });
    } else if (activeValue === 'other') {
        if(otherPaymentNote) otherPaymentNote.classList.add('active');
    }
}

export function toggleRecipientEmailField() {
    const sendTypeSelect = document.getElementById('st');
    const recipientEmailField = document.getElementById('recipientEmailField');
    if(sendTypeSelect && recipientEmailField) {
        const selectedSendType = sendTypeSelect.value;
        const isActive = selectedSendType === 'ep' || selectedSendType === 'eh';
        recipientEmailField.classList.toggle('active', isActive);
        document.getElementById('re').required = isActive; // Make email required if visible
    }
}