import { generateInvoice } from '../api.js';
import * as dl_module from '../dl.js'; // Import dl.js functions
import { showPreregModal } from '../prereg.js';

export function initFormSubmission() {
    const apiForm = document.getElementById('apiForm');
    const pmBtnGroup = document.getElementById('pm-btn-group');
    const sendTypeSelect = document.getElementById('st');
    const tpSelect = document.getElementById('tp-select');

    apiForm.addEventListener('submit', async (event) => {
        console.log('apiForm submit event fired.');
        event.preventDefault();

        const currentPaymentMethod = pmBtnGroup.querySelector('.active').dataset.value;
        const selectedSendType = sendTypeSelect.value;

        const payload = {
            template: tpSelect.value,
            company: document.getElementById('cp').value,
            address: document.getElementById('ad').value,
            phone: document.getElementById('ph').value,
            billTo: {
                company: document.getElementById('bt_cp').value,
                address: document.getElementById('bt_ad').value,
                phone: document.getElementById('bt_ph').value
            },
            serialNumber: document.getElementById('sn').value || undefined,
            date: document.getElementById('dt').value || undefined,
            additionalNotes: document.getElementById('an').value || undefined,
            sendType: selectedSendType,
            invoiceType: document.getElementById('it-btn-group').querySelector('.active').dataset.value,
            paymentMethod: { type: currentPaymentMethod },
            invoiceList: []
        };

        if (currentPaymentMethod === 'bd') {
            const bankName = document.getElementById('pm_bn');
            const swiftCode = document.getElementById('pm_sc');
            const accountNumber = document.getElementById('pm_an');
            const routingNumber = document.getElementById('pm_rn');
            const branch = document.getElementById('pm_br');

            // Reset validation states
            [bankName, swiftCode, accountNumber, routingNumber, branch].forEach(el => el.classList.remove('is-invalid'));

            let isValid = true;
if (!bankName.value) { isValid = false; bankName.classList.add('is-invalid'); }
if (!swiftCode.value) { isValid = false; swiftCode.classList.add('is-invalid'); }
if (!accountNumber.value) { isValid = false; accountNumber.classList.add('is-invalid'); }
if (!routingNumber.value) { isValid = false; routingNumber.classList.add('is-invalid'); }
if (!branch.value) { isValid = false; branch.classList.add('is-invalid'); }


            if (!isValid) {
                console.error('Validation Error: Missing required bank details.');
                // Optionally, scroll to the first invalid field
                const firstInvalid = document.querySelector('.is-invalid');
                if (firstInvalid) {
                    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return; // Stop submission
            }

            payload.paymentMethod.bankName = bankName.value;
            payload.paymentMethod.swiftCode = swiftCode.value;
            payload.paymentMethod.accountNumber = accountNumber.value;
            payload.paymentMethod.routingNumber = routingNumber.value;
            payload.paymentMethod.branch = branch.value;
            payload.paymentMethod.additionalInfo = document.getElementById('pm_ai').value || undefined;
        } else if (currentPaymentMethod === 'pp') {
            payload.paymentMethod.email = document.getElementById('pm_em').value;
        } else if (currentPaymentMethod === 'ot') {
            payload.paymentMethod.type = 'ot';
            payload.paymentMethod.email = 'Payment method details are provided in the additional notes section.';
        } else if (currentPaymentMethod === 'pl') {
            payload.paymentLink = document.getElementById('pl_url').value;
        }

        if (selectedSendType === 'ep' || selectedSendType === 'eh') {
            payload.recipientEmail = document.getElementById('re').value;
        }

        document.querySelectorAll('#invoiceListItems .invoice-item').forEach(itemDiv => {
            const item = {};
            itemDiv.querySelectorAll('[data-field]').forEach(input => {
                const field = input.dataset.field;
                let value = input.value;
                if (input.type === 'number') value = parseFloat(value);
                if (value || field === 'description') item[field] = value;
            });
            const monthTags = itemDiv.querySelector('[data-field="monthRange-tags"]');
            if (monthTags && monthTags.dataset.selectedMonths) {
                item.monthRange = JSON.parse(monthTags.dataset.selectedMonths);
            }
            payload.invoiceList.push(item);
        });

        if (payload.sendType === 'dl') {
            dl_module.showLoadingPopup();
            console.log('Detected sendType: dl. Showing loading popup.');
        }

        try {
            console.log('Calling generateInvoice with payload:', payload);
            const result = await generateInvoice(payload);
            console.log('generateInvoice returned result:', result);

            if (payload.sendType === 'dl') {
                console.log('Processing result for download.');
                const blob = await result.blob();
                console.log('Blob created:', blob);
                const url = window.URL.createObjectURL(blob);
                console.log('Object URL created:', url);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                const disposition = result.headers.get('content-disposition');
                let filename = 'invoice.pdf';
                if (disposition && disposition.indexOf('attachment') !== -1) {
                    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                    const matches = filenameRegex.exec(disposition);
                    if (matches != null && matches[1]) {
                        filename = matches[1].replace(/['"]/g, '');
                    }
                }
                a.download = filename;
                document.body.appendChild(a);
                console.log('Anchor element created and appended to body. Attempting click.');
                a.click();
                console.log('Anchor element clicked.');
                window.URL.revokeObjectURL(url);
                console.log('Object URL revoked.');
                a.remove();
                console.log('Anchor element removed. PDF download initiated.');
                
                // Now hide popup and show prereg modal
                dl_module.hidePopup();
                showPreregModal();
            } else {
                console.log('API Response:', result);
            }
        } catch (error) {
            console.error('API Error:', error);
            console.log('API call failed: ' + error.message);
            if (payload.sendType === 'dl') {
                dl_module.hidePopup();
                console.log('Loading popup hidden due to API error.');
            }
        }
    });
}