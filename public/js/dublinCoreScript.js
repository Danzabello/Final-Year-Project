document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('metadataForm');

    // Helper functions should be declared outside of the event listener
    function isValidDate(dateString) {
        console.log('Validating date:', dateString); // Debug output
        const regEx = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateString.match(regEx)) {
            console.log('Date format is invalid'); // Debug output
            return false;
        }
        // Additional checks omitted for brevity, you can include them if needed
        return true;
    }

    function isFieldEmpty(fieldValue) {
        return !fieldValue || fieldValue.trim() === '';
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(form);
        const formObject = {};
        let isValid = true;        // Flag to determine if all validations pass

        formData.forEach((value, key) => {
            formObject[key] = value.trim();
        });

        // Required fields array
        ['dc:identifier', 'dc:title', 'dc:creator', 'dcterms:created'].forEach(field => {
            if (isFieldEmpty(formObject[field])) {
                alert(`Please fill out the ${field} field.`);
                isValid = false;
            }
        });

        if (!isFieldEmpty(formObject['dcterms:created']) && !isValidDate(formObject['dcterms:created'])) {
            alert('Please enter the Date Created in YYYY-MM-DD format.');
            isValid = false;
        }


        if (!isValid) {
            return; // Stop submission if not valid
        }

        // If all validations pass, send form data to the server
            // Proceed with form submission
            fetch('/submit-metadata', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(formObject)
            })
            .then(response => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
            })
            .then(data => {
              console.log('Success:', data);
              alert('Metadata submitted successfully!');
              form.reset();
            })
            .catch((error) => {
              console.error('Error:', error);
              alert('Failed to submit metadata. Please try again.');
            }); 
    });
});