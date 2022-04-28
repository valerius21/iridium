const sensibleLikert: { fieldText: string; value: string | number }[] = [
  { fieldText: "nicht entscheidbar", value: "nicht entscheidbar" },
  { fieldText: "stimme absolut nicht zu", value: "stimme absolut nicht zu" },
  { fieldText: "stimme nicht zu", value: "stimme nicht zu" },
  { fieldText: "stimme zu", value: "stimme zu" },
  { fieldText: "stimme voll zu", value: "stimme voll zu" },
];

const confirmationLikert: { fieldText: string; value: string | number }[] = [
  { fieldText: "1 - sehr unsicher", value: 1 },
  { fieldText: "2", value: 2 },
  { fieldText: "3", value: 3 },
  { fieldText: "4", value: 4 },
  { fieldText: "5 - sehr sicher", value: 5 },
];
export const questionTwoProps = {
  Bekannte: false,
  Jeden: false,
  Kollegen: false,
  Familie: false,
  Freunde: false,
  Niemanden: false,
};
