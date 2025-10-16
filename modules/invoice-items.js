const invoiceListItemsDiv = document.getElementById('invoiceListItems');
const otItemTemplate = document.getElementById('ot-item-template');
const mpItemTemplate = document.getElementById('mp-item-template');
const itBtnGroup = document.getElementById('it-btn-group');
const addInvoiceItemBtn = document.getElementById('addInvoiceItem');

const setupMonthSelector = (itemDiv) => {
    const monthSelector = itemDiv.querySelector('.month-selector-container');
    if (!monthSelector) return;

    const selectedMonthsTags = monthSelector.querySelector('.selected-months-tags');
    const dropdownMenu = monthSelector.querySelector('.month-dropdown');
    const addMonthBtn = monthSelector.querySelector('.add-month-btn');

    new bootstrap.Dropdown(addMonthBtn);

    let selectedMonths = [];
    const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const renderDropdown = () => {
        dropdownMenu.innerHTML = '';
        allMonths.forEach(month => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.classList.add('dropdown-item');
            if (selectedMonths.includes(month)) {
                a.classList.add('disabled');
            }
            a.href = '#';
            a.textContent = month;
            a.dataset.month = month;
            li.appendChild(a);
            dropdownMenu.appendChild(li);
        });
    };

    const renderTags = () => {
        selectedMonthsTags.innerHTML = '';
        selectedMonths.forEach(month => {
            const tag = document.createElement('div');
            tag.classList.add('month-tag');
            tag.textContent = month;
            
            const closeBtn = document.createElement('button');
            closeBtn.type = 'button';
            closeBtn.classList.add('btn-close-tag');
            closeBtn.innerHTML = '&times;';
            closeBtn.dataset.month = month;
            
            tag.appendChild(closeBtn);
            selectedMonthsTags.appendChild(tag);
        });
        selectedMonthsTags.dataset.selectedMonths = JSON.stringify(selectedMonths);
        addMonthBtn.disabled = selectedMonths.length >= 12;
    };

    dropdownMenu.addEventListener('click', (e) => {
        e.preventDefault();
        const target = e.target;
        if (target.classList.contains('dropdown-item') && !target.classList.contains('disabled')) {
            const month = target.dataset.month;
            if (!selectedMonths.includes(month)) {
                selectedMonths.push(month);
                selectedMonths.sort((a, b) => allMonths.indexOf(a) - allMonths.indexOf(b));
                renderTags();
                renderDropdown();
            }
        }
    });

    selectedMonthsTags.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-close-tag')) {
            const month = e.target.dataset.month;
            selectedMonths = selectedMonths.filter(m => m !== month);
            renderTags();
            renderDropdown();
        }
    });

    renderDropdown();
};

const updateItemNumbers = () => {
    const allItems = invoiceListItemsDiv.querySelectorAll('.invoice-item');
    allItems.forEach((item, index) => {
        const itemNumber = index + 1;
        const h4 = item.querySelector('h4');
        if(h4) h4.textContent = `Invoice Item #${itemNumber}`;
    });
};

const updateAddButtonState = () => {
    const currentItemCount = invoiceListItemsDiv.querySelectorAll('.invoice-item').length;
    addInvoiceItemBtn.disabled = currentItemCount >= 6;
};

const addInvoiceItem = () => {
    if (addInvoiceItemBtn.disabled) return;

    const currentInvoiceType = itBtnGroup.querySelector('.active').dataset.value;
    const template = currentInvoiceType === 'ot' ? otItemTemplate : mpItemTemplate;
    const newItem = template.content.cloneNode(true);
    const itemDiv = newItem.querySelector('.invoice-item');
    
    invoiceListItemsDiv.appendChild(itemDiv);

    if (currentInvoiceType === 'mp') {
        setupMonthSelector(itemDiv);
    }
    
    void itemDiv.offsetHeight;
    itemDiv.classList.remove('fade-in');

    updateItemNumbers();
    updateAddButtonState();
};

export const reRenderInvoiceItems = () => {
    invoiceListItemsDiv.innerHTML = '';
    addInvoiceItem();
};

export function initInvoiceItems() {
    if (!invoiceListItemsDiv || !otItemTemplate || !mpItemTemplate || !itBtnGroup || !addInvoiceItemBtn) {
        return;
    }

    // Use event delegation for remove buttons
    invoiceListItemsDiv.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-invoice-item')) {
            const itemDiv = event.target.closest('.invoice-item');
            if (itemDiv) {
                itemDiv.classList.add('fade-out');
                itemDiv.addEventListener('transitionend', () => {
                    itemDiv.remove();
                    updateItemNumbers();
                    updateAddButtonState();
                }, { once: true });
            }
        }
    });

    addInvoiceItemBtn.addEventListener('click', addInvoiceItem);

    // Initial render
    reRenderInvoiceItems();
}
