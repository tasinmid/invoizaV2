export function initSendTypeDropdown(callback) {
    const stSelect = document.getElementById('st'); // The hidden original select
    const customStSelectTrigger = document.getElementById('custom-st-select-trigger');
    const selectedStName = document.getElementById('selected-st-name');
    const customStSelectOptions = document.getElementById('custom-st-select-options');
    const customSelectWrapper = customStSelectTrigger.closest('.custom-select-wrapper');

    if (!stSelect || !customStSelectTrigger || !customStSelectOptions) return;

    // Populate custom options from the hidden select
    Array.from(stSelect.options).forEach((option, index) => {
        const customOption = document.createElement('div');
        customOption.classList.add('custom-select-option');
        customOption.dataset.value = option.value;
        customOption.textContent = option.textContent;

        if (option.disabled) {
            customOption.classList.add('disabled');
            customOption.title = 'Coming Soon';
        }

        customStSelectOptions.appendChild(customOption);

        // Set initial selected value
        if (option.selected || index === 0) {
            selectedStName.textContent = option.textContent;
            stSelect.value = option.value;
            customOption.classList.add('selected');
        }
    });

    // Event listener for custom dropdown trigger
    customStSelectTrigger.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent document click from closing immediately
        customStSelectOptions.classList.toggle('open');
        customStSelectTrigger.classList.toggle('open');
    });

    // Event listener for custom options
    customStSelectOptions.addEventListener('click', (e) => {
        const selectedCustomOption = e.target.closest('.custom-select-option');
        if (selectedCustomOption && !selectedCustomOption.classList.contains('disabled')) {
            // Update hidden select
            stSelect.value = selectedCustomOption.dataset.value;
            // Update custom trigger display
            selectedStName.textContent = selectedCustomOption.textContent;

            // Remove 'selected' class from previous and add to new
            customStSelectOptions.querySelectorAll('.custom-select-option').forEach(opt => opt.classList.remove('selected'));
            selectedCustomOption.classList.add('selected');

            // Close dropdown
            customStSelectOptions.classList.remove('open');
            customStSelectTrigger.classList.remove('open');

            // Dispatch change event on hidden select for form submission logic
            stSelect.dispatchEvent(new Event('change', { bubbles: true }));

            if (callback) callback(selectedCustomOption.dataset.value);
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!customSelectWrapper.contains(e.target)) {
            customStSelectOptions.classList.remove('open');
            customStSelectTrigger.classList.remove('open');
        }
    });

    // Initial callback call
    if (callback) callback(stSelect.value);
}
