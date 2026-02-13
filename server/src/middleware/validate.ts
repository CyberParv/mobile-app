import { Request, Response, NextFunction } from 'express';

export const validate = (rules: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: any = {};

    for (const [location, fields] of Object.entries(rules)) {
      if (typeof fields === 'object') {
        for (const [field, fieldRules] of Object.entries(fields)) {
          const value = req[location as keyof Request][field];
          const rulesArray = fieldRules.split('|');

          for (const rule of rulesArray) {
            const [ruleName, ruleValue] = rule.split(':');

            if (ruleName === 'required' && !value) {
              errors[field] = `${field} is required`;
            }

            if (ruleName === 'email' && value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
              errors[field] = `${field} must be a valid email`;
            }

            if (ruleName === 'min' && value && value.length < parseInt(ruleValue)) {
              errors[field] = `${field} must be at least ${ruleValue} characters`;
            }

            if (ruleName === 'max' && value && value.length > parseInt(ruleValue)) {
              errors[field] = `${field} must be no more than ${ruleValue} characters`;
            }

            if (ruleName === 'uuid' && value && !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(value)) {
              errors[field] = `${field} must be a valid UUID`;
            }

            if (ruleName === 'numeric' && value && isNaN(Number(value))) {
              errors[field] = `${field} must be numeric`;
            }

            if (ruleName === 'boolean' && value && typeof value !== 'boolean') {
              errors[field] = `${field} must be a boolean`;
            }

            if (ruleName === 'array' && value && !Array.isArray(value)) {
              errors[field] = `${field} must be an array`;
            }

            if (ruleName === 'date' && value && isNaN(Date.parse(value))) {
              errors[field] = `${field} must be a valid date`;
            }
          }
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(422).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Validation failed', details: errors } });
    }

    next();
  };
};