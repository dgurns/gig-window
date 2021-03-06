import "@testing-library/jest-dom/extend-expect";
import MockDate from "mockdate";
import { server } from "mocks/server";

MockDate.set(new Date("2020-09-24T13:00:00.000Z"));

beforeAll(() => server.listen());

beforeEach(async () => server.resetHandlers());

afterAll(() => server.close());
