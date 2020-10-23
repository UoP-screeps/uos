/* eslint-disable */

const decoratorSymbol = Symbol("$decorator");

export const Configurable = function(value = true): PropertyDecorator {
    return function(target, propertyKey) {
        const newProperty: PropertyDescriptor = {
            get() {
                return undefined;
            },
            set(v: any) {
                const property = getTargetDescriptor(target);
                property.value = v;
                Object.defineProperty(target, propertyKey, property);
            },
            configurable: true
        };
        setTargetDescriptor(target, {
            configurable: value
        })
        Object.defineProperty(target, propertyKey, newProperty);
    };
};


function getTargetDescriptor(target: any) : PropertyDescriptor {
    if(!target.hasOwnProperty(decoratorSymbol)) {
        Object.defineProperty(target, decoratorSymbol, {
            value: {},
            configurable: true,
            enumerable: false
        });
    }
    return target[decoratorSymbol] as PropertyDescriptor;
}

function setTargetDescriptor(target: any, value: PropertyDescriptor) : void {
    const descriptor = getTargetDescriptor(target);
    Object.assign(descriptor, value);
    Object.defineProperty(target, decoratorSymbol, {
        value: descriptor,
        configurable: true,
        enumerable: false
    });
}