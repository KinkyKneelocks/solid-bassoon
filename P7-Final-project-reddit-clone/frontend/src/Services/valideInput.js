const validateInput = (rules, input) => {
    let errorMsgs = []
    
    for (let i = 0; rules.length > i; i++) {
        let regexp = new RegExp(rules[i].regexp)
        if (regexp.test(input) === rules[i].valid) {
            errorMsgs.push(rules[i].errormsg)
        }
    }
    if (!input) {
        errorMsgs.unshift("Field cannot be empty")
    }        
    return errorMsgs      
}

export default validateInput