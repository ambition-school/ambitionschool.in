// Initialize contacts JSON storage
const STORAGE_KEY = 'excel_academy_contacts_v2';

// Load existing contacts from localStorage
function loadContacts() {
    try {
        const contactsJson = localStorage.getItem(STORAGE_KEY);
        if (contactsJson) {
            return JSON.parse(contactsJson);
        }
    } catch (error) {
        console.error('Error loading contacts:', error);
    }
    return [];
}

// Save contacts to localStorage
function saveContacts(contacts) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
        
        // Also save to a simulated JSON file
        saveToJsonFile(contacts);
        
        return true;
    } catch (error) {
        console.error('Error saving contacts:', error);
        return false;
    }
}

// Add a new contact to storage
function addContact(contact) {
    const contacts = loadContacts();
    
    // Validate required fields
    if (!contact.name || !contact.phone || !contact.email || !contact.course) {
        console.error('Missing required fields');
        return false;
    }
    
    // Add timestamp and ID
    const newContact = {
        ...contact,
        id: Date.now(),
        timestamp: new Date().toISOString(),
        status: 'new',
        source: window.location.href
    };
    
    contacts.push(newContact);
    
    if (saveContacts(contacts)) {
        console.log('Contact saved successfully. Total contacts:', contacts.length);
        
        // Send notification
        sendNotification(newContact);
        
        return true;
    }
    return false;
}

// Save to simulated JSON file
function saveToJsonFile(contacts) {
    // In a real application, this would be a server-side API call
    // For demo purposes, we'll simulate it
    const dataStr = JSON.stringify(contacts, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    // Store the data URI for download
    window.lastContactsDataUri = dataUri;
    
    // Log to console for debugging
    console.log('Contacts data prepared for download:', contacts.length, 'records');
    
    // In production, you would send this to your server
    // fetch('/api/save-contacts', {
    //     method: 'POST',
    //     headers: {'Content-Type': 'application/json'},
    //     body: JSON.stringify(contacts)
    // });
}

// Send notification (simulated)
function sendNotification(contact) {
    const notification = {
        type: 'new_enquiry',
        contact: contact,
        time: new Date().toLocaleString(),
        message: `New enquiry from ${contact.name} for ${contact.course}`
    };
    
    console.log('Notification:', notification);
    
    // You can integrate with email or SMS services here
    // Example: sendEmailNotification(contact);
}

// Email notification function (template)
function sendEmailNotification(contact) {
    const emailData = {
        to: 'admin@excelacademy.edu.in',
        subject: `New Enquiry: ${contact.name} - ${contact.course}`,
        body: `
            New Enquiry Received:
            ---------------------
            Name: ${contact.name}
            Phone: ${contact.phone}
            Email: ${contact.email}
            Course: ${contact.course}
            Message: ${contact.message || 'No message'}
            Time: ${new Date().toLocaleString()}
            
            Please follow up within 24 hours.
        `
    };
    
    console.log('Email would be sent:', emailData);
}

// Form submission handler
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mainNav.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (mainNav) {
                    mainNav.classList.remove('active');
                }
                
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Form submission
    const enquiryForm = document.getElementById('enquiryForm');
    const formMessage = document.getElementById('formMessage');
    
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                email: document.getElementById('email').value.trim(),
                course: document.getElementById('course').value,
                message: document.getElementById('message').value.trim()
            };
            
            // Validate form
            if (!formData.name || !formData.phone || !formData.email || !formData.course) {
                showFormMessage('Please fill in all required fields', 'error');
                return;
            }
            
            // Validate phone number
            const phoneRegex = /^[0-9]{10}$/;
            const cleanPhone = formData.phone.replace(/\D/g, '');
            if (!phoneRegex.test(cleanPhone)) {
                showFormMessage('Please enter a valid 10-digit phone number', 'error');
                return;
            }
            formData.phone = cleanPhone;
            
            // Validate email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                showFormMessage('Please enter a valid email address', 'error');
                return;
            }
            
            // Save contact
            if (addContact(formData)) {
                showFormMessage('Thank you! Your enquiry has been submitted successfully. We will contact you soon.', 'success');
                
                // Reset form
                enquiryForm.reset();
                
                // Update contact count
                updateContactCount();
                
                // Auto-hide success message after 5 seconds
                setTimeout(() => {
                    if (formMessage) formMessage.style.display = 'none';
                }, 5000);
            } else {
                showFormMessage('There was an error submitting your enquiry. Please try again.', 'error');
            }
        });
    }
    
    // Show form message
    function showFormMessage(message, type) {
        if (formMessage) {
            formMessage.textContent = message;
            formMessage.className = type;
            formMessage.style.display = 'block';
            
            // Scroll to message
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
    
    // Update contact count display
    function updateContactCount() {
        const contacts = loadContacts();
        const countElement = document.getElementById('contactCount');
        if (countElement) {
            countElement.textContent = contacts.length;
        }
    }
    
    // Marquee interaction
    const marquee = document.querySelector('.announcement-marquee');
    if (marquee) {
        // Add click event to marquee for quick enrollment
        marquee.addEventListener('click', function() {
            document.querySelector('#contact').scrollIntoView({
                behavior: 'smooth'
            });
        });
        
        // Change cursor to pointer on hover
        marquee.style.cursor = 'pointer';
        
        // Add tooltip
        marquee.title = 'Click to enroll now!';
    }
    
    // Initialize contact count
    updateContactCount();
    
    // Add admin panel link if on main page
    addAdminPanelLink();
});

// Add admin panel link to header
function addAdminPanelLink() {
    const mainNav = document.querySelector('.main-nav ul');
    if (mainNav && !window.location.pathname.includes('inquiry.html')) {
        const adminLi = document.createElement('li');
        adminLi.innerHTML = '<a href="inquiry.html" class="admin-link"><i class="fas fa-chart-bar"></i> Enquiries</a>';
        mainNav.appendChild(adminLi);
    }
}

// Export contacts as JSON file
function exportContacts() {
    const contacts = loadContacts();
    if (contacts.length === 0) {
        alert('No contacts to export.');
        return;
    }
    
    const dataStr = JSON.stringify(contacts, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `excel_academy_enquiries_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Clear all contacts (admin function)
function clearAllContacts() {
    if (confirm('Are you sure you want to delete ALL enquiries? This action cannot be undone.')) {
        localStorage.removeItem(STORAGE_KEY);
        alert('All enquiries have been cleared.');
        if (window.location.pathname.includes('inquiry.html')) {
            window.location.reload();
        }
    }
}