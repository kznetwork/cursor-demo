// RFC 5322 이메일 패턴 (emailregex.com, IP 옥텟 버그 수정)
// https://stackoverflow.com/questions/201323/what-is-the-best-regular-expression-for-validating-email-addresses
const RFC5322_EMAIL_REGEX = new RegExp(
  '^(?:' +
    "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*" +
    '|"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*"' +
    ')@' +
    '(?:' +
    '(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?' +
    '|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])' +
    '|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\]' +
    ')$',
  'i',
);

const MAX_EMAIL_LENGTH = 254;
const MAX_LOCAL_PART_LENGTH = 64;

/**
 * 사용자 배열에서 이메일 필드만 추출한다.
 * @param {Array<{ email?: string }>} users - 사용자 객체 배열
 * @returns {string[]} 추출된 이메일 배열. 입력이 배열이 아니면 빈 배열
 */
export function extractEmails(users) {
  if (!Array.isArray(users)) {
    return [];
  }
  return users.map((user) => user.email);
}

/**
 * 이메일 문자열이 RFC 5322 형식과 길이 제한을 만족하는지 검증한다.
 * @param {string} email - 검증할 이메일
 * @returns {boolean} 유효하면 true
 */
export function isValidEmail(email) {
  if (typeof email !== 'string') return false;

  const atIndex = email.lastIndexOf('@');
  if (atIndex <= 0 || atIndex > MAX_LOCAL_PART_LENGTH) return false;
  if (email.length > MAX_EMAIL_LENGTH) return false;

  return RFC5322_EMAIL_REGEX.test(email);
}

/**
 * 사용자 배열에서 유효한 이메일만 필터링한다.
 * @param {Array<{ email?: string }>} users - 사용자 객체 배열
 * @returns {string[]} 유효한 이메일 배열
 */
export function getValidEmails(users) {
  return extractEmails(users).filter(isValidEmail);
}

/**
 * 사용자 배열에서 유효한 이메일을 추출하고 중복을 제거한다.
 * @param {Array<{ email?: string }>} users - 사용자 객체 배열
 * @returns {string[]} 중복이 제거된 유효 이메일 배열
 */
export function uniqueValidEmails(users) {
  return [...new Set(getValidEmails(users))];
}
