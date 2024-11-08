import { example, exampleModel } from "./types.ts";

export const fromModelToExample = (Model: exampleModel): example => {
  return {
    id: Model._id!.toString(),
    name: Model.name,
    age: Model.age,
  };
};
