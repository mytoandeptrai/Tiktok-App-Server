export const convertSomethingToString = (something: any) => {
   return JSON.stringify(something);
};

export const parseStringFromJSON = (convertedJson: string) => {
   return JSON.parse(convertedJson);
};
