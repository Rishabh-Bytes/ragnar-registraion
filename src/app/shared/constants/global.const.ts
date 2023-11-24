export const PATTERNS = {
  EMAIL: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
  // /^\w+([\.\+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ -- OLD
  //minimum 10 characters with one Uppercase, one digit and one special character.
  PASSWORD:
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[*@!#%&()^~{}_,<.>?'";:$+=-]).{10,}$/,
  ONLY_DIGITS: '[0-9].{9,11}',
  AGE: /^[0-9]*$/,
  ALPHA_NUMERIC: /^[a-zA-Z0-9]*$/,
  zipCode: /^([(]\d{3}[)] )(\d{3})([-]\d{4})$/,
};
