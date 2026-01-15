let inventory = [];

function addItem() {
    // Get values from inputs
    const name = document.getElementById('p-name').value;
    const qty = parseInt(document.getElementById('p-qty').value);
    const price = parseFloat(document.getElementById('p-price').value);

    if (name && qty >= 0 && price >= 0) {
        // CONCEPT: Objects
        const product = {
            id: Date.now(), // Unique ID based on time
            name: name,
            qty: qty,
            price: price
        };

        inventory.push(product);
        updateSystem();
        clearInputs();
    }
}

function removeItem(id) {
    // Filter out the item with the matching ID
    inventory = inventory.filter(item => item.id !== id);
    updateSystem();
}

function updateSystem() {
    const tbody = document.getElementById('inventory-body');
    tbody.innerHTML = '';
    
    let totalValue = 0;
    let criticalItems = 0;

    // CONCEPT: Loops
    inventory.forEach(item => {
        // CONCEPT: Calculation
        const itemTotal = item.qty * item.price;
        totalValue += itemTotal;

        // Check for low stock (Logic)
        const isLowStock = item.qty < 5;
        if (isLowStock) criticalItems++;

        // Render Row
        const row = `
            <tr>
                <td style="color: white; font-weight: bold;">${item.name.toUpperCase()}</td>
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

    // Update HUD Stats
    document.getElementById('total-value').innerText = `$${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2})}`;
    document.getElementById('alert-count').innerText = criticalItems;
}
// --- ADD THIS LINE HERE ---
    saveToStorage(); 

function clearInputs() {
    document.getElementById('p-name').value = '';
    document.getElementById('p-qty').value = '';
    document.getElementById('p-price').value = '';
}
// Function to Save to Browser Memory
function saveToStorage() {
    localStorage.setItem('jahat_devil_data', JSON.stringify(inventory));
}

// Function to Load from Browser Memory
window.onload = () => {
    const savedData = localStorage.getItem('jahat_devil_data');
    if (savedData) {
        inventory = JSON.parse(savedData);
        updateSystem(); // This redraws the table with your saved items
    }
};

// IMPORTANT: Go back to your updateSystem() function 
// and add saveToStorage(); at the very end of it!