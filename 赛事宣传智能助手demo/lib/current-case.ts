import { pengfeiMarathonCase } from "../cases/pengfei-marathon";
import { assertValidCase } from "./validate-case";

export const currentCase = pengfeiMarathonCase;
assertValidCase(currentCase);
