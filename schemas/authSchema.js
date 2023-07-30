import Joi from "joi";

const authSchema = Joi.object({
  password: Joi.string().required().messages({
    "any.required": "missing required field 'password'",
  }),
  email: Joi.string().email().required().messages({
    "string.pattern.base": "Please provide a valid email address",
    "any.required": "missing required field 'email'",
  }),
  subscription: Joi.string().valid("starter", "pro", "business").messages({
    "any.required":
      "subscription value must be one of these secelctions: 'starter'  'pro' 'business'",
  }),
});

export default { authSchema };
