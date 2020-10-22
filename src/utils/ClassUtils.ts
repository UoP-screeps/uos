export default class ClassUtils {
    public static isAssignableTo(subclass: Function, superclass: Function): boolean {
        return subclass.prototype instanceof superclass || subclass === superclass;
    }
}