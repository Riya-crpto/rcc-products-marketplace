document.addEventListener('DOMContentLoaded', function() {
    const whatsappBtn = document.getElementById('whatsappBtn');
    
    if (whatsappBtn) {
        // Get product name from page title or data attribute
        const productName = document.querySelector('[data-product]')?.getAttribute('data-product') 
            || document.title.split('-')[0].trim();
        
        const defaultMessage = encodeURIComponent(
            `Hello AP Group Of Industries!\n\nI am interested in your products, especially ${productName}.\n\nPlease provide me with:\n- Detailed specifications\n- Price quotation\n- Delivery timeline\n\nThank you!`
        );
        
        whatsappBtn.href = `https://wa.me/919878300280?text=${defaultMessage}`;
    }

    // UPDATE WHATSAPP LINKS ON PRODUCT PAGES
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
    whatsappLinks.forEach(link => {
        const currentHref = link.getAttribute('href');
        if (currentHref && currentHref.includes('wa.me')) {
            // Links are already set individually in HTML
        }
    });
});

// FUNCTION TO GENERATE WHATSAPP MESSAGE FOR SPECIFIC PRODUCTS
function generateWhatsAppMessage(productName, specifications = '') {
    let message = `Hello AP Group Of Industries!\n\n`;
    message += `I am interested in ${productName}.\n\n`;
    
    if (specifications) {
        message += `Specifications needed:\n${specifications}\n\n`;
    }
    
    message += `Please provide:\n`;
    message += `- Detailed product information\n`;
    message += `- Price quotation\n`;
    message += `- Bulk order discounts\n`;
    message += `- Delivery timeline\n\n`;
    message += `Thank you!`;
    
    return encodeURIComponent(message);
}