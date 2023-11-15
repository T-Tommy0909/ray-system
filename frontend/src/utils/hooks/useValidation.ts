import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ValidationContext } from "contexts/ValidationContext";
import { generateUniqueId, isUniqueArray } from "utils/uniqueId";

export type ValidateRule<T> = (value: T) => boolean | string;

interface ReturnValue {
  isValid: boolean;
  errorMessage?: string;
  validate: () => void;
}

const VALID = false;

// Valid -> false
// Invalid -> エラーメッセージ
const checkRules = <T>(value: T, rules: ValidateRule<T>[]): false | string => {
  for (const rule of rules) {
    const res = rule(value);
    if (res !== true) {
      return res;
    }
  }
  return VALID;
};

export const useValidation = <T>(
  value: T,
  rules: ValidateRule<T>[]
): ReturnValue => {
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>();
  const uid = useRef<string>(generateUniqueId());
  const { register, unregister } = useContext(ValidationContext);

  const validate = useCallback(() => {
    const res = checkRules(value, rules);
    setIsValid(!res);
    setErrorMessage(res === VALID ? undefined : res);
    register(uid.current, !res);
  }, [register, rules, value]);

  useEffect(() => {
    const uidValue = uid.current;
    validate();
    return () => unregister(uidValue);
  }, [register, unregister, validate]);

  return { isValid, errorMessage, validate };
};

/**
 * Rules
 */
/* String */
export const stringNotEmpty: <T extends string>() => ValidateRule<T> =
  () => (val) =>
    !!val || "入力してください";
export const stringLengthMoreThan: <T extends string>(
  len: number
) => ValidateRule<T> = (len) => (val) =>
  val.length > len || `${len}文字より多く入力してください`;
export const stringLengthMoreThanEqual: <T extends string>(
  len: number
) => ValidateRule<T> = (len) => (val) =>
  val.length >= len || `${len}文字以上で入力してください`;
export const stringLengthLessThan: <T extends string>(
  len: number
) => ValidateRule<T> = (len) => (val) =>
  val.length < len || `${len}文字より少なく入力してください`;
export const stringLengthLessThanEqual: <T extends string>(
  len: number
) => ValidateRule<T> = (len) => (val) =>
  val.length <= len || `${len}文字以下で入力してください`;
export const stringRegexp: <T extends string>(
  regexp: RegExp
) => ValidateRule<T> = (regexp) => (val) =>
  regexp.test(val) || "入力形式が正しくありません";
export const stringEMailAddress: <T extends string>() => ValidateRule<T> = () =>
  stringRegexp(/^.+@.+\..+$/);

/* Array */
export const arrayNotEmpty: <T extends []>() => ValidateRule<T> = () => (val) =>
  val.length >= 1 || "入力してください";
export const arrayHasUniqueContents: <
  T extends unknown[]
>() => ValidateRule<T> = () => (val) =>
  isUniqueArray(val) || "値が被らないようにしてください";

/* Select */
export const optionSelected = (): ValidateRule<unknown> => (val) => {
  return !!val || "選択してください";
};

/* number */
export const integerOnly = (): ValidateRule<number> => (val) => {
  return Number.isInteger(val) || `整数値を入力してください`;
};

export const moreThanEqual =
  (threshold: number): ValidateRule<number> =>
  (val) => {
    return val >= threshold || `${threshold}以上の数値を入力してください`;
  };

/* Password */
export const password = (): ValidateRule<string> => (val) => {
  let correctCounter = 0;
  const uppercaseLetters = new RegExp(/[A-Z]/);
  const lowercaseLetters = new RegExp(/[a-z]/);
  const number = new RegExp(/[0-9]/);
  const special = new RegExp(
    /!|@|#|\$|%|\^|&|\*|\?|\.|\\|\[|\]|\(|\)|\{|\}|\+|-|~|"|'|\|/
  );

  if (uppercaseLetters.test(val)) correctCounter++;
  if (lowercaseLetters.test(val)) correctCounter++;
  if (number.test(val)) correctCounter++;
  if (special.test(val)) correctCounter++;

  return correctCounter >= 3 || "最低3つの条件を満たしてください";
};
