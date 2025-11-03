/**
 * PTSC Certificate Verification System
 * Client-side JavaScript for certificate validation and display
 */

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Parse URL query parameters
 * @returns {Object} Object containing all URL parameters
 */
function parseURLParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    
    // Handle multiple parameters with the same name by taking the first one
    for (let [key, value] of params.entries()) {
        if (!result[key]) { // Only set if not already set (take first occurrence)
            result[key] = value;
        }
    }
    
    return result;
}

/**
 * Format date string to readable format
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {string} Formatted date string
 */
function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', options);
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
}

/**
 * Sanitize text content to prevent XSS
 * @param {string} text - Text to sanitize
 * @returns {string} Sanitized text
 */
function sanitizeText(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Show loading state
 */
function showLoading() {
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    const certificateState = document.getElementById('certificateState');
    
    if (loadingState) loadingState.style.display = 'block';
    if (errorState) errorState.style.display = 'none';
    if (certificateState) certificateState.style.display = 'none';
}

/**
 * Show error state
 */
function showError() {
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    const certificateState = document.getElementById('certificateState');
    
    if (loadingState) loadingState.style.display = 'none';
    if (errorState) errorState.style.display = 'block';
    if (certificateState) certificateState.style.display = 'none';
}

/**
 * Show certificate state
 */
function showCertificate() {
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    const certificateState = document.getElementById('certificateState');
    
    if (loadingState) loadingState.style.display = 'none';
    if (errorState) errorState.style.display = 'none';
    if (certificateState) certificateState.style.display = 'block';
}

// ==========================================
// CERTIFICATE VALIDATION
// ==========================================

/**
 * Fetch certificates from JSON file
 * @returns {Promise<Object>} Promise that resolves to certificates data
 */
async function fetchCertificates() {
    try {
        const response = await fetch('certificates.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching certificates:', error);
        throw new Error('Failed to load certificate database');
    }
}

/**
 * Validate certificate credentials
 * @param {string} id - Certificate ID
 * @param {string} key - Certificate key
 * @returns {Promise<Object|null>} Certificate data if valid, null if invalid
 */
async function validateCertificate(id, key) {
    try {
        const data = await fetchCertificates();
        
        // Trim whitespace and normalize the input
        const normalizedId = (id || '').trim();
        const normalizedKey = (key || '').trim();
        
        // Find certificate with matching ID and key
        const certificate = data.certificates.find(cert => {
            const certId = (cert.id || '').trim();
            const certKey = (cert.key || '').trim();
            
            return certId === normalizedId && certKey === normalizedKey;
        });
        
        return certificate || null;
    } catch (error) {
        console.error('Error validating certificate:', error);
        return null;
    }
}

// ==========================================
// CERTIFICATE DISPLAY
// ==========================================

/**
 * Update certificate display with validated data
 * @param {Object} certificate - Certificate data object
 */
function updateCertificateDisplay(certificate) {
    try {
        // Update certificate type
        const typeElement = document.getElementById('certificateType');
        if (typeElement && certificate.type) {
            typeElement.textContent = sanitizeText(certificate.type);
        }
        
        // Update recipient name
        const nameElement = document.getElementById('recipientName');
        if (nameElement && certificate.name) {
            nameElement.textContent = sanitizeText(certificate.name);
        }
        
        // Update event name
        const eventElement = document.getElementById('eventName');
        if (eventElement && certificate.event) {
            eventElement.textContent = sanitizeText(certificate.event);
        }
        
        // Update completion date
        const dateElement = document.getElementById('completionDate');
        if (dateElement && certificate.date) {
            dateElement.textContent = formatDate(certificate.date);
        }
        
        // Update issue date (same as completion date for now)
        const issueDateElement = document.getElementById('issueDate');
        if (issueDateElement && certificate.date) {
            issueDateElement.textContent = formatDate(certificate.date);
        }
        
        // Update issuer name
        const issuerElement = document.getElementById('issuerName');
        if (issuerElement && certificate.issuer) {
            issuerElement.textContent = sanitizeText(certificate.issuer);
        }
        
        // Update certificate ID in verification section
        const certIdElement = document.getElementById('certificateId');
        if (certIdElement && certificate.id) {
            certIdElement.textContent = sanitizeText(certificate.id);
        }
        
        // Update page title to include recipient name
        if (certificate.name) {
            document.title = `Certificate - ${certificate.name} - PTSC KNIT`;
        }
        
        // Update Open Graph meta tags for better social sharing
        updateOpenGraphMeta(certificate);
        
    } catch (error) {
        console.error('Error updating certificate display:', error);
        showError();
    }
}

/**
 * Update Open Graph meta tags for social media sharing
 * @param {Object} certificate - Certificate data object
 */
function updateOpenGraphMeta(certificate) {
    try {
        // Update or create Open Graph title
        let ogTitle = document.querySelector('meta[property="og:title"]');
        if (!ogTitle) {
            ogTitle = document.createElement('meta');
            ogTitle.setAttribute('property', 'og:title');
            document.head.appendChild(ogTitle);
        }
        ogTitle.setAttribute('content', 
            `${certificate.name} - ${certificate.type} - PTSC KNIT`);
        
        // Update or create Open Graph description
        let ogDescription = document.querySelector('meta[property="og:description"]');
        if (!ogDescription) {
            ogDescription = document.createElement('meta');
            ogDescription.setAttribute('property', 'og:description');
            document.head.appendChild(ogDescription);
        }
        ogDescription.setAttribute('content', 
            `${certificate.name} has successfully completed ${certificate.event} at Programming and Tech Skill Club, KNIT Sultanpur.`);
        
    } catch (error) {
        console.error('Error updating Open Graph meta:', error);
    }
}

// ==========================================
// MAIN VERIFICATION FUNCTION
// ==========================================

/**
 * Main certificate verification function
 * Called when certificate.html page loads
 */
async function verifyCertificate() {
    // Show loading state
    showLoading();
    
    try {
        // Parse URL parameters
        const params = parseURLParams();
        const certificateId = params.id;
        const certificateKey = params.key;
        
        // Check if required parameters are present
        if (!certificateId || !certificateKey) {
            console.error('Missing required parameters: id and key');
            showError();
            return;
        }
        
        // Add small delay for better UX (show loading animation)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Validate certificate
        const certificate = await validateCertificate(certificateId, certificateKey);
        
        if (certificate) {
            // Certificate is valid - update display and show certificate
            updateCertificateDisplay(certificate);
            showCertificate();
        } else {
            // Certificate is invalid - show error
            showError();
        }
        
    } catch (error) {
        console.error('Error during certificate verification:', error);
        showError();
    }
}

// ==========================================
// INDEX PAGE FORM HANDLING
// ==========================================

/**
 * Handle form submission on index page
 * @param {Event} event - Form submit event
 */
function handleFormSubmit(event) {
    event.preventDefault();
    
    try {
        // Get form data
        const form = event.target;
        const formData = new FormData(form);
        const certificateId = formData.get('certificateId')?.trim();
        const certificateKey = formData.get('certificateKey')?.trim();
        
        // Validate input
        if (!certificateId || !certificateKey) {
            alert('Please enter both Certificate ID and Verification Key');
            return;
        }
        
        // Basic format validation for certificate ID
        if (!/^PTSC\d{4}-\d{4}$/.test(certificateId)) {
            alert('Certificate ID should be in format: PTSC2025-0123');
            return;
        }
        
        // Basic format validation for key (should be alphanumeric)
        if (!/^[a-zA-Z0-9]{10}$/.test(certificateKey)) {
            alert('Verification key should be 10 alphanumeric characters');
            return;
        }
        
        // Create URL with parameters
        const url = `certificate.html?id=${encodeURIComponent(certificateId)}&key=${encodeURIComponent(certificateKey)}`;
        
        // Redirect to certificate page
        window.location.href = url;
        
    } catch (error) {
        console.error('Error handling form submission:', error);
        alert('An error occurred. Please try again.');
    }
}

// ==========================================
// EVENT LISTENERS AND INITIALIZATION
// ==========================================

/**
 * Initialize the application when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Check if we're on the index page
        const verificationForm = document.getElementById('verificationForm');
        if (verificationForm) {
            // Add form submit event listener
            verificationForm.addEventListener('submit', handleFormSubmit);
            
            // Add input validation
            const inputs = verificationForm.querySelectorAll('input');
            inputs.forEach(input => {
                input.addEventListener('input', function() {
                    // Remove any error styling
                    this.style.borderColor = '';
                });
                
                // Add paste event listener to clean up pasted content
                input.addEventListener('paste', function(e) {
                    setTimeout(() => {
                        this.value = this.value.trim();
                    }, 0);
                });
            });
            
        }
        
    } catch (error) {
        console.error('Error initializing application:', error);
    }
});

// ==========================================
// ERROR HANDLING
// ==========================================

/**
 * Global error handler
 */
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
    
    // Show user-friendly error message if no other error state is shown
    const errorState = document.getElementById('errorState');
    const certificateState = document.getElementById('certificateState');
    const loadingState = document.getElementById('loadingState');
    
    if (errorState && 
        (!certificateState || certificateState.style.display === 'none') &&
        (!loadingState || loadingState.style.display === 'none')) {
        showError();
    }
});

