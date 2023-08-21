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
    "any.only":
      "subscription must be one of these selections: 'starter', 'pro', 'business'",
  }),
});

const userUpdatePlan = Joi.object({
  subscription: Joi.string()
    .valid("starter", "pro", "business")
    .required()
    .messages({
      "any.required":
        "subscription field is required. It must be one of these selections: 'starter', 'pro', 'business'",
      "any.only":
        "subscription field must be one of these selections: 'starter', 'pro', 'business'",
    }),
});

const userEmailSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.pattern.base": "Please provide a valid email address",
    "any.required": "missing required field 'email'",
  }),
});

export default { authSchema, userUpdatePlan, userEmailSchema };
