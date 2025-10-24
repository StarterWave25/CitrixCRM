/* ------------------------------------------------------------------------- */
/* DOCTORS LIST FORM LOGIC - doctors.js (Complete with Order Status)  */
/* Handles multiple doctor forms, fetching existing doctors, and submission  */
/* ------------------------------------------------------------------------- */

async function setupDoctorsListForm() {
    const formArea = document.getElementById('doctors-list-form');
    const submitBtn = formArea.querySelector('.form-submit-btn');
    const userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
    const exId = localStorage.getItem('lastSubmittedExId');
    const exName = localStorage.getItem('lastSubmittedExName');
    const empId = userDetails.id;
    const employeeName = userDetails.name || userDetails.empName;
    const showNotification = window.showNotification || ((msg, type) => console.log(`[Notification ${type}]: ${msg}`));

    // Hide main submit button if present, not used for doctors list
    if (submitBtn) submitBtn.style.display = 'none';

    let doctorFormCounter = 0;
    let productRowCounter = 0;
    let productsData = []; // Store fetched products
    let isSubmitting = false; // Global flag to track submission state

    // Validate tour plan selected
    if (!exId || !exName) {
        document.getElementById('form-title').textContent = '⚠ No Tour Plan is Selected';
        return;
    }

    // --- File to Base64 Conversion ---
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    // --- Fetch Products from API ---
    const fetchProducts = async () => {
        try {
            const response = await apiFetch('employee/get-products', 'GET');
            if (response.success && response.data && Array.isArray(response.data.products)) {
                productsData = response.data.products;
                return productsData;
            } else {
                showNotification('Failed to fetch products.', 'error');
                return [];
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            showNotification('Error loading products.', 'error');
            return [];
        }
    };

    // --- Fetch and Display Existing Doctors ---
    const fetchAndDisplayDoctors = async () => {
        try {
            const response = await apiFetch('employee/fetch-form-dependencies', 'POST', {
                formName: 'doctorsList',
                exId: parseInt(exId)
            });
            formArea.innerHTML = '';
            if (response.success && response.data && Array.isArray(response.data.doctorsList)) {
                response.data.doctorsList.forEach(doctor => createDoctorForm(doctor, false));
                if (response.data.doctorsList.length === 0) {
                    document.getElementById('form-title').textContent = '⚠ No Doctors Found!';
                    showNotification('No existing doctors found. You can add new doctors.', 'info');
                }
            } else {
                showNotification('Failed to fetch doctors list.', 'error');
            }
            // Add the floating "+" button
            addFloatingNewDoctorButton();
        } catch (error) {
            console.error('Error fetching doctors:', error);
            showNotification('Error loading doctors list.', 'error');
            addFloatingNewDoctorButton();
        }
    };

    // --- Validation Functions ---
    const validateDoctorName = (name) => {
        const trimmedName = name.trim();
        if (!trimmedName) {
            return { valid: false, message: 'Doctor Name is required.' };
        }
        if (trimmedName.length < 1 || trimmedName.length > 100) {
            return { valid: false, message: 'Doctor Name must be between 1 and 100 characters.' };
        }
        return { valid: true };
    };

    const validatePhone = (phone) => {
        const phoneStr = phone.toString().trim();
        if (!phoneStr) {
            return { valid: false, message: 'Phone Number is required.' };
        }
        const phoneNum = parseInt(phoneStr);
        if (isNaN(phoneNum)) {
            return { valid: false, message: 'Phone Number must be a valid number.' };
        }
        if (phoneNum < 1000000000 || phoneNum > 9999999999) {
            return { valid: false, message: 'Phone Number must be exactly 10 digits.' };
        }
        return { valid: true };
    };

    const validateAddress = (address) => {
        const trimmedAddress = address.trim();
        if (!trimmedAddress) {
            return { valid: false, message: 'Address is required.' };
        }
        if (trimmedAddress.length < 1 || trimmedAddress.length > 150) {
            return { valid: false, message: 'Address must be between 1 and 150 characters.' };
        }
        return { valid: true };
    };

    const validateFeedback = (feedback) => {
        const trimmedFeedback = feedback.trim();
        if (!trimmedFeedback) {
            return { valid: false, message: 'Feedback is required.' };
        }
        if (trimmedFeedback.length > 5000) {
            return { valid: false, message: 'Feedback must not exceed 5000 characters.' };
        }
        return { valid: true };
    };

    const validateOrderFields = (formContainer, formId) => {
        const dlCopyFile = formContainer.querySelector('input[name="dlCopy"]').files[0];
        const prescriptionFile = formContainer.querySelector('input[name="prescription"]').files[0];

        if (!dlCopyFile || !prescriptionFile) {
            return { valid: false, message: 'Both DL Copy and Prescription images are required.' };
        }

        const productsContainer = document.getElementById(`products-container-${formId}`);
        const productRows = productsContainer.querySelectorAll('.product-row');

        if (productRows.length > 0) {
            for (const row of productRows) {
                const selectElement = row.querySelector('select[name="productName"]');
                const stripsInput = row.querySelector('input[name="strips"]');
                const freeStripsInput = row.querySelector('input[name="freeStrips"]');

                const pId = selectElement.getAttribute('data-p-id');
                const strips = parseInt(stripsInput.value);
                const freeStrips = parseInt(freeStripsInput.value);

                if (!pId || isNaN(strips) || strips <= 0 || isNaN(freeStrips) || freeStrips < 0) {
                    return { valid: false, message: 'Please select a product and enter valid quantities for all product rows.' };
                }
            }
        }

        return { valid: true };
    };

    // --- Create Individual Doctor Form (Card) ---
    const createDoctorForm = (doctorData = null, isNewDoctor = true) => {
        document.getElementById('form-title').textContent = 'Doctors List';
        doctorFormCounter++;
        const formId = `doctor-form-${doctorFormCounter}`;
        const formContainer = document.createElement('div');
        formContainer.classList.add('doctor-form-container');
        formContainer.setAttribute('id', formId);

        const formTitle = document.createElement('h3');
        formTitle.textContent = isNewDoctor ? '➕ New Doctor' : `👨‍⚕️ ${doctorData.doctorName}`;
        formTitle.style.cssText = 'margin-top: 0; color: #333; font-size: 18px;';
        formContainer.appendChild(formTitle);

        const fields = [
            { name: 'doctorName', type: 'text', label: 'Doctor Name', required: true, value: doctorData?.doctorName || '', readOnly: !isNewDoctor },
            { name: 'address', type: 'text', label: 'Address', required: true, value: doctorData?.address || '', readOnly: !isNewDoctor },
            { name: 'phone', type: 'tel', label: 'Phone Number', required: true, value: doctorData?.phone || '', readOnly: !isNewDoctor },
            { name: 'feedback', type: 'textarea', label: 'Feedback', required: true, value: '' },
            { name: 'orderStatus', type: 'checkbox', label: 'Order Placed', required: false, value: false }
        ];

        fields.forEach(field => {
            const fieldHTML = createFormField(field);
            formContainer.appendChild(fieldHTML);
        });

        // Container for order-specific fields (hidden initially)
        const orderFieldsContainer = document.createElement('div');
        orderFieldsContainer.classList.add('order-fields-container');
        orderFieldsContainer.style.display = 'none';
        orderFieldsContainer.setAttribute('id', `order-fields-${formId}`);
        formContainer.appendChild(orderFieldsContainer);

        // Listen to orderStatus checkbox change
        const orderStatusCheckbox = formContainer.querySelector('#orderStatus');
        orderStatusCheckbox.addEventListener('change', async () => {
            if (orderStatusCheckbox.checked) {
                // Show order fields
                orderFieldsContainer.style.display = 'block';

                // Check if already populated
                if (orderFieldsContainer.children.length === 0) {
                    await populateOrderFields(orderFieldsContainer, formId);
                }
            } else {
                // Hide order fields
                orderFieldsContainer.style.display = 'none';
            }
        });

        // Submit Button
        const submitButton = document.createElement('button');
        submitButton.type = 'button';
        submitButton.classList.add('btn-primary', 'form-submit-btn');
        submitButton.innerHTML = '<i class="fa-solid fa-save"></i> Submit';
        submitButton.style.cssText = 'margin-top: 15px;';
        if (!isNewDoctor && doctorData?.docId) {
            submitButton.setAttribute('data-doc-id', doctorData.docId);
        }
        submitButton.addEventListener('click', () => handleDoctorSubmission(formId, isNewDoctor));
        formContainer.appendChild(submitButton);

        formArea.appendChild(formContainer);
    };

    // --- Populate Order-Specific Fields ---
    const populateOrderFields = async (container, formId) => {
        // Fetch products if not already fetched
        if (productsData.length === 0) {
            productsData = await fetchProducts();
        }

        // DL Copy Image Upload
        const dlCopyField = createFormField({
            name: 'dlCopy',
            type: 'file',
            label: 'DL Copy',
            required: true,
            accept: 'image/*'
        });
        container.appendChild(dlCopyField);

        // Prescription Image Upload
        const prescriptionField = createFormField({
            name: 'prescription',
            type: 'file',
            label: 'Prescription',
            required: true,
            accept: 'image/*'
        });
        container.appendChild(prescriptionField);

        // Products Section Title
        const productsTitle = document.createElement('h4');
        productsTitle.textContent = '📦 Products';
        productsTitle.style.cssText = 'margin-top: 20px; margin-bottom: 10px; color: #555;';
        container.appendChild(productsTitle);

        // Products Container
        const productsContainer = document.createElement('div');
        productsContainer.classList.add('products-container');
        productsContainer.setAttribute('id', `products-container-${formId}`);
        container.appendChild(productsContainer);

        // Add first product row
        addProductRow(productsContainer, formId);

        // Add Product Button
        const addProductBtn = document.createElement('button');
        addProductBtn.type = 'button';
        addProductBtn.classList.add('btn-secondary');
        addProductBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Product';
        addProductBtn.style.cssText = 'margin-top: 10px; padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;';
        addProductBtn.addEventListener('click', () => addProductRow(productsContainer, formId));
        container.appendChild(addProductBtn);

        // Grand Total Field
        const grandTotalField = createFormField({
            name: 'grandTotal',
            type: 'number',
            label: 'Grand Total (₹)',
            required: false,
            readOnly: true,
            value: '0'
        });
        grandTotalField.style.marginTop = '20px';
        grandTotalField.setAttribute('id', `grand-total-${formId}`);
        container.appendChild(grandTotalField);
    };

    // --- Add Product Row ---
    const addProductRow = (productsContainer, formId) => {
        productRowCounter++;
        const rowId = `product-row-${productRowCounter}`;

        const productRow = document.createElement('div');
        productRow.classList.add('product-row');
        productRow.setAttribute('id', rowId);

        // Product Dropdown
        const productOptions = productsData.map(p => ({
            value: p.productName,
            label: p.productName,
            dataExId: p.pId
        }));

        const productSelect = createFormField({
            name: 'productName',
            type: 'select',
            label: 'Product Name',
            required: true,
            options: productOptions
        });

        const selectElement = productSelect.querySelector('select');
        selectElement.addEventListener('change', () => {
            const selectedOption = selectElement.options[selectElement.selectedIndex];
            const pId = selectedOption.getAttribute('data-ex-id');
            const product = productsData.find(p => p.pId == pId);

            if (product) {
                selectElement.setAttribute('data-price', product.price);
                selectElement.setAttribute('data-p-id', pId);
                calculateProductTotal(rowId, formId);
            }
        });

        productRow.appendChild(productSelect);

        // Strips Input
        const stripsInput = createFormField({
            name: 'strips',
            type: 'number',
            label: 'Strips (Quantity)',
            required: true,
            placeholder: 'No of Strips'
        });

        const stripsField = stripsInput.querySelector('input');
        stripsField.addEventListener('input', () => calculateProductTotal(rowId, formId));

        productRow.appendChild(stripsInput);

        // Free Strips Input
        const freeStripsInput = createFormField({
            name: 'freeStrips',
            type: 'number',
            label: 'Free Strips',
            required: true,
            placeholder: 'No of Free Strips'
        });
        productRow.appendChild(freeStripsInput);

        // Total Input (ReadOnly)
        const totalInput = createFormField({
            name: 'total',
            type: 'number',
            label: 'Total (₹)',
            required: false,
            readOnly: true,
            value: '0'
        });
        productRow.appendChild(totalInput);

        // Remove Button
        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.classList.add('remove-product-btn');
        removeBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
        removeBtn.addEventListener('click', () => {
            productRow.remove();
            calculateGrandTotal(formId);
        });
        productRow.appendChild(removeBtn);

        productsContainer.appendChild(productRow);
    };

    // --- Calculate Product Total ---
    const calculateProductTotal = (rowId, formId) => {
        const row = document.getElementById(rowId);
        if (!row) return;

        const selectElement = row.querySelector('select[name="productName"]');
        const stripsInput = row.querySelector('input[name="strips"]');
        const totalInput = row.querySelector('input[name="total"]');

        const price = parseFloat(selectElement.getAttribute('data-price')) || 0;
        const strips = parseInt(stripsInput.value) || 0;
        const total = price * strips;

        totalInput.value = total.toFixed(2);

        // Recalculate grand total
        calculateGrandTotal(formId);
    };

    // --- Calculate Grand Total ---
    const calculateGrandTotal = (formId) => {
        const productsContainer = document.getElementById(`products-container-${formId}`);
        if (!productsContainer) return;

        const allTotalInputs = productsContainer.querySelectorAll('input[name="total"]');
        let grandTotal = 0;

        allTotalInputs.forEach(input => {
            grandTotal += parseFloat(input.value) || 0;
        });

        const grandTotalContainer = document.getElementById(`grand-total-${formId}`);
        if (grandTotalContainer) {
            const grandTotalInput = grandTotalContainer.querySelector('input[name="grandTotal"]');
            if (grandTotalInput) {
                grandTotalInput.value = grandTotal.toFixed(2);
            }
        }
    };

    // --- Add Floating "+" Button ---
    const addFloatingNewDoctorButton = () => {

        let fixedAddBtn = document.getElementById('fixed-add-doctor-btn');
        if (!fixedAddBtn) {
            fixedAddBtn = document.createElement('button');
            fixedAddBtn.id = 'fixed-add-doctor-btn';
            fixedAddBtn.type = 'button';
            fixedAddBtn.classList.add('btn-primary');
            fixedAddBtn.innerHTML = '<i class="fa-solid fa-plus"></i>';
            fixedAddBtn.style.cssText = 'position: fixed; bottom: 16px; right: 16px; z-index: 300; width: 48px; height: 48px; border-radius: 50%; font-size: 1.4rem; display: flex; align-items: center; justify-content: center;';
        }

        if (!document.body.contains(fixedAddBtn)) {
            document.body.appendChild(fixedAddBtn);
        }

        fixedAddBtn.onclick = () => {
            createDoctorForm(null, true);
            setTimeout(() => {
                const allForms = formArea.querySelectorAll('.doctor-form-container');
                if (allForms.length > 0) {
                    const lastForm = allForms[allForms.length - 1];
                    lastForm.scrollIntoView({ behavior: 'smooth', block: 'end' });
                    setTimeout(() => {
                        const nameInput = lastForm.querySelector('input[name="doctorName"]');
                        if (nameInput) nameInput.focus();
                    }, 350);
                }
            }, 120);
        };
    };
    // --- Disable/Enable All Submit Buttons ---
    const toggleAllSubmitButtons = (disabled) => {
        const allSubmitButtons = formArea.querySelectorAll('.form-submit-btn');
        allSubmitButtons.forEach(btn => {
            btn.disabled = disabled;
        });
    };

    // --- Submission Logic ---
    const handleDoctorSubmission = async (formId, isNewDoctor) => {
        // ✅ Check if any submission is in progress
        if (isSubmitting) {
            showNotification('Another form is being submitted. Please wait.', 'warning');
            return;
        }

        const formContainer = document.getElementById(formId);
        if (!formContainer) return;

        const submitButton = formContainer.querySelector('.form-submit-btn');
        const doctorNameInput = formContainer.querySelector('#doctorName');
        const addressInput = formContainer.querySelector('#address');
        const phoneInput = formContainer.querySelector('#phone');
        const feedbackInput = formContainer.querySelector('#feedback');
        const orderStatusInput = formContainer.querySelector('#orderStatus');

        // ✅ Validate Feedback
        const feedbackValidation = validateFeedback(feedbackInput.value);
        if (!feedbackValidation.valid) {
            showNotification(feedbackValidation.message, 'error');
            feedbackInput.focus();
            return;
        }

        // ✅ Validate New Doctor Fields
        if (isNewDoctor) {
            const nameValidation = validateDoctorName(doctorNameInput.value);
            if (!nameValidation.valid) {
                showNotification(nameValidation.message, 'error');
                doctorNameInput.focus();
                return;
            }

            const addressValidation = validateAddress(addressInput.value);
            if (!addressValidation.valid) {
                showNotification(addressValidation.message, 'error');
                addressInput.focus();
                return;
            }

            const phoneValidation = validatePhone(phoneInput.value);
            if (!phoneValidation.valid) {
                showNotification(phoneValidation.message, 'error');
                phoneInput.focus();
                return;
            }
        }
        // ✅ Set global flag and disable all buttons
        isSubmitting = true;
        toggleAllSubmitButtons(true);

        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';

        try {
            const orderStatus = orderStatusInput.checked;

            if (orderStatus) {
                // Order Status = Yes logic
                // Validate order-specific fields upfront
                const orderValidation = validateOrderFields(formContainer, formId);
                if (!orderValidation.valid) {
                    showNotification(orderValidation.message, 'error');
                    isSubmitting = false;
                    toggleAllSubmitButtons(false);
                    submitButton.disabled = false;
                    submitButton.innerHTML = '<i class="fa-solid fa-save"></i> Submit';
                    return;
                }
                await submitDoctorWithOrder(formContainer, formId, isNewDoctor, submitButton);
            } else {
                // Order Status = No logic (existing)
                if (isNewDoctor) {
                    await submitNewDoctor(formContainer, submitButton);
                } else {
                    await submitExistingDoctor(formContainer, submitButton);
                }
            }
        } catch (error) {
            console.error('Doctor submission error:', error);
            showNotification('An unexpected error occurred.', 'error');

            // ✅ Reset flag and enable all buttons
            isSubmitting = false;
            toggleAllSubmitButtons(false);

            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fa-solid fa-save"></i> Submit';
        }
    };

    // --- Submit Doctor with Order (Order Status = Yes) ---
    const submitDoctorWithOrder = async (formContainer, formId, isNewDoctor, submitButton) => {
        try {
            // Step 0: Get or Create Doctor ID
            let docId;
            const doctorNameInput = formContainer.querySelector('#doctorName');
            const doctorName = doctorNameInput.value.trim();

            // Re-declare dlCopyFile and prescriptionFile here
            const dlCopyFile = formContainer.querySelector('input[name="dlCopy"]').files[0];
            const prescriptionFile = formContainer.querySelector('input[name="prescription"]').files[0];

            if (isNewDoctor) {
                // Create new doctor first
                const addressInput = formContainer.querySelector('#address');
                const phoneInput = formContainer.querySelector('#phone');

                const newDoctorData = {
                    doctorName: doctorName,
                    phone: parseInt(phoneInput.value.trim()),
                    address: addressInput.value.trim(),
                    exId: parseInt(exId)
                };

                const doctorApiBody = { form: 'doctors', data: newDoctorData };
                const doctorResponse = await apiFetch('employee/forms-submit', 'POST', doctorApiBody);

                if (!doctorResponse.success || !doctorResponse.insertId) {
                    const errorMessage = doctorResponse.message || 'Failed to create new doctor.';
                    showNotification(errorMessage, 'error');
                    isSubmitting = false;
                    toggleAllSubmitButtons(false);
                    return;
                }

                docId = doctorResponse.insertId;
            } else {
                // Use existing doctor ID
                docId = parseInt(submitButton.getAttribute('data-doc-id'));
            }

            // Submit doctor activity first
            const feedbackInput = formContainer.querySelector('#feedback');
            const activityData = {
                docId: docId,
                empId: parseInt(empId),
                employeeName: employeeName,
                feedback: feedbackInput.value.trim(),
                orderStatus: 'Yes'
            };

            const activityApiBody = { form: 'doctorActivities', data: activityData };
            const activityResponse = await apiFetch('employee/forms-submit', 'POST', activityApiBody);

            if (!activityResponse.success) {
                const errorMessage = activityResponse.message || 'Doctor activity submission failed.';
                showNotification(errorMessage, 'error');
                isSubmitting = false;
                toggleAllSubmitButtons(false);
                return;
            }

            // Step 1: Upload Images

            showNotification('Uploading DL Copy...', 'info');
            const dlCopyBase64 = await fileToBase64(dlCopyFile);
            const dlCopyResponse = await apiFetch('employee/upload-image', 'POST', { image: dlCopyBase64 });

            if (!dlCopyResponse.url) {
                showNotification('DL Copy upload failed.', 'error');
                isSubmitting = false;
                toggleAllSubmitButtons(false);
                return;
            }

            showNotification('Uploading Prescription...', 'info');
            const prescriptionBase64 = await fileToBase64(prescriptionFile);
            const prescriptionResponse = await apiFetch('employee/upload-image', 'POST', { image: prescriptionBase64 });

            if (!prescriptionResponse.url) {
                showNotification('Prescription upload failed.', 'error');
                isSubmitting = false;
                toggleAllSubmitButtons(false);
                return;
            }

            // Step 2: Submit Order Details
            const grandTotalContainer = document.getElementById(`grand-total-${formId}`);
            const grandTotalInput = grandTotalContainer.querySelector('input[name="grandTotal"]');
            const grandTotal = parseFloat(grandTotalInput.value) || 0;

            const orderData = {
                empId: parseInt(empId),
                employeeName: employeeName,
                docId: docId,
                doctorName: doctorName,
                exId: parseInt(exId),
                dlCopy: dlCopyResponse.url,
                prescription: prescriptionResponse.url,
                total: grandTotal
            };

            const orderApiBody = { form: 'orders', data: orderData };
            const orderResponse = await apiFetch('employee/forms-submit', 'POST', orderApiBody);

            if (!orderResponse.success || !orderResponse.insertId) {
                const errorMessage = orderResponse.message || 'Order submission failed.';
                showNotification(errorMessage, 'error');
                isSubmitting = false;
                toggleAllSubmitButtons(false);
                return;
            }

            const orderId = orderResponse.insertId;

            // Step 3: Submit Each Product
            const productsContainer = document.getElementById(`products-container-${formId}`);
            const productRows = productsContainer.querySelectorAll('.product-row');

            const productsArray = [];

            for (const row of productRows) {
                const selectElement = row.querySelector('select[name="productName"]');
                const stripsInput = row.querySelector('input[name="strips"]');
                const freeStripsInput = row.querySelector('input[name="freeStrips"]');

                const pId = parseInt(selectElement.getAttribute('data-p-id'));
                const productName = selectElement.value;
                const strips = parseInt(stripsInput.value);
                const freeStrips = parseInt(freeStripsInput.value);

                const orderedProductData = {
                    orderId: orderId,
                    pId: pId,
                    strips: strips,
                    freeStrips: freeStrips
                };

                const productApiBody = { form: 'orderedProducts', data: orderedProductData };
                const productResponse = await apiFetch('employee/forms-submit', 'POST', productApiBody);

                if (!productResponse.success) {
                    showNotification(`Failed to submit product: ${productName}`, 'error');
                    isSubmitting = false;
                    toggleAllSubmitButtons(false);
                    return;
                }

                // Store product details for message
                productsArray.push({
                    productName: productName,
                    strips: strips,
                    freeStrips: freeStrips
                });
            }

            // Step 4: Show Stockist/C&F Buttons
            showNotification('Order submitted successfully!', 'success');

            // Hide submit button
            submitButton.style.display = 'none';

            // Create button container
            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = 'display: flex; gap: 10px; margin-top: 15px; flex-wrap: wrap;';
            let productsListText = '';
            // Format products list as string
            productsArray.forEach((product, index) => {
                productsListText += `${index + 1}. ${product.productName} – ${product.strips} Strips - ${product.freeStrips} Free Strips\n`;
            });
            // Prepare message data for template (you can use this in your template)
            const messageData = {
                doctorName: doctorName,
                doctorPhone: formContainer.querySelector('#phone').value.trim(),
                doctorAddress: formContainer.querySelector('#address').value.trim(),
                products: productsListText,
                grandTotal: grandTotal,
                employeeName: employeeName,
                exName: exName,
                dlCopy: dlCopyResponse.url,
                prescription: prescriptionResponse.url
            };

            // Convert to string for message variable
            const message = `Please arrange immediate delivery of the following order to Dr. ${messageData.doctorName} 👨‍⚕️

👤 Representative: ${messageData.employeeName}

📋 Order Details:
👨‍⚕️ Doctor: ${messageData.doctorName}
📞 Phone: ${messageData.doctorPhone},
🏠 Address: ${messageData.doctorAddress}
🧾 DL Copy: ${messageData.dlCopy}
💊 Prescription: ${messageData.prescription}

🧃 Products Ordered:
${messageData.products}

💰 Total Amount: ₹${messageData.grandTotal}

⏰ Kindly prioritize this delivery and ensure it reaches Dr. Suresh Kumar as soon as possible today.
Every minute counts, let’s make it quick! ⚡💨

Thank you 🙏
Citrix Ltd Team.`;

            console.log(message);

            // Stockist Button
            const stockistBtn = document.createElement('button');
            stockistBtn.type = 'button';
            stockistBtn.classList.add('btn-primary');
            stockistBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send to Stockist';
            stockistBtn.style.cssText = 'flex: 1; padding: 12px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;';
            stockistBtn.addEventListener('click', async () => {
                await sendMessageToRecipient('stockist', message, buttonContainer, formContainer);
            });

            // C&F Button
            const candfBtn = document.createElement('button');
            candfBtn.type = 'button';
            candfBtn.classList.add('btn-primary');
            candfBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send to C&F';
            candfBtn.style.cssText = 'flex: 1; padding: 12px 20px; background: #17a2b8; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;';
            candfBtn.addEventListener('click', async () => {
                await sendMessageToRecipient('candf', message, buttonContainer, formContainer);
            });

            buttonContainer.appendChild(stockistBtn);
            buttonContainer.appendChild(candfBtn);
            formContainer.appendChild(buttonContainer);

        } catch (error) {
            console.error('Order submission error:', error);
            showNotification('An error occurred during order submission.', 'error');
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fa-solid fa-save"></i> Submit';
        }
    };

    // --- Send Message to Stockist or C&F ---
    const sendMessageToRecipient = async (recipient, message, buttonContainer, formContainer) => {
        try {
            const response = await apiFetch('employee/send-message', 'POST', {
                exId: parseInt(exId),
                to: recipient,
                message: message
            });

            if (response.success) {
                showNotification(`Message sent to ${recipient === 'stockist' ? 'Stockist' : 'C&F'} successfully!`, 'success');

                // Hide buttons and form
                buttonContainer.style.display = 'none';
                formContainer.style.display = 'none';

                // ✅ Reset flag and enable other buttons
                isSubmitting = false;
                toggleAllSubmitButtons(false);
            } else {
                const errorMessage = response.message || 'Failed to send message.';
                showNotification(errorMessage, 'error');
            }
        } catch (error) {
            console.error('Send message error:', error);
            showNotification('An error occurred while sending message.', 'error');
        }
    };

    // --- Submit existing doctor activity (Order Status = No) ---
    const submitExistingDoctor = async (formContainer, submitButton) => {
        const docId = parseInt(submitButton.getAttribute('data-doc-id'));
        const feedbackInput = formContainer.querySelector('#feedback');
        const orderStatusInput = formContainer.querySelector('#orderStatus');

        const submissionData = {
            docId: docId,
            empId: parseInt(empId),
            employeeName: employeeName,
            feedback: feedbackInput.value.trim(),
            orderStatus: orderStatusInput.checked ? 'Yes' : 'No'
        };

        const apiBody = { form: 'doctorActivities', data: submissionData };
        const response = await apiFetch('employee/forms-submit', 'POST', apiBody);

        if (response.success) {
            showNotification('Doctor activity submitted successfully.', 'success');
            formContainer.style.display = 'none';
            // ✅ Reset flag and enable other buttons
            isSubmitting = false;
            toggleAllSubmitButtons(false);
        } else {
            const errorMessage = response.message || 'Doctor activity submission failed.';
            showNotification(errorMessage, 'error');
            isSubmitting = false;
            toggleAllSubmitButtons(false);
        }
    };

    // --- Submit new doctor (two-step process - Order Status = No) ---
    const submitNewDoctor = async (formContainer, submitButton) => {
        const doctorNameInput = formContainer.querySelector('#doctorName');
        const addressInput = formContainer.querySelector('#address');
        const phoneInput = formContainer.querySelector('#phone');
        const feedbackInput = formContainer.querySelector('#feedback');
        const orderStatusInput = formContainer.querySelector('#orderStatus');

        const newDoctorData = {
            doctorName: doctorNameInput.value.trim(),
            phone: parseInt(phoneInput.value.trim()),
            address: addressInput.value.trim(),
            exId: parseInt(exId)
        };

        const doctorApiBody = { form: 'doctors', data: newDoctorData };
        const doctorResponse = await apiFetch('employee/forms-submit', 'POST', doctorApiBody);

        if (!doctorResponse.success || !doctorResponse.insertId) {
            const errorMessage = doctorResponse.message || 'Failed to create new doctor.';
            showNotification(errorMessage, 'error');
            isSubmitting = false;
            toggleAllSubmitButtons(false);
            return;
        }

        const newDocId = doctorResponse.insertId;

        const activityData = {
            docId: newDocId,
            empId: parseInt(empId),
            employeeName: employeeName,
            feedback: feedbackInput.value.trim(),
            orderStatus: orderStatusInput.checked ? 'Yes' : 'No'
        };

        const activityApiBody = { form: 'doctorActivities', data: activityData };
        const activityResponse = await apiFetch('employee/forms-submit', 'POST', activityApiBody);

        if (activityResponse.success) {
            showNotification('New doctor and activity submitted successfully.', 'success');
            formContainer.style.display = 'none';

            // ✅ Reset flag and enable other buttons
            isSubmitting = false;
            toggleAllSubmitButtons(false);
        } else {
            const errorMessage = activityResponse.message || 'Doctor activity submission failed.';
            showNotification(errorMessage, 'error');
            isSubmitting = false;
            toggleAllSubmitButtons(false);
        }
    };

    // --- Initialize ---
    await fetchAndDisplayDoctors();
}