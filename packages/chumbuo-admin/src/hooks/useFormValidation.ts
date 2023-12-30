import { useState } from "react";

interface FormData {
  [key: string]: string;
}

interface FormErrors {
  [key: string]: string;
}

type ValidationRules = {
  [key in keyof FormData]: (value: string) => string | undefined;
};

const useFormValidation = (
  initialData: FormData,
  validationRules: ValidationRules
) => {
  const [formData, setFormData] = useState<FormData>(initialData);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const validateField = (fieldName: keyof FormData, value: string) => {
    const validationRule = validationRules[fieldName];
    if (validationRule) {
      const errorMessage = validationRule(value);
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: errorMessage || "",
      }));
    }
  };

  const handleChange = (fieldName: keyof FormData, value: string) => {
    setFormData((prevData) => ({ ...prevData, [fieldName]: value }));
    validateField(fieldName, value);
  };

  const handleSubmit = () => {
    let errors: FormErrors = {};

    for (const fieldName in validationRules) {
      if (validationRules.hasOwnProperty(fieldName)) {
        const value = formData[fieldName];
        const validationRule = validationRules[fieldName];
        const errorMessage = validationRule(value);
        errors = { ...errors, [fieldName]: errorMessage || "" };
      }
    }

    setFormErrors(errors);

    return Object.values(errors).every((error) => !error);
  };

  const isFormValid = () => {
    const isValid = handleSubmit();

    return isValid;
  };

  return { formData, formErrors, handleChange, handleSubmit, isFormValid };
};

export default useFormValidation;
