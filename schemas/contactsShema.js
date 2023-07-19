import Joi from "joi";

const contactsShema = Joi.object({
  name: Joi.string().min(3).max(21).required().messages({
    "string.pattern.base":
      "'name' mustn't include less than 3 and more than 21 letters",
    "any.required": "missing required field 'name'",
  }),
  email: Joi.string().email().required().messages({
    "string.pattern.base": "Please provide a valid email address",
    "any.required": "missing required field 'email'",
  }),
  // in this validation, phone number must include '+' symbol
  phone: Joi.string()
    .pattern(/^\+(?:[0-9] ?){6,14}[0-9]$/)
    .required()
    .messages({
      "string.pattern.base":
        "The phone number must start with a '+' sign followed by 6 to 14 digits.",
      "any.required": "missing required field 'phone'",
    }),
});

export default contactsShema;
