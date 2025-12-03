/* ========================================
   🧪 로그인 테스트 데이터
   ======================================== */

/**
 * 로그인 테스트용 임시 데이터
 *
 * ⚠️ 실제 API 연결 시 이 파일 전체를 삭제하세요
 *
 * 사용 방법:
 * - 각 테스트 케이스에 해당하는 이메일/비밀번호로 로그인 시도
 * - 각 케이스별로 다른 에러 메시지가 표시됩니다
 */

/**
 * 실제 테스트 계정 정보 목록 (파트너용 - 이메일 기반)
 */
export const TEST_ACCOUNTS = [
  {
    email: 'test@test.com',
    password: 'cjdaud1!',
  },
  {
    email: 'test@cmcm.co.kr',
    password: 'cjdaud1!',
  },
];

/**
 * 유저 테스트 계정 정보 목록 (아이디 기반)
 */
export const TEST_USER_ACCOUNTS = [
  {
    username: 'admin',
    password: 'cjdaud1!',
  },
  {
    username: 'user',
    password: 'cjdaud1!',
  },
];

/**
 * 정지/탈퇴된 계정 이메일 목록 (파트너용)
 */
export const BANNED_ACCOUNTS = [
  'banned@test.com',
  'deleted@test.com',
  'fail@test.com',
];

/**
 * 정지/탈퇴된 계정 아이디 목록 (유저용)
 */
export const BANNED_USER_ACCOUNTS = [
  'banned_user',
  'deleted_user',
  'suspended_user',
];

/**
 * 테스트 로그인 데이터 확인 함수 (파트너용 - 이메일 기반)
 *
 * @param email - 입력된 이메일
 * @param password - 입력된 비밀번호
 * @returns 에러 메시지 (성공이면 null)
 */
export function checkTestLogin(email: string, password: string): string | null {
  // 1. 실제 계정으로 로그인 성공
  const matchedAccount = TEST_ACCOUNTS.find(
    (account) => account.email === email && account.password === password,
  );

  if (matchedAccount) {
    return null; // 성공 (에러 없음)
  }

  // 2. 아이디는 맞지만 비밀번호가 틀린 경우
  const accountExists = TEST_ACCOUNTS.some(
    (account) => account.email === email,
  );

  if (accountExists) {
    return '아이디 또는 비밀번호가 일치하지 않습니다.';
  }

  // 3. 정지/탈퇴된 계정인 경우
  if (BANNED_ACCOUNTS.includes(email)) {
    return '정지/탈퇴된 계정입니다.';
  }

  // 4. 존재하지 않는 계정인 경우 (위 케이스에 해당하지 않는 모든 경우)
  return '존재하지 않는 계정입니다.';
}

/**
 * 유저 테스트 로그인 데이터 확인 함수 (유저용 - 아이디 기반)
 *
 * @param username - 입력된 아이디
 * @param password - 입력된 비밀번호
 * @returns 에러 메시지 (성공이면 null)
 *
 * - 함수 오버로딩: 같은 이름의 함수를 다른 매개변수로 여러 개 정의
 * - 여기서는 별도 함수로 분리하여 유저와 파트너 로그인을 구분
 */
export function checkUserTestLogin(
  username: string,
  password: string,
): string | null {
  // 1. 실제 계정으로 로그인 성공
  const matchedAccount = TEST_USER_ACCOUNTS.find(
    (account) => account.username === username && account.password === password,
  );

  if (matchedAccount) {
    return null; // 성공 (에러 없음)
  }

  // 2. 아이디는 맞지만 비밀번호가 틀린 경우
  const accountExists = TEST_USER_ACCOUNTS.some(
    (account) => account.username === username,
  );

  if (accountExists) {
    return '아이디 또는 비밀번호가 일치하지 않습니다.';
  }

  // 3. 정지/탈퇴된 계정인 경우
  if (BANNED_USER_ACCOUNTS.includes(username)) {
    return '정지/탈퇴된 계정입니다.';
  }

  // 4. 존재하지 않는 계정인 경우 (위 케이스에 해당하지 않는 모든 경우)
  return '존재하지 않는 계정입니다.';
}
