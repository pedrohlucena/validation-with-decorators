interface ValidatorConfig {
    [property: string]: {
        [validatableProperty: string]: string[]
    }
}

const registeredValidators: ValidatorConfig = {}

function Required(target: any, propertyName: string) {
    registeredValidators[target.constructor.name] = {
        [propertyName]: ['required']
    }
}

function PositiveNumber(target: any, propertyName: string) {
    registeredValidators[target.constructor.name] = {
        [propertyName]: ['positive']
    }
}

function validate(obj: any) {
    const objValidatorConfig = registeredValidators[obj.constructor.name] 
    if(!objValidatorConfig) { return true }

    for(const property in objValidatorConfig ) {
        console.log(property)
        
        let isValid = true
        for(const validator of objValidatorConfig[property]) {
            switch(validator) {
                case 'required': 
                    isValid = isValid && !!obj[property]
                    break
                case 'positive':
                    isValid = isValid && obj[property] > 0
                    break
            }
        }
    }
    return isValid
}

class Course {
    @Required
    title: string
    @PositiveNumber
    price: number

    constructor(title: string, price: number) {
        this.title = title
        this.price = price
    }
}

const courseForm = document.querySelector('form')!

courseForm.addEventListener('submit', event => {
    event.preventDefault()
    const titleEl = document.getElementById('title') as HTMLInputElement
    const priceEl = document.getElementById('price') as HTMLInputElement

    const title = titleEl.value
    const price = +priceEl.value

    const createdCourse = new Course(title, price)

    if(!validate(createdCourse)) {
        alert('Invalid input, please try again')
        return
    }

    console.log('Curso criado!')
    console.log(createdCourse)
})