/**
 * Handle unhandled promise rejections
 */
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault();
});

// ==========================================
// ADDITIONAL UTILITY FUNCTIONS
// ==========================================

/**
 * Copy current page URL to clipboard
 * Used in certificate sharing functionality
 */
function copyCurrentUrl() {
    const url = window.location.href;
    
    if (navigator.clipboard && window.isSecureContext) {
        // Use modern clipboard API if available
        return navigator.clipboard.writeText(url);
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);
            return successful ? Promise.resolve() : Promise.reject();
        } catch (err) {
            document.body.removeChild(textArea);
            return Promise.reject(err);
        }
    }
}

/**
 * Check if device supports printing
 */
function canPrint() {
    return window.print && typeof window.print === 'function';
}

/**
 * Print certificate (if supported)
 */
function printCertificate() {
    if (canPrint()) {
        window.print();
    } else {
        alert('Printing is not supported on this device/browser');
    }
}

/**
 * Download certificate as PDF or JPG
 * @param {string} format - 'pdf' or 'jpg'
 */
async function downloadCertificate(format) {
    const certificateContainer = document.querySelector('.certificate-container');
    const navigation = document.querySelector('.navigation');
    
    if (!certificateContainer) {
        alert('Certificate not found. Please ensure the certificate is loaded.');
        return;
    }
    
    try {
        // Hide navigation during capture
        if (navigation) {
            navigation.style.display = 'none';
        }
        
        // Show loading state
        const originalCursor = document.body.style.cursor;
        document.body.style.cursor = 'wait';
        
        // Configure html2canvas for better quality
        const canvas = await html2canvas(certificateContainer, {
            scale: 2, // Higher resolution
            useCORS: true,
            backgroundColor: '#ffffff',
            width: 1123, // A4 landscape width
            height: 794,  // A4 landscape height
            scrollX: 0,
            scrollY: 0
        });
        
        // Get certificate details for filename
        const recipientName = document.getElementById('recipientName')?.textContent || 'Certificate';
        const certificateId = document.getElementById('certificateId')?.textContent || 'PTSC';
        const filename = `${recipientName.replace(/\s+/g, '_')}_${certificateId}_PTSC_Certificate`;
        
        if (format === 'jpg') {
            // Download as JPG
            const link = document.createElement('a');
            link.download = `${filename}.jpg`;
            link.href = canvas.toDataURL('image/jpeg', 0.95);
            link.click();
            
        } else if (format === 'pdf') {
            // Download as PDF
            const { jsPDF } = window.jspdf;
            
            // A4 landscape dimensions in mm
            const pdf = new jsPDF('landscape', 'mm', 'a4');
            const pdfWidth = 297; // A4 landscape width in mm
            const pdfHeight = 210; // A4 landscape height in mm
            
            // Calculate image dimensions to fit A4
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const ratio = Math.min(pdfWidth / canvasWidth, pdfHeight / canvasHeight);
            
            const imgWidth = canvasWidth * ratio;
            const imgHeight = canvasHeight * ratio;
            
            // Center the image on the page
            const x = (pdfWidth - imgWidth) / 2;
            const y = (pdfHeight - imgHeight) / 2;
            
            // Add image to PDF
            pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', x, y, imgWidth, imgHeight);
            pdf.save(`${filename}.pdf`);
        }
        
        // Restore UI
        document.body.style.cursor = originalCursor;
        if (navigation) {
            navigation.style.display = 'flex';
        }
        
    } catch (error) {
        console.error('Download failed:', error);
        alert('Download failed. Please try again or use the print option.');
        
        // Restore UI on error
        document.body.style.cursor = 'auto';
        if (navigation) {
            navigation.style.display = 'flex';
        }
    }
}

// ==========================================
// EXPORT FOR TESTING (if needed)
// ==========================================

// Make functions available globally for testing purposes
if (typeof window !== 'undefined') {
    window.PTSCCertificate = {
        parseURLParams,
        formatDate,
        sanitizeText,
        validateCertificate,
        verifyCertificate,
        fetchCertificates,
        copyCurrentUrl,
        printCertificate
    };
}

