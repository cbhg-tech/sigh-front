import { ValidationError } from 'yup';
import { Error } from '../types/Error';

export function handleFormErrors(err: ValidationError): Error {
  const error: Error = {};

  err.inner.forEach((e: ValidationError) => {
    if (e.path) error[e.path] = e.message;
  });

  return error;
}
