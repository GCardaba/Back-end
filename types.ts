import type { OptionalId } from "mongodb";

export type example = {
  id: string;
  name: string;
  age: number;
};

export type exampleModel = OptionalId<{
  name: string;
  age: number;
}>;
