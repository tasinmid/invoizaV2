import { loadTemplates } from './modules/templates.js';
import { initInvoiceItems, reRenderInvoiceItems } from './modules/invoice-items.js';
import { initFormSubmission } from './modules/form-submission.js';
import { initializeTooltips, handleButtonGroup, togglePaymentMethodFields, toggleRecipientEmailField } from './modules/ui.js';
import { initSendTypeDropdown } from './modules/send-type.js'; // New import

document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('DOMContentLoaded fired.');

        // Initialize Flatpickr for the date input
        flatpickr("#dt", {
            altInput: true, // Create a separate, user-friendly input
            altFormat: "F j, Y", // How the date will be displayed to the user
            dateFormat: "Y-m-d", // How the date will be sent to the server
            defaultDate: "today" // Set the default date to today
        });

        // Initialize UI components
        const itBtnGroup = document.getElementById('it-btn-group');
        const pmBtnGroup = document.getElementById('pm-btn-group');
        // const sendTypeSelect = document.getElementById('st'); // No longer directly used
        const scrollToNotesBtn = document.getElementById('scrollToNotesBtn');

        initializeTooltips();
        loadTemplates();
        initInvoiceItems();
        initFormSubmission();

        // Event Listeners that depend on multiple modules or global elements
        handleButtonGroup(itBtnGroup, reRenderInvoiceItems);
        
        let initialPaymentMethod = handleButtonGroup(pmBtnGroup, togglePaymentMethodFields);
        togglePaymentMethodFields(initialPaymentMethod);
        
        // Initialize custom Send Type dropdown
        initSendTypeDropdown(toggleRecipientEmailField); // Pass callback directly

        scrollToNotesBtn.addEventListener('click', () => {
            document.getElementById('an').scrollIntoView({ behavior: 'smooth' });
            document.getElementById('an').focus();
        });

        // Function to set up real-time input filtering for phone number fields
        const setupPhoneNumberInput = (inputElementId) => {
            const inputElement = document.getElementById(inputElementId);
            if (inputElement) {
                inputElement.addEventListener('input', (event) => {
                    let value = event.target.value;

                    // 1. Remove invalid characters (only allow digits, parentheses, plus, hyphen, space)
                    value = value.replace(/[^0-9()+\- ]/g, '');

                    // 2. Collapse multiple spaces into one
                    value = value.replace(/\s{2,}/g, ' ');

                    // 3. Enforce max of 15 digits (not characters, just numbers)
                    const digits = value.replace(/[^0-9]/g, ''); // extract only digits
                    if (digits.length > 15) {
                        // Find how many extra digits were typed and remove them
                        let allowedDigits = 15;
                        let result = '';
                        for (let char of value) {
                            if (/[0-9]/.test(char)) {
                                if (allowedDigits > 0) {
                                    result += char;
                                    allowedDigits--;
                                }
                                // else skip this digit
                            } else {
                                result += char; // keep formatting chars
                            }
                        }
                        value = result;
                    }

                    event.target.value = value;
                });
            }
        };

        // Apply real-time filtering to both phone number fields
        setupPhoneNumberInput('ph');
        setupPhoneNumberInput('bt_ph');

        // Initialize Flatpickr
        flatpickr("#dt", {
            dateFormat: "Y-m-d",
            altInput: true,
            altFormat: "F j, Y",
            defaultDate: "today"
        });

        // Function to set up Swift Code input to be uppercase
        const setupSwiftCodeInput = () => {
            const swiftCodeInput = document.getElementById('pm_sc');
            if (swiftCodeInput) {
                swiftCodeInput.addEventListener('input', (event) => {
                    event.target.value = event.target.value.toUpperCase();
                });
            }
        };

        setupSwiftCodeInput();

        // Function to set up Swift Code validation on blur
        const setupSwiftCodeValidation = () => {
            const swiftCodeInput = document.getElementById('pm_sc');
            const invalidIcon = document.getElementById('pm_sc_invalid_icon');
            
            if (swiftCodeInput && invalidIcon) {
                swiftCodeInput.addEventListener('blur', () => {
                    const len = swiftCodeInput.value.length;
                    if (len > 0 && (len < 8 || len > 11)) {
                        invalidIcon.classList.remove('validation-icon-hidden');
                    } else {
                        invalidIcon.classList.add('validation-icon-hidden');
                    }
                });
            }
        };

        setupSwiftCodeValidation();
            } catch (error) {
        console.error('Error during initialization:', error);
    }
});
