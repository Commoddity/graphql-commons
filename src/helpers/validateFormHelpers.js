const validateFormHelpers = {
  id: () => {
    return '';
  },
  firstName: (value) => {
    const validNameRegex = RegExp(/^([a-zA-Z -]+)$/);
    return !validNameRegex.test(value)
      ? 'First name must only contain letters and spaces.'
      : '';
  },
  lastName: (value) => {
    const validNameRegex = RegExp(/^([a-zA-Z -]+)$/);
    return !validNameRegex.test(value)
      ? 'Last name must only contain letters and spaces.'
      : '';
  },
  username: (value) => {
    const validUsernameRegex = RegExp(/^([a-zA-Z0-9_-]+)$/);
    return value.length < 4 || !validUsernameRegex.test(value)
      ? 'Username must be 4 characters long and only contain alphanumeric characters and underscores.'
      : '';
  },
  email: (value) => {
    const validEmailRegex = RegExp(
      // eslint-disable-next-line
      /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    );
    return validEmailRegex.test(value) ? '' : 'Email is not valid.';
  },
  password: (value) => {
    return value.length < 5 ? 'Password must be 5 characters long!' : '';
  },
  passwordUpdate: (value) => {
    return value.length !== 0 && value.length < 5
      ? 'Password must be 5 characters long!'
      : '';
  },
  passwordConfirmation: (value, password) => {
    return value === password
      ? ''
      : 'Password and password confirmation must match!';
  },
  phoneNumber: (value) => {
    const parsedValue = value.replace(/\D+/g, '');
    return parsedValue.length === 0 || parsedValue.length === 10
      ? ''
      : 'Phone number must be exactly 10 digits long.';
  },
  postalCode: (value) => {
    const postalCodeRegex = /^(?!.*[DFIOQU])[A-VXY][0-9][A-Z] ?[0-9][A-Z][0-9]$/;
    return value.length === 0 || postalCodeRegex.test(value)
      ? ''
      : 'Postal code must look like: A1A1A1 or A1A 1A1.';
  },
  emailNotification: () => {
    return '';
  },
  smsNotification: () => {
    return '';
  },
  categories: () => {
    return '';
  }
};

export default validateFormHelpers;
