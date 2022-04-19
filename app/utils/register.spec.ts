import { rest } from "msw";
import { setupServer } from "msw/node";
import { beforeAll, expect, test, afterAll } from "vitest";
import { fetchConfig, getAvailableSlotsFromConfig } from "./register";

import type { SetupServerApi } from "msw/node";

let worker: SetupServerApi;

const testUser = {
  ticket: "fox",
  country: true,
  tos: true,
  age: "18-24",
  gender: "w",
  socialNetworks: true,
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

beforeAll(() => {
  // msw
  const configHandler = rest.get(endpoint("/config"), (_req, res, ctx) => {
    return res(ctx.status(200), ctx.text(testConfig));
  });

  worker = setupServer(...[configHandler]);

  worker.listen();
});

afterAll(() => {
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

test.todo("should sign up a user");
test("should validate the config percentiles", async () => {
  const config = await fetchConfig(endpoint("/config"));
  const dist = getAvailableSlotsFromConfig(config, "18-24");
  expect(dist.w).toBe(4);
  expect(dist.m).toBe(4);
  expect(dist.d).toBe(2);
  console.log(dist);
});

test.fails(
  "should fail if non-present age-rage is going to be admitted",
  async () => {
    const config = await fetchConfig(endpoint("/config"));
    getAvailableSlotsFromConfig(config, "19-24");
  }
);

test.todo("should have only female and diverse if men quota is met");
test.todo("should have only male and diverse if men quota is met");
test.todo("should assert, that male and diverse quota meets the percentiles");
test.todo("should assert, that female and diverse quota meets the percentiles");
test.todo(
  "should assert, that after diverse is full, only male and female quotas are free"
);
test.todo("should register a user via the action function");

test.todo("should fail, if the male quota is met");
test.todo("should fail, if the female quota is met");
