import { ValidationError } from 'yup';
import { IError } from '../types/Error';

export function handleFormErrors(err: ValidationError): IError {
  const error: IError = {};

  err.inner.forEach((e: ValidationError) => {
    if (e.path) error[e.path] = e.message;
  });

  return error;
}
