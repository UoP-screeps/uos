import {assert} from "chai";
import { DataService } from "../../../src/memory/DataService";
import { Container } from "typescript-ioc";

describe("data service", function() {
    it("should create a collection", function() {
        const dataService = Container.get(DataService);
        const collectionName = "test";
        dataService.createCollection(collectionName);
        assert(dataService.exists(collectionName));
        assert.exists(dataService.getCollection(collectionName));
    });
});