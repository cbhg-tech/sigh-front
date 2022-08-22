import * as Yup from 'yup';

export async function validateForm(
  data: unknown,
  schema: unknown,
): Promise<void> {
  // @ts-ignore
  const schemaToValidate = Yup.object().shape(schema);

  await schemaToValidate.validate(data, {
    abortEarly: false,
  });
}
