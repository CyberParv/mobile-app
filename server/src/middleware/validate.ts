import { Request, Response, NextFunction } from 'express';

const validateRules = (rules: string, value: any) => {
  const errors: string[] = [];
  const ruleList = rules.split('|');

  ruleList.forEach(rule => {
    const [ruleName, param] = rule.split(':');
    switch (ruleName) {
      case 'required':
        if (!value) errors.push('Field is required');
        break;
      case 'email':
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) errors.push('Invalid email');
        break;
      case 'min':
        if (value.length < parseInt(param)) errors.push(`Minimum length is ${param}`);
        break;
      case 'max':
        if (value.length > parseInt(param)) errors.push(`Maximum length is ${param}`);
        break;
      case 'uuid':
        if (!/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(value)) errors.push('Invalid UUID');
        break;
      // Add other rules as needed
    }
  });

  return errors;
};

export const validate = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: any = {};

    for (const [key, rules] of Object.entries(schema.body || {})) {
      const value = req.body[key];
      const fieldErrors = validateRules(rules as string, value);
      if (fieldErrors.length > 0) errors[key] = fieldErrors;
    }

    if (Object.keys(errors).length > 0) {
      return res.status(422).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Validation failed', details: errors } });
    }

    next();
  };
};