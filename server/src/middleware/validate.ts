import { Request, Response, NextFunction } from 'express';

interface ValidationRules {
  [key: string]: string;
}

export const validate = (rules: { body?: ValidationRules, params?: ValidationRules, query?: ValidationRules }) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: any = {};

    const validateField = (value: any, ruleString: string) => {
      const rules = ruleString.split('|');
      for (const rule of rules) {
        const [ruleName, ruleValue] = rule.split(':');
        switch (ruleName) {
          case 'required':
            if (!value) return 'Field is required';
            break;
          case 'email':
            const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
            if (!emailRegex.test(value)) return 'Invalid email format';
            break;
          case 'min':
            if (value.length < parseInt(ruleValue)) return `Minimum length is ${ruleValue}`;
            break;
          case 'max':
            if (value.length > parseInt(ruleValue)) return `Maximum length is ${ruleValue}`;
            break;
          case 'uuid':
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            if (!uuidRegex.test(value)) return 'Invalid UUID format';
            break;
          case 'numeric':
            if (isNaN(value)) return 'Must be a number';
            break;
          case 'boolean':
            if (typeof value !== 'boolean') return 'Must be a boolean';
            break;
          case 'array':
            if (!Array.isArray(value)) return 'Must be an array';
            break;
          case 'date':
            if (isNaN(Date.parse(value))) return 'Invalid date format';
            break;
          default:
            break;
        }
      }
      return null;
    };

    const validateObject = (obj: any, rules: ValidationRules, path: string) => {
      for (const key in rules) {
        const error = validateField(obj[key], rules[key]);
        if (error) {
          errors[`${path}.${key}`] = error;
        }
      }
    };

    if (rules.body) validateObject(req.body, rules.body, 'body');
    if (rules.params) validateObject(req.params, rules.params, 'params');
    if (rules.query) validateObject(req.query, rules.query, 'query');

    if (Object.keys(errors).length > 0) {
      return res.status(422).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Validation failed', details: errors } });
    }

    next();
  };
};