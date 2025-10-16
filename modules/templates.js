import { fetchTemplates } from '../api.js';

export function loadTemplates() {
    const tpSelect = document.getElementById('tp-select'); // The hidden original select
    const customSelectTrigger = document.getElementById('custom-tp-select-trigger');
    const selectedTemplateName = document.getElementById('selected-template-name');
    const customSelectOptions = document.getElementById('custom-tp-select-options');
    const customSelectWrapper = document.querySelector('.custom-select-wrapper');
    const largeTemplatePreview = document.getElementById('large-template-preview'); // New: Reference to the large preview

    if (!tpSelect || !customSelectTrigger || !customSelectOptions) return;

    console.log('loadTemplates started.');
    fetchTemplates().then(templates => {
        console.log('loadTemplates successful.');

        // Clear existing options in both hidden select and custom options
        tpSelect.innerHTML = '';
        customSelectOptions.innerHTML = '';

        templates.forEach((template, index) => {
            // Populate hidden select
            const option = document.createElement('option');
            option.value = template.tn;
            option.textContent = template.tn.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            option.dataset.previewUrl = template.tp;
            tpSelect.appendChild(option);

            // Create custom option
            const customOption = document.createElement('div');
            customOption.classList.add('custom-select-option');
            customOption.dataset.value = template.tn;
            customOption.dataset.previewUrl = template.tp;
            customOption.innerHTML = `
                <img src="${template.tp}" alt="${template.tn}" class="img-fluid rounded me-2">
                <span>${template.tn.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                <i class="bi bi-eye-fill view-template-icon ms-auto" data-img-url="${template.tp}"></i>
            `;
            customSelectOptions.appendChild(customOption);

            // Set initial selected template
            if (index === 0) {
                largeTemplatePreview.src = template.tp; // Update large preview
                largeTemplatePreview.style.display = 'block';
                selectedTemplateName.textContent = template.tn.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                tpSelect.value = template.tn; // Set value of hidden select
                customOption.classList.add('selected'); // Mark as selected
            }
        });

        // Event listener for custom dropdown trigger
        customSelectTrigger.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent document click from closing immediately
            customSelectOptions.classList.toggle('open');
            customSelectTrigger.classList.toggle('open');
        });

        // Event listener for custom options
        customSelectOptions.addEventListener('click', (e) => {
            const selectedCustomOption = e.target.closest('.custom-select-option');
            if (selectedCustomOption) {
                // Update hidden select
                tpSelect.value = selectedCustomOption.dataset.value;
                // Update custom trigger display
                selectedTemplateName.textContent = selectedCustomOption.querySelector('span').textContent;
                // Update large preview
                largeTemplatePreview.src = selectedCustomOption.dataset.previewUrl;
                largeTemplatePreview.style.display = 'block';

                // Remove 'selected' class from previous and add to new
                customSelectOptions.querySelectorAll('.custom-select-option').forEach(opt => opt.classList.remove('selected'));
                selectedCustomOption.classList.add('selected');

                // Close dropdown
                customSelectOptions.classList.remove('open');
                customSelectTrigger.classList.remove('open');

                // Dispatch change event on hidden select for form submission logic
                tpSelect.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });

        // Event listener for large template preview image
        largeTemplatePreview.addEventListener('click', () => {
            const modalImagePreview = document.getElementById('modalImagePreview');
            const imagePreviewModal = new bootstrap.Modal(document.getElementById('imagePreviewModal'));
            if (modalImagePreview && largeTemplatePreview.src) {
                modalImagePreview.src = largeTemplatePreview.src;
                imagePreviewModal.show();
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!customSelectWrapper.contains(e.target)) {
                customSelectOptions.classList.remove('open');
                customSelectTrigger.classList.remove('open');
            }
        });

    }).catch(error => {
        console.error("Failed to load templates:", error);
        selectedTemplateName.textContent = 'Error loading templates';
        largeTemplatePreview.style.display = 'none'; // Hide large preview on error
        tpSelect.innerHTML = '<option disabled selected>Error loading templates</option>';
        console.log('loadTemplates failed: ' + error.message);
    });
}