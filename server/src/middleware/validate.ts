import { Request, Response, NextFunction } from 'express';

const validateRules = (value: any, rules: string[]) => {
  for (const rule of rules) {
    const [ruleName, ruleValue] = rule.split(':');
    switch (ruleName) {
      case 'required':
        if (!value) return `${ruleName} validation failed`;
        break;
      case 'email':
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (!emailRegex.test(value)) return `${ruleName} validation failed`;
        break;
      case 'min':
        if (value.length < parseInt(ruleValue)) return `${ruleName} validation failed`;
        break;
      case 'max':
        if (value.length > parseInt(ruleValue)) return `${ruleName} validation failed`;
        break;
      case 'uuid':
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(value)) return `${ruleName} validation failed`;
        break;
      // Add more rules as needed
    }
  }
  return null;
};

export const validate = (rules: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: any = {};

    for (const [location, fields] of Object.entries(rules)) {
      if (typeof fields === 'object') {
        for (const [field, fieldRules] of Object.entries(fields)) {
          const value = req[location][field];
          const error = validateRules(value, fieldRules.split('|'));
          if (error) {
            errors[field] = error;
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