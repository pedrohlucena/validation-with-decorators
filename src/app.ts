// function Logger(logString: string) {
//     console.log('Decorator factory 2')
//     return function (constructor: Function) {
//         console.log('Código executado')
//         console.log(logString);
//         console.log(constructor);
//     };
// }


// const person1 = new Person('pedro')
// const person2 = new Person('lucas')
// const person3 = new Person('rafael')

// function WithTemplate(template: string, hookId: string) {
//     console.log('Decorator factory 1')
//     return function<T extends {new(...args: any[]): { name: string }}>(
//         originalConstructor: T
//         ) {
//         console.log('Rendering template')
//         return class extends originalConstructor {
//             constructor(...args: any[]) {
//                 super(...args)
//                 const hookElement = document.getElementById(hookId)
                
//                 if(hookElement) {
//                     hookElement.innerHTML = template
//                     hookElement.querySelector('h1')!.textContent = this.name
//                 }
//             }
//         }
//     } 
// }

// function Log1(target: any, propertyName: string | Symbol) {
//     console.log('Property decorator')
//     console.log(target, propertyName)
// }

// function Log2(target: any, name: String, descriptor: PropertyDescriptor): PropertyDescriptor {
//     console.log('Assessor decorator')
//     console.log(target)
//     console.log(name)
//     console.log(descriptor)
//     return {
//         configurable: true, 
//         enumerable: true,
//         get: () => console.log('banana'),
//         set: undefined
//     }
// }

// function Log3(target: any, name: String, descriptor: PropertyDescriptor) {
//     console.log('Method decorator')
//     console.log(target)
//     console.log(name)
//     console.log(descriptor)
// }

// function Log4(target: any, name: string | Symbol, position: number) {
//     console.log('Function parameter decorator')
//     console.log(target)
//     console.log(name)
//     console.log(position)
// }

// class Product {   
    
//     @Log1
//     title: String
//     private _price: number

//     @Log2
//     set price(value: number) {
//         if(value > 0) {
//             this._price = value
//             return
//         }
//         throw new Error('Invalid price - should be positive!')
//     }

//     constructor(title: String , price: number) {
//         this.title = title
//         this._price = price
//     }

//     @Log3
//     getPriceWithTax(@Log4 tax: number) {
//         return this.price * (1 + tax)
//     }
// }

// function AutoBind(_: any, _2: string, descriptor: PropertyDescriptor) {
//     const originalMethod = descriptor.value
//     const adjDescriptor: PropertyDescriptor = {
//         configurable: true,
//         enumerable: false,
//         get() {
//             const boundFunction = originalMethod.bind(this)
//             return boundFunction
//         }
//     }
//     return adjDescriptor
// }


// class Printer {
//     message = 'This works!'

//     @AutoBind
//     showMessage() {
//         console.log(this.message)
//     }
// }

// const printer = new Printer()

// const button = document.querySelector('button')!
// button.addEventListener('click', printer.showMessage.bind(printer))
// printer.showMessage()

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

function isValid(obj: any) {
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

    if(!isValid(createdCourse)) {
        alert('Invalid input, please try again')
        return
    }

    console.log('Curso criado!')
    console.log(createdCourse)
})