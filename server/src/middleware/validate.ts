import { Request, Response, NextFunction } from 'express';

export const validate = (rules: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: any = {};

    const validateField = (value: any, rule: string) => {
      const [ruleName, ruleValue] = rule.split(':');
      switch (ruleName) {
        case 'required':
          return value !== undefined && value !== null && value !== '';
        case 'email':
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
        case 'min':
          return typeof value === 'string' && value.length >= parseInt(ruleValue);
        case 'max':
          return typeof value === 'string' && value.length <= parseInt(ruleValue);
        case 'uuid':
          return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(value);
        case 'numeric':
          return !isNaN(value);
        case 'boolean':
          return typeof value === 'boolean';
        case 'array':
          return Array.isArray(value);
        case 'date':
          return !isNaN(Date.parse(value));
        default:
          return true;
      }
    };

    for (const field in rules) {
      const fieldRules = rules[field].split('|');
      for (const rule of fieldRules) {
        if (!validateField(req.body[field], rule)) {
          errors[field] = errors[field] || [];
          errors[field].push(`Invalid ${field} for rule ${rule}`);
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(422).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Validation failed.', details: errors } });
    }

    next();
  };
};