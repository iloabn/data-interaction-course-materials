/**
 * DO NOT EDIT THIS FILE!
 */

import { describe, it } from "mocha";
import { expect } from "chai";
import mongodb from "mongodb";
import { populateDb } from "./utils/populate-db.js";
import * as exercises from "./exercises.js";

const MONGODB_URL = "mongodb://localhost:27017";
const MONGODB_DB = "mongodb-exercises";
const MONGODB_COLLECTION = "digimons";

describe("Digimon data tests", () => {
  let client;
  let db;

  before(async () => {
    await populateDb(MONGODB_URL, MONGODB_DB, MONGODB_COLLECTION);

    const mongoClient = new mongodb.MongoClient(MONGODB_URL);
    await mongoClient.connect();

    client = mongoClient;
    db = mongoClient.db(MONGODB_DB);
  });

  after(async () => {
    await client.close();
  });

  describe("Easier", () => {
    it("find_all_digimons", async () => {
      const result = await exercises.find_all_digimons(db);

      expect(result).to.have.lengthOf(249);
    });

    it("find_all_water_digimons", async () => {
      const result = await exercises.find_all_water_digimons(db);

      expect(result).to.all.satisfy(
        (ds) => ds.every((d) => d.attribute === "Water"),
        "All must be Water"
      );
      expect(result).to.have.lengthOf(24);
    });

    it("find_all_baby_digimons", async () => {
      const result = await exercises.find_all_baby_digimons(db);

      expect(result).to.all.satisfy(
        (ds) => ds.every((d) => d.stage === "Baby"),
        "All must be Baby"
      );
      expect(result).to.have.lengthOf(5);
    });

    it("find_bakemon", async () => {
      const result = await exercises.find_bakemon(db);

      expect(result).to.have.property("digimon", "Bakemon");
    });

    it("add_mongomon", async () => {
      await exercises.add_mongomon(db);

      const mongomon = await db
        .collection(MONGODB_COLLECTION)
        .findOne({ digimon: "Mongomon" });
      const count = await db.collection(MONGODB_COLLECTION).countDocuments();

      expect(mongomon).to.have.property("number", 250);
      expect(count).to.eql(250);
    });
  });

  describe("Intermediate", () => {
    it("find_all_fire_champions", async () => {
      const result = await exercises.find_all_fire_champions(db);

      expect(result).to.all.satisfy(
        (ds) => ds.every((d) => d.stage === "Champion"),
        "All must be Champions"
      );
      expect(result).to.all.satisfy(
        (ds) => ds.every((d) => d.attribute === "Fire"),
        "All must be Fire"
      );
      expect(result).to.have.lengthOf(10);
    });

    it("find_all_digimons_with_lv50HP_below_540", async () => {
      const result = await exercises.find_all_digimons_with_lv50HP_below_540(
        db
      );

      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.have.property("digimon", "Impmon");
    });

    it("find_all_free_wind_rookie_digimons", async () => {
      const result = await exercises.find_all_free_wind_rookie_digimons(db);

      expect(result).to.have.lengthOf(1);
      expect(result[0]).to.have.property("digimon", "Hawkmon");
    });

    it("increase_beelzemons_hp_with_320", async () => {
      await exercises.increase_beelzemons_hp_with_320(db);

      const beelzemon = await db
        .collection(MONGODB_COLLECTION)
        .findOne({ digimon: "Beelzemon" });

      expect(beelzemon).to.have.property("lv50HP", 2000);
    });
  });

  describe("Harder", () => {
    it("find_the_digimon_with_the_strongest_attack", async () => {
      const result = await exercises.find_the_digimon_with_the_strongest_attack(
        db
      );

      expect(result).to.have.property("digimon", "Chaosmon");
    });

    it("find_the_least_intelligent_digimon", async () => {
      const result = await exercises.find_the_least_intelligent_digimon(db);

      expect(result).to.have.property("digimon", "Punimon");
    });

    it("find_digimons_number_196_to_200", async () => {
      const expectedDigimons = [
        "Diaboromon",
        "Creepymon",
        "Gallantmon",
        "Dynasmon",
        "Leopardmon",
      ];

      const result = await exercises.find_digimons_number_196_to_200(db);
      const names = result.map((d) => d.digimon);

      expect(result).to.have.lengthOf(5);
      expectedDigimons.forEach((digimon) => {
        expect(names).to.include(digimon);
      });
    });

    it("find_all_digimons_with_name_beginning_with_F", async () => {
      const expectedDigimons = ["Falcomon", "Frigimon", "Flamedramon"];

      const result =
        await exercises.find_all_digimons_with_name_beginning_with_F(db);
      const names = result.map((d) => d.digimon);

      expect(result).to.have.lengthOf(3);
      expectedDigimons.forEach((digimon) => {
        expect(names).to.include(digimon);
      });
    });

    it("calculate_the_total_attack", async () => {
      const totalAttack = await exercises.calculate_the_total_attack(db);

      expect(totalAttack).to.be.a("number");
      expect(totalAttack).to.eql(31075);
    });

    it("calculate_the_total_SP_for_all_dark_digimons", async () => {
      const totalSP =
        await exercises.calculate_the_total_SP_for_all_dark_digimons(db);

      expect(totalSP).to.be.a("number");
      expect(totalSP).to.eql(4749);
    });
  });
});
