export class UosLogistics implements Logistics{
    private readonly setLevels: SetLevels;
    constructor(){
        Memory.services.logistics = Memory.services.logistics || {};
        Memory.services.logistics.setLevels = Memory.services.logistics.setLevels || {};
        this.setLevels = Memory.services.logistics.setLevels;
    }

    setResourceLevel(object: Storable, resourceType: ResourceConstant, min: number, max: number): void {
        this.setLevels[object.id] = this.setLevels[object.id] || {};
        this.setLevels[object.id][resourceType] = this.setLevels[object.id][resourceType] || [min, max];
    }

    run(): void {
        return;
    }
}