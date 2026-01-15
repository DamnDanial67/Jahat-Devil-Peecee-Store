let inventory = [];

// 1. LOAD DATA: This runs the moment the page opens
window.onload = () => {
    const savedData = localStorage.getItem('jahat_devil_data');
    if (savedData) {
        // Convert the saved string back into an array of objects
        inventory = JSON.parse(savedData);
        // Refresh the screen with the saved data
        updateSystem(); 
    }
};

// 2. ADD ITEM: Creates the product object
function addItem() {
    const nameInput = document.getElementById('p-name');
    const qtyInput = document.getElementById('p-qty');
    const priceInput = document.getElementById('p-price');

    const name = nameInput.value;
    const qty = parseInt(qtyInput.value);
    const price = parseFloat(priceInput.value);

    if (name && !isNaN(qty) && !isNaN(price)) {
        const product = {
            id: Date.now(),
            name: name,
            qty: qty,
            price: price
        };

        inventory.push(product);
        updateSystem();
        
        // Clear inputs for next item
        nameInput.value = '';
        qtyInput.value = '';
        priceInput.value = '';
    } else {
        alert("Please fill all fields with valid numbers!");
    }
}

// 3. REMOVE ITEM: Deletes from array
function removeItem(id) {
    inventory = inventory.filter(item => item.id !== id);
    updateSystem();
}

// 4. UPDATE SYSTEM: Handles UI and Saving to Memory
function updateSystem() {
    const tbody = document.getElementById('inventory-body');
    tbody.innerHTML = '';
    
    let totalValue = 0;
    let criticalItems = 0;

    inventory.forEach(item => {
        const itemTotal = item.qty * item.price;
        totalValue += itemTotal;

        const isLowStock = item.qty < 5;
        if (isLowStock) criticalItems++;

        const row = `
            <tr>
                <td style="color: white; font-weight: bold; border-left: 3px solid ${isLowStock ? '#ff3333' : '#00f3ff'}">
                    ${item.name.toUpperCase()}
                </td>
                <td>${item.qty}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>$${itemTotal.toFixed(2)}</td>
                <td class="${isLowStock ? 'low-stock-alert' : ''}">
                    ${isLowStock ? 'CRITICAL' : 'STABLE'}
                </td>
                <td>
                    <button class="delete-btn" onclick="removeItem(${item.id})">SCRAP</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });

    // Update the HUD displays
    document.getElementById('total-value').innerText = `$${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    document.getElementById('alert-count').innerText = criticalItems;

    // --- STICKY FEATURE: Save the current inventory to browser memory ---
    localStorage.setItem('jahat_devil_data', JSON.stringify(inventory));
}