import { rest } from "msw";
import { setupServer } from "msw/node";
import { beforeAll, expect, test, afterAll } from "vitest";
import {
  fetchConfig,
  getAvailableSlotsFromConfig,
  getUsedSlotsFromDB,
  slotAvailable,
} from "./register";

import type { SetupServerApi } from "msw/node";
import { prisma } from "~/db.server";
import type { User } from "@prisma/client";

let worker: SetupServerApi;

const testUser: {
  // tos: boolean;
  // socialNetworks: boolean;
  createdAt: Date;
  updatedAt: Date;
  currentPrivateSubmissions: number;
  currentPublicSubmissions: number;
  age: string;
  country: boolean;
  ticket: string;
  gender: string;
} = {
  ticket: "fox",
  country: true,
  // tos: true,
  age: "18-24",
  gender: "w",
  // socialNetworks: true,
  createdAt: new Date(),
  currentPrivateSubmissions: 0,
  currentPublicSubmissions: 0,
  updatedAt: new Date(),
};

const testConfig = `
---
distribution:
  18-24: 10
  25-29: 10
  30-34: 10
  35-39: 10
  40-44: 10
  45-49: 10
  50-54: 10
  55-59: 10
  60-64: 10
  65-67: 10
male-percentage: 40
female-percentage: 40
      `;
const endpoint = (path: string) => `http://localhost${path}`;

const deleteAll = () => prisma.user.deleteMany();

beforeAll(() => {
  // msw
  const configHandler = rest.get(endpoint("/config"), (_req, res, ctx) => {
    return res(ctx.status(200), ctx.text(testConfig));
  });

  worker = setupServer(...[configHandler]);

  worker.listen();
});

beforeEach(async () => {
  await deleteAll();
});

afterEach(async () => {
  await deleteAll();
});

afterAll(async () => {
  worker.close();
});

test("should retrieve the test config", async () => {
  const config = await fetchConfig(endpoint("/config"));

  expect(config).toBeDefined();
  expect(config.distribution).toBeDefined();
  expect(config.distribution["18-24"]).toBe(10);
  expect(config["male-percentage"]).toBe(40);
  expect(config["female-percentage"]).toBe(40);
});

test("should validate the config percentiles", async () => {
  const config = await fetchConfig(endpoint("/config"));
  const dist = getAvailableSlotsFromConfig(config, "18-24");
  expect(dist.w).toBe(4);
  expect(dist.m).toBe(4);
  expect(dist.d).toBe(2);
});

test.fails(
  "should fail if non-present age-rage is going to be admitted",
  async () => {
    const config = await fetchConfig(endpoint("/config"));
    getAvailableSlotsFromConfig(config, "19-24");
  }
);

test("should retrieve used slots from the database", async () => {
  await prisma.user.createMany({
    data: [testUser, testUser, testUser, testUser],
  });

  const dist = await getUsedSlotsFromDB("18-24");

  expect(dist).toBeDefined();
  expect(dist).toEqual({
    w: 4,
    m: 0,
    d: 0,
  });
});

test.todo("should have only female and diverse if men quota is met");
test.todo("should have only male and diverse if men quota is met");
test.todo("should assert, that male and diverse quota meets the percentiles");
test.todo("should assert, that female and diverse quota meets the percentiles");
test.todo(
  "should assert, that after diverse is full, only male and female quotas are free"
);
test.todo("should register a user via the action function");

test.fails("should fail, if the female quota is met", async () => {
  const config = await fetchConfig(endpoint("/config"));
  for (let index = 0; index < 11; index++) {
    await prisma.user.create({ data: testUser });
    const isAvailable = await slotAvailable(
      config,
      testUser.age,
      testUser.gender as "w" | "m" | "d"
    );
    expect(isAvailable).toBeTruthy();
  }
});
test.fails("should fail, if the male quota is met", async () => {
  const config = await fetchConfig(endpoint("/config"));
  for (let index = 0; index < 11; index++) {
    const user = await prisma.user.create({
      data: { ...testUser, gender: "m" },
    });
    const isAvailable = await slotAvailable(
      config,
      testUser.age,
      testUser.gender as "w" | "m" | "d"
    );
    const count = await prisma.user.count({ where: { gender: "m" } });
    console.log({ user, count, isAvailable });

    expect(isAvailable).toBeTruthy();
  }
});
