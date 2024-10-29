export const formatValidationErrors = (errors: any[]) => {
    return errors.reduce((acc: Record<string, string>, error) => {
        acc[error.path] = error.msg;
        return acc;
    }, {});
};