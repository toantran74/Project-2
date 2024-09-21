// đối tượng 'validator'
function validator (options) {
function validate(inputElement, rule) {
    var errorElement = inputElement.parentElement.querySelector(options.errorSelector)
    var errorMessage = rule.test(inputElement.value);
    // console.log(errorMessage)
    if(errorMessage) {
        errorElement.innerText = errorMessage;
        errorElement.parentElement.classList.add('invalid')
    } else{
        errorElement.innerText = '';
        errorElement.parentElement.classList.remove('invalid')
    }

    return !errorMessage
    
}

// console.log(options.form)
var formElement = document.querySelector(options.form)
if(formElement) {
    formElement.onsubmit = function(e) {
        e.preventDefault() ;

        var isFormvalid = true;


    options.rules.forEach(function(rule) {
        var inputElement = formElement.querySelector(rule.selector);
        var isValid =  validate(inputElement, rule)
        if(!isValid) {
            isFormvalid = false
        }
    });
    if (isFormvalid) {
        if(typeof options.onSubmit === 'function') {
            var enableInputs = formElement.querySelectorAll('[name]')
        var formValues = Array.from(enableInputs).reduce(function(values, input) {
        values[input.name] = input.value
        return values
        }, {});
            options.onSubmit(formValues)
        }
    }
    

    }
    // console.log(options.rules)
    options.rules.forEach(function(rule) {
        // console.log(rule.selector)
        var inputElement = formElement.querySelector(rule.selector);
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector)
        // console.log(inputElement)
        if(inputElement) {
            inputElement.onblur = function() {
                // console.log('onblur ' + rule.selector)
                // console.log(inputElement.value)
                // value : inputElement.value
                // test fun : rule.test
                // console.log(rule) 
                validate(inputElement, rule)
            }

            inputElement.oninput = function() {
                errorElement.innerText = '';
                errorElement.parentElement.classList.remove('invalid')
            }
            
        }
    })
}
}
// định nghĩa các rules
validator.isRequired = function(selector) {
return {
    selector: selector,
    test: function(value) {
        return value.trim() ? undefined : 'Vui lòng nhập trường này'
    }
}
}
validator.isEmail = function(selector) {
return {
    selector: selector,
    test: function(value) {
        var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return regex.test(value) ? undefined : "Trường này phải là email!"
    }
}
}
validator.isminLength = function(selector, min) {
    return {
        selector: selector,
        test: function(value) {
            return value.length >= min ? undefined : `Trường này tối thiểu ${min} kí tự`
        }
    }
    }


validator.isconfirmed = function(selector, getConfirmValue) {
    return{
        selector: selector,
        test: function(value) {
            return value === getConfirmValue() ? undefined : "Giá trị nhập vào không chính xác"
        }
    }
}