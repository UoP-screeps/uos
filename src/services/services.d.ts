
interface Logistics {
    setResourceLevel(object: Storable, resourceType: ResourceConstant, min: number, max: number): void;

    run(): void
}

interface Memory {
    services: Services;
}

interface Services {
    logistics: {
        setLevels: SetLevels;
    }
}

type SetLevels = {
    [id: string]: {
        [resourceType in ResourceConstant]?: [number, number];
    }
};

