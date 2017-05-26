class DatPayment {
    constructor(options) {
        this.options = options;

        this.form = document.querySelector(this.options.form_selector);

        this.input_number = document.querySelector(this.options.number_selector);
        this.input_expiry = document.querySelector(this.options.date_selector);
        this.input_cvc = document.querySelector(this.options.cvc_selector);
        this.input_name = document.querySelector(this.options.name_selector);

        this.submit_button = document.querySelector(this.options.submit_button_selector);
        this.form_locked = false;

        this.validators = this.options.validators;

        this.card = null;


        this.validation_class = {
            'success': 'dpf-row-valid',
            'error': 'dpf-row-invalid'
        };

        this.initForm();
        this.initCard();
        this.initEvents();
    }

    initForm() {
        this.input_number.placeholder = this.options.placeholders.number;
        this.input_expiry.placeholder = this.options.placeholders.expiry;
        this.input_cvc.placeholder = this.options.placeholders.cvc;
        this.input_name.placeholder = this.options.placeholders.name;
    }

    getFormData() {
        return {
            number: this.getValue('number'),
            expiry: this.getValue('expiry'),
            expiry_month: this.getValue('expiry_month'),
            expiry_year: this.getValue('expiry_year'),
            cvc: this.getValue('cvc'),
            name: this.getValue('name')
        };
    }

    initEvents() {
        this.form.addEventListener('submit', (e) => {
            this.onSubmit(e);
        });

        let inputs = this.form.querySelectorAll("input");
        [].forEach.call(inputs, (input) => {
            let type = input.getAttribute('data-type');
            if (null !== type) {
                input.addEventListener('focus', (e) => {
                    this.form.dispatchEvent(new CustomEvent('payment_form:field_validation_reset', {'detail': input}));
                });
                input.addEventListener('blur', (e) => {
                    this.validateField(e.target.getAttribute('data-type'), e.target.value);
                });
            }
        });


        this.form.addEventListener('payment_form:field_validation_reset',(e) => {
            var input_row = this.findRowFromInput(e.detail);
            if(input_row.classList.contains(this.validation_class.success)) {
                input_row.classList.remove(this.validation_class.success)
            }

            if(input_row.classList.contains(this.validation_class.error)) {
                input_row.classList.remove(this.validation_class.error)
            }
        });

        this.form.addEventListener('payment_form:field_validation_failed',(e) => {
            var input_row = this.findRowFromInput(e.detail);
            if(input_row.classList.contains(this.validation_class.success)) {
                input_row.classList.remove(this.validation_class.success)
            }

            if(!input_row.classList.contains(this.validation_class.error)) {
                input_row.classList.add(this.validation_class.error)
            }
        });

        this.form.addEventListener('payment_form:field_validation_success',(e) => {
            var input_row = this.findRowFromInput(e.detail);

            if(input_row.classList.contains(this.validation_class.error)) {
                input_row.classList.remove(this.validation_class.error)
            }

            if(!input_row.classList.contains(this.validation_class.success)) {
                input_row.classList.add(this.validation_class.success)
            }
        });
    }

    findRowFromInput(input) {
        var nb_try = 0;
        do {
            nb_try++;
            var parent = input.parentNode;

        } while(!parent.classList.contains('dpf-input-container') || nb_try<=4);

        return parent;
    }

    getValue(field_name) {
        switch (field_name) {
            case 'number':
            case 'name':
            case 'cvc':
            case 'expiry':
                return this['input_' + field_name + ''].value;
                break;

            case 'expiry_month':
            case 'expiry_year':
                var expiry = this.input_expiry.value.split('/');
                return expiry[field_name == "expiry_month" ? 0 : 1].trim() || '';
                break;
        }
    }

    validateForm() {
        var values = this.getFormData();
        var is_valid = true;
        for (let field_name in values) {
            if ("undefined" !== typeof(this.validators[field_name])) {
                is_valid &= this.validateField(field_name, values[field_name]);
            }
        }
        return is_valid;
    }

    validateField(field_name, field_value) {
        var is_valid = true;
        if ('undefined' !== typeof(this.validators[field_name])) {
            is_valid = this.validators[field_name](field_value);
        }

        if (!is_valid) {
            this.form.dispatchEvent(new CustomEvent('payment_form:field_validation_failed', {'detail': this['input_' + field_name]}));
        } else {
            this.form.dispatchEvent(new CustomEvent('payment_form:field_validation_success', {'detail': this['input_' + field_name]}));
        }

        return is_valid;
    }

    onSubmit(e) {
        e.preventDefault();
        e.stopPropagation();

        if(!this.form_locked) {
            this.lockForm();

            var form_is_valid = this.validateForm();
            if (form_is_valid) {
                this.form.dispatchEvent(new CustomEvent('payment_form:submit', {'detail': this.getFormData()}));
            } else {
                this.unlockForm();
            }
        }
        return false;
    }

    unlockForm() {
        if(this.submit_button.classList.contains('loading')) {
            this.submit_button.classList.remove('loading');
        }

        this.form_locked = false;
    }

    lockForm() {
        this.submit_button.classList.add('loading');

        this.form_locked = true;
    }

    initCard(){

        this.card = new Card({
            form: this.options.form_selector,
            container: this.options.card_container_selector,

            formSelectors: {
                numberInput: this.options.number_selector,
                expiryInput: this.options.date_selector,
                cvcInput: this.options.cvc_selector,
                nameInput: this.options.name_selector
            },

            width: 300,
            formatting: true,

            messages: {
                validDate: 'valid\ndate',
                monthYear: 'mm/yy',
            },

            placeholders: {
                number: this.options.placeholders.number,
                expiry: this.options.placeholders.expiry,
                cvc: this.options.placeholders.cvc,
                name: this.options.placeholders.name
            },
            debug: false
        });
    }
}