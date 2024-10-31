export const formatValidationErrors = (errors) => {
  return errors.reduce((acc, error) => {
    acc[error.path] = error.msg;
    return acc;
  }, {});
};
