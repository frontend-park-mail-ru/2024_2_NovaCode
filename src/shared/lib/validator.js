export const validate = (input, rules) => {
  const errorRule = rules.find((rule) => !rule.pattern.test(input));

  return errorRule ? errorRule.name : null;
};
