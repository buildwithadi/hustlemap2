// Waitlist Form Submission
document.getElementById('waitlistForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const submitButton = document.getElementById('submitButton');
    const submitText = document.getElementById('submitText');
    const submitIcon = document.getElementById('submitIcon');
    
    // Show loading state
    submitButton.disabled = true;
    submitText.textContent = 'Joining...';
    submitIcon.innerHTML = '<svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';
    
    try {
        const response = await fetch('/join-waitlist/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Show success state
            submitText.textContent = 'Joined!';
            submitIcon.innerHTML = '<svg class="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>';
            
            // Reset form
            document.getElementById('email').value = '';
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'mt-4 text-green-500 text-center';
            successMessage.textContent = 'Successfully joined the waitlist!';
            this.appendChild(successMessage);
            
            // Remove success message after 3 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 3000);
        } else {
            throw new Error(data.error || 'Failed to join waitlist');
        }
    } catch (error) {
        // Show error state
        submitText.textContent = 'Error';
        submitIcon.innerHTML = '<svg class="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>';
        
        // Show error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'mt-4 text-red-500 text-center';
        errorMessage.textContent = error.message;
        this.appendChild(errorMessage);
        
        // Remove error message after 3 seconds
        setTimeout(() => {
            errorMessage.remove();
        }, 3000);
    } finally {
        // Reset button state after 2 seconds
        setTimeout(() => {
            submitButton.disabled = false;
            submitText.textContent = 'Join Waitlist';
            submitIcon.innerHTML = '<svg class="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" /></svg>';
        }, 2000);
    }
});

// Roadmap Generation
document.getElementById('generateRoadmap').addEventListener('click', async function() {
    const platform = document.querySelector('.social-icon.active').dataset.platform;
    const days = document.querySelector('.day-button.active').dataset.days;
    const category = document.querySelector('.category-button.active').dataset.category;
    
    const generateButton = this;
    const generateText = document.getElementById('generateText');
    const generateIcon = document.getElementById('generateIcon');
    
    // Show loading state
    generateButton.disabled = true;
    generateText.textContent = 'Generating...';
    generateIcon.innerHTML = '<svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';
    
    try {
        const response = await fetch('/generate-roadmap/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            },
            body: JSON.stringify({
                platform,
                days,
                category
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Update roadmap content
            document.getElementById('roadmapContent').innerHTML = data.roadmap;
            
            // Show success state
            generateText.textContent = 'Generated!';
            generateIcon.innerHTML = '<svg class="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>';
        } else {
            throw new Error(data.error || 'Failed to generate roadmap');
        }
    } catch (error) {
        // Show error state
        generateText.textContent = 'Error';
        generateIcon.innerHTML = '<svg class="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>';
        
        // Show error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'mt-4 text-red-500 text-center';
        errorMessage.textContent = error.message;
        document.getElementById('roadmapContent').innerHTML = '';
        document.getElementById('roadmapContent').appendChild(errorMessage);
    } finally {
        // Reset button state after 2 seconds
        setTimeout(() => {
            generateButton.disabled = false;
            generateText.textContent = 'Generate Roadmap';
            generateIcon.innerHTML = '<svg class="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" /></svg>';
        }, 2000);
    }
});

// Social Icon Selection
document.querySelectorAll('.social-icon').forEach(icon => {
    icon.addEventListener('click', function() {
        document.querySelectorAll('.social-icon').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
    });
});

// Day Button Selection
document.querySelectorAll('.day-button').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.day-button').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
});

// Category Button Selection
document.querySelectorAll('.category-button').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.category-button').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
    });
}); 