/* ========================================
   📊 GA 관리자 리뷰어 목록 목업 데이터
   ======================================== */

/**
 * GA 관리자 리뷰어 목록 목업 데이터
 *
 * 목적: GA 관리자 리뷰어 목록 페이지에서 사용하는 임시 목업 데이터입니다.
 *
 * 사용 페이지:
 * - /manager_ga/member/reviewers (리뷰어 목록 페이지)
 *
 * 주요 기능:
 * - 리뷰어 통계 데이터
 * - 리뷰어 목록 데이터
 *
 * 학습 포인트:
 * - TypeScript 인터페이스: 데이터 구조를 타입으로 정의합니다
 * - 배열 타입: 여러 개의 데이터를 배열로 관리합니다
 * - export: 다른 파일에서 이 데이터를 import하여 사용할 수 있습니다
 */

// 채널 타입 정의
export type Channel = 'Blog' | 'Clip' | 'Instagram' | 'Youtube' | 'Store';

// 리뷰어 유형 타입 정의
export type ReviewerType = '서포터즈' | '일반' | '인플루언서';

// 리뷰어 상태 타입 정의
export type ReviewerStatus = '정상' | '일시 정지' | '영구 정지';

// 리뷰어 상태 유형 타입 정의
export type ReviewerStatusType =
  | '모범 회원'
  | '주의 회원'
  | '경고 회원'
  | '이용 제한 회원';

// 리뷰어 통계 타입 정의
export interface ReviewerStats {
  total_members: number; // 전체 가입자 수
  monthly_active: number; // 월간 활동 회원
  monthly_new: number; // 월간 신규 가입자 수
  dormant: number; // 휴면 회원
}

// 리뷰어 목록 아이템 타입 정의
export interface ReviewerItem {
  id: string; // 리뷰어 ID
  number: string; // 번호
  name: string; // 이름
  channels: Channel[]; // 보유 채널 목록
  type: ReviewerType; // 유형
  campaign_participated: number; // 캠페인 참여 횟수
  campaign_completed: number; // 캠페인 완료 횟수
  current_points: number; // 보유 포인트
  withdrawn_points: number; // 출금 포인트
  status_type: ReviewerStatusType; // 상태 유형 (모범 회원, 주의 회원, 경고 회원, 이용 제한 회원)
  status: ReviewerStatus; // 상태
  last_access_date: string; // 접속일 (예: 2025-08-01 18:56)
  join_date: string; // 가입일 (예: 2025-08-01 18:56)
}

// 채널 상세 정보 타입 정의
export interface ChannelDetail {
  channel: Channel; // 채널 타입
  daily_visits?: number; // 일방문 (네이버 블로그)
  total_visits?: number; // 총방문 (네이버 블로그)
  neighbors?: number; // 이웃수 (네이버 블로그)
  followers?: number; // 팔로워 (네이버 클립, 인스타그램)
  subscribers?: number; // 구독자 (유튜브)
  is_connected: boolean; // 연결 여부
}

// 계좌 정보 타입 정의
export interface AccountInfo {
  account_holder: string; // 예금주
  bank: string; // 은행
  account_number: string; // 계좌번호
  resident_number: string; // 주민등록번호 (마스킹된 형태)
}

// 최근 캠페인 정보 타입 정의
export interface RecentCampaign {
  campaign_number: string; // 캠페인 번호
  partner_name: string; // 파트너명
  campaign_name: string; // 캠페인명
  status: '진행' | '종료'; // 상태
  type: '배송형' | '구매평'; // 유형
  channel: Channel; // 채널
  points: number; // 지급 포인트
}

// 패널티 유형 타입 정의
export type PenaltyType = '지각 제출' | '선정 후 취소' | '기타';

// 패널티 상태 타입 정의
export type PenaltyStatus = '경고' | '정상' | '일시정지';

// 패널티 내역 아이템 타입 정의
export interface PenaltyHistoryItem {
  type: PenaltyType; // 유형
  reason: string; // 사유
  processed_date: string; // 처리일 (예: 2025-08-01 18:56)
  status: PenaltyStatus; // 상태
}

// 리뷰어 디테일 정보 타입 정의
export interface ReviewerDetail extends ReviewerItem {
  nickname: string; // 닉네임
  gender: '남성' | '여성'; // 성별
  age: number; // 나이
  email: string; // 이메일
  phone: string; // 전화번호
  address: string; // 주소
  penalty_count: number; // 패널티 횟수
  channel_details: ChannelDetail[]; // 채널 상세 정보
  account_info: AccountInfo; // 계좌 정보
  recent_campaigns: RecentCampaign[]; // 최근 진행 캠페인 목록
  penalty_history: PenaltyHistoryItem[]; // 패널티 내역 목록
}

// 리뷰어 통계 데이터
export const reviewer_stats: ReviewerStats = {
  total_members: 5120,
  monthly_active: 1523,
  monthly_new: 120,
  dormant: 125,
};

// 리뷰어 목록 데이터
export const reviewer_list: ReviewerItem[] = [
  {
    id: '1',
    number: '000001',
    name: '오은영',
    channels: ['Blog', 'Clip', 'Instagram', 'Youtube'],
    type: '일반',
    campaign_participated: 85,
    campaign_completed: 80,
    current_points: 1500000,
    withdrawn_points: 11500000,
    status_type: '이용 제한 회원',
    status: '일시 정지',
    last_access_date: '2025-08-01 18:56',
    join_date: '2025-08-01 18:56',
  },
  {
    id: '2',
    number: '000001',
    name: '김은지',
    channels: ['Blog', 'Clip'],
    type: '일반',
    campaign_participated: 1,
    campaign_completed: 1,
    current_points: 1500000,
    withdrawn_points: 132500000,
    status_type: '이용 제한 회원',
    status: '일시 정지',
    last_access_date: '2025-08-01 18:56',
    join_date: '2025-08-01 18:56',
  },
  {
    id: '3',
    number: '000001',
    name: '홍길동',
    channels: ['Blog', 'Instagram'],
    type: '서포터즈',
    campaign_participated: 569,
    campaign_completed: 560,
    current_points: 999999999,
    withdrawn_points: 999999999,
    status_type: '이용 제한 회원',
    status: '일시 정지',
    last_access_date: '2025-08-01 18:56',
    join_date: '2025-08-01 18:56',
  },
  {
    id: '4',
    number: '000001',
    name: '유연희',
    channels: ['Blog'],
    type: '인플루언서',
    campaign_participated: 1,
    campaign_completed: 1,
    current_points: 1500000,
    withdrawn_points: 900000000,
    status_type: '이용 제한 회원',
    status: '영구 정지',
    last_access_date: '2025-08-01 18:56',
    join_date: '2025-08-01 18:56',
  },
  {
    id: '5',
    number: '000001',
    name: '김히어라',
    channels: ['Blog', 'Instagram'],
    type: '일반',
    campaign_participated: 5,
    campaign_completed: 5,
    current_points: 1500000,
    withdrawn_points: 500000,
    status_type: '주의 회원',
    status: '정상',
    last_access_date: '2025-08-01 18:56',
    join_date: '2025-08-01 18:56',
  },
  {
    id: '6',
    number: '000001',
    name: '일이삼사오육칠팔구십',
    channels: ['Blog'],
    type: '일반',
    campaign_participated: 1,
    campaign_completed: 1,
    current_points: 1500000,
    withdrawn_points: 1500000,
    status_type: '모범 회원',
    status: '정상',
    last_access_date: '2025-08-01 18:56',
    join_date: '2025-08-01 18:56',
  },
  {
    id: '7',
    number: '000001',
    name: '이은',
    channels: ['Blog'],
    type: '일반',
    campaign_participated: 1,
    campaign_completed: 1,
    current_points: 1500000,
    withdrawn_points: 1500000,
    status_type: '모범 회원',
    status: '정상',
    last_access_date: '2025-08-01 18:56',
    join_date: '2025-08-01 18:56',
  },
  {
    id: '8',
    number: '000001',
    name: '김휘수',
    channels: ['Blog'],
    type: '일반',
    campaign_participated: 1,
    campaign_completed: 1,
    current_points: 1500000,
    withdrawn_points: 1500000,
    status_type: '모범 회원',
    status: '정상',
    last_access_date: '2025-08-01 18:56',
    join_date: '2025-08-01 18:56',
  },
  {
    id: '9',
    number: '000001',
    name: '황보선혜',
    channels: ['Blog'],
    type: '일반',
    campaign_participated: 1,
    campaign_completed: 1,
    current_points: 1500000,
    withdrawn_points: 1500000,
    status_type: '모범 회원',
    status: '정상',
    last_access_date: '2025-08-01 18:56',
    join_date: '2025-08-01 18:56',
  },
  {
    id: '10',
    number: '000001',
    name: '장세희',
    channels: ['Blog', 'Instagram'],
    type: '일반',
    campaign_participated: 1,
    campaign_completed: 1,
    current_points: 1500000,
    withdrawn_points: 1500000,
    status_type: '모범 회원',
    status: '정상',
    last_access_date: '2025-08-01 18:56',
    join_date: '2025-08-01 18:56',
  },
  {
    id: '11',
    number: '000001',
    name: '김은빛',
    channels: ['Blog', 'Instagram'],
    type: '일반',
    campaign_participated: 1,
    campaign_completed: 1,
    current_points: 1500000,
    withdrawn_points: 1500000,
    status_type: '모범 회원',
    status: '정상',
    last_access_date: '2025-08-01 18:56',
    join_date: '2025-08-01 18:56',
  },
  {
    id: '12',
    number: '000001',
    name: '김도토리',
    channels: ['Blog', 'Instagram'],
    type: '일반',
    campaign_participated: 1,
    campaign_completed: 1,
    current_points: 1500000,
    withdrawn_points: 1500000,
    status_type: '모범 회원',
    status: '정상',
    last_access_date: '2025-08-01 18:56',
    join_date: '2025-08-01 18:56',
  },
  {
    id: '13',
    number: '000001',
    name: '박요셉',
    channels: ['Blog', 'Instagram'],
    type: '일반',
    campaign_participated: 1,
    campaign_completed: 1,
    current_points: 1500000,
    withdrawn_points: 1500000,
    status_type: '모범 회원',
    status: '정상',
    last_access_date: '2025-08-01 18:56',
    join_date: '2025-08-01 18:56',
  },
  {
    id: '14',
    number: '000001',
    name: '황에스더',
    channels: ['Blog', 'Instagram'],
    type: '일반',
    campaign_participated: 1,
    campaign_completed: 1,
    current_points: 1500000,
    withdrawn_points: 1500000,
    status_type: '모범 회원',
    status: '정상',
    last_access_date: '2025-08-01 18:56',
    join_date: '2025-08-01 18:56',
  },
  {
    id: '15',
    number: '000001',
    name: '조로이스',
    channels: ['Blog', 'Instagram'],
    type: '일반',
    campaign_participated: 1,
    campaign_completed: 1,
    current_points: 1500000,
    withdrawn_points: 1500000,
    status_type: '모범 회원',
    status: '정상',
    last_access_date: '2025-08-01 18:56',
    join_date: '2025-08-01 18:56',
  },
  {
    id: '16',
    number: '000016',
    name: '데이터없음테스트',
    channels: ['Blog'],
    type: '일반',
    campaign_participated: 0,
    campaign_completed: 0,
    current_points: 0,
    withdrawn_points: 0,
    status_type: '모범 회원',
    status: '정상',
    last_access_date: '2025-08-01 18:56',
    join_date: '2025-08-01 18:56',
  },
];

// 리뷰어 ID로 디테일 정보를 가져오는 함수
// 실제 프로젝트에서는 API 호출로 대체됩니다
export function get_reviewer_detail_by_id(
  reviewer_id: string,
): ReviewerDetail | null {
  // 목록에서 해당 리뷰어 찾기
  const reviewer = reviewer_list.find((r) => r.id === reviewer_id);
  if (!reviewer) {
    return null;
  }

  // 패널티 횟수 계산: ID에 따라 다르게 설정
  // 실제 프로젝트에서는 API에서 받아온 데이터를 사용합니다
  const penalty_count_map: Record<string, number> = {
    '1': 5,
    '2': 0,
    '3': 0,
    '4': 1,
    '5': 2,
    '6': 0,
    '7': 0,
    '8': 0,
    '9': 0,
    '10': 0,
    '11': 0,
    '12': 0,
    '13': 0,
    '14': 0,
    '15': 0,
    '16': 0, // 데이터 없음 테스트용
  };
  const penalty_count = penalty_count_map[reviewer.id] || 0;

  // 패널티 내역 생성: penalty_count에 맞춰서 생성
  // 패널티 내역 생성: penalty_count에 맞춰서 생성
  // 유형은 항상 "경고"로 표시되므로, 상태 값은 실제 상태(일시정지 또는 정상)만 저장합니다
  const penalty_history: PenaltyHistoryItem[] = [];
  if (penalty_count > 0) {
    for (let i = 0; i < penalty_count; i++) {
      // 첫 번째 항목이고 패널티가 5개 이상이면 일시정지, 그 외는 정상
      const actualStatus = i === 0 && penalty_count >= 5 ? '일시정지' : '정상';

      penalty_history.push({
        type:
          i === penalty_count - 1 && penalty_count > 1
            ? '선정 후 취소'
            : '지각 제출',
        reason:
          i === penalty_count - 1 && penalty_count > 1
            ? '선정 후 취소'
            : '지각 제출',
        processed_date: `2025-08-${String(i + 1).padStart(2, '0')} 18:56`,
        status: actualStatus,
      });
    }
  }

  // 캠페인 진행 내역 생성: campaign_participated에 맞춰서 생성
  // 각 리뷰어마다 다른 캠페인 데이터를 가지도록 다양하게 설정
  const recent_campaigns: RecentCampaign[] = [];

  // 데이터 없음 테스트용: ID가 '16'인 경우 빈 배열로 유지
  if (reviewer.id !== '16') {
    const campaign_count = reviewer.campaign_participated;

    // 캠페인 데이터 템플릿 (리뷰어마다 다른 데이터를 생성하기 위한 배열)
    const campaign_templates: Omit<RecentCampaign, 'campaign_number'>[] = [
      {
        partner_name: '주식회사 재밌는걸참좋아하고하고싶은거하는노신사',
        campaign_name: '푸러블 고농축 캡슐세제 플라워향, 1개, 110개입',
        status: '진행',
        type: '배송형',
        channel: 'Blog',
        points: 115000,
      },
      {
        partner_name: '그리디센트',
        campaign_name: '나만의 향수만들기 체험 [그리디센트]',
        status: '진행',
        type: '구매평',
        channel: 'Store',
        points: 50000,
      },
      {
        partner_name: '스타벅스',
        campaign_name: '스타벅스 리저브 원두 체험',
        status: '종료',
        type: '배송형',
        channel: 'Blog',
        points: 80000,
      },
      {
        partner_name: '나이키',
        campaign_name: '나이키 에어맥스 운동화 리뷰',
        status: '종료',
        type: '구매평',
        channel: 'Instagram',
        points: 120000,
      },
      {
        partner_name: '삼성전자',
        campaign_name: '갤럭시 버즈 프로 체험',
        status: '종료',
        type: '배송형',
        channel: 'Youtube',
        points: 150000,
      },
      {
        partner_name: '아이폰',
        campaign_name: '아이폰 15 프로 맥스 리뷰',
        status: '진행',
        type: '구매평',
        channel: 'Blog',
        points: 200000,
      },
      {
        partner_name: '코카콜라',
        campaign_name: '코카콜라 제로 슈가 체험',
        status: '종료',
        type: '배송형',
        channel: 'Clip',
        points: 30000,
      },
    ];

    // campaign_participated 값에 맞춰서 캠페인 내역 생성
    // 최대 100개까지만 표시 (성능을 위해 제한)
    const max_campaigns_to_show = Math.min(campaign_count, 100);

    for (let i = 0; i < max_campaigns_to_show; i++) {
      // 템플릿을 순환하면서 사용 (i % campaign_templates.length로 인덱스 계산)
      const template_index = i % campaign_templates.length;
      const template = campaign_templates[template_index];

      recent_campaigns.push({
        campaign_number: String(i + 1).padStart(6, '0'),
        ...template,
        // 진행/종료 상태를 다양하게 설정
        status: i % 3 === 0 ? '진행' : '종료',
        // 포인트도 다양하게 설정
        points: template.points + (i % 5) * 10000,
      });
    }
  }

  // 각 리뷰어마다 다른 개인 정보 생성
  const personal_info_map: Record<
    string,
    {
      nickname: string;
      gender: '남성' | '여성';
      age: number;
      email: string;
      phone: string;
      address: string;
    }
  > = {
    '1': {
      nickname: '양치하는고양이',
      gender: '남성',
      age: 37,
      email: 'oheunyoung@naver.com',
      phone: '010-1111-1111',
      address: '서울시 강남구 테헤란로 123',
    },
    '2': {
      nickname: '은지블로그',
      gender: '여성',
      age: 28,
      email: 'kimeunji@gmail.com',
      phone: '010-2222-2222',
      address: '서울시 서초구 서초대로 456',
    },
    '3': {
      nickname: '홍길동의리뷰',
      gender: '남성',
      age: 45,
      email: 'honggildong@daum.net',
      phone: '010-3333-3333',
      address: '부산시 해운대구 해운대해변로 789',
    },
    '4': {
      nickname: '연희의일상',
      gender: '여성',
      age: 32,
      email: 'yuyeonhee@naver.com',
      phone: '010-4444-4444',
      address: '인천시 남동구 장자로 14',
    },
    '5': {
      nickname: '히어라리뷰',
      gender: '여성',
      age: 26,
      email: 'kimheera@naver.com',
      phone: '010-5555-5555',
      address: '대전시 유성구 대학로 321',
    },
    '6': {
      nickname: '일이삼사오',
      gender: '남성',
      age: 35,
      email: 'ilsamsa@naver.com',
      phone: '010-6666-6666',
      address: '광주시 북구 첨단과기로 654',
    },
    '7': {
      nickname: '이은의블로그',
      gender: '여성',
      age: 29,
      email: 'leeun@naver.com',
      phone: '010-7777-7777',
      address: '대구시 수성구 범어천로 987',
    },
    '8': {
      nickname: '휘수의리뷰',
      gender: '남성',
      age: 41,
      email: 'kimhwisu@naver.com',
      phone: '010-8888-8888',
      address: '울산시 남구 삼산로 147',
    },
    '9': {
      nickname: '황보선혜',
      gender: '여성',
      age: 33,
      email: 'hwangboseonhye@naver.com',
      phone: '010-9999-9999',
      address: '경기도 성남시 분당구 정자로 258',
    },
    '10': {
      nickname: '장세희블로그',
      gender: '여성',
      age: 27,
      email: 'jangsehee@naver.com',
      phone: '010-1010-1010',
      address: '경기도 수원시 영통구 광교로 369',
    },
    '11': {
      nickname: '은빛의일상',
      gender: '여성',
      age: 30,
      email: 'kimeunbit@naver.com',
      phone: '010-2020-2020',
      address: '경기도 고양시 일산동구 정발산로 741',
    },
    '12': {
      nickname: '도토리리뷰',
      gender: '남성',
      age: 38,
      email: 'kimdotori@naver.com',
      phone: '010-3030-3030',
      address: '경기도 부천시 원미구 상동로 852',
    },
    '13': {
      nickname: '요셉의블로그',
      gender: '남성',
      age: 36,
      email: 'parkyoseb@naver.com',
      phone: '010-4040-4040',
      address: '경기도 안양시 만안구 안양로 963',
    },
    '14': {
      nickname: '에스더리뷰',
      gender: '여성',
      age: 31,
      email: 'hwangesder@naver.com',
      phone: '010-5050-5050',
      address: '경기도 용인시 기흥구 신갈로 159',
    },
    '15': {
      nickname: '로이스의일상',
      gender: '여성',
      age: 34,
      email: 'jorois@naver.com',
      phone: '010-6060-6060',
      address: '경기도 화성시 동탄대로 357',
    },
    '16': {
      nickname: '데이터없음테스트',
      gender: '남성',
      age: 30,
      email: 'nodata@test.com',
      phone: '010-9999-9999',
      address: '서울시 강남구 테헤란로 999',
    },
  };

  const personal_info =
    personal_info_map[reviewer.id] || personal_info_map['1'];

  // 채널 정보 4개 칸은 무조건 모두 표시 (Blog, Clip, Instagram, Youtube)
  // 리뷰어가 보유한 채널인지 여부에 따라 연결 상태를 결정
  const all_channels: Channel[] = ['Blog', 'Clip', 'Instagram', 'Youtube'];
  const channel_details: ChannelDetail[] = [];

  // 각 채널마다 데이터 생성 (리뷰어 ID 기반으로 일관된 랜덤 값 생성)
  const seed = parseInt(reviewer.id);
  const channel_data_map: Record<Channel, Partial<ChannelDetail>> = {
    Blog: {
      daily_visits: ((seed * 123) % 1000) + 100,
      total_visits: ((seed * 456) % 1000000) + 10000,
      neighbors: ((seed * 789) % 2000) + 100,
      is_connected: reviewer.channels.includes('Blog'),
    },
    Clip: {
      followers: ((seed * 234) % 5000) + 500,
      is_connected: reviewer.channels.includes('Clip'),
    },
    Instagram: {
      followers: ((seed * 567) % 10000) + 1000,
      is_connected: reviewer.channels.includes('Instagram'),
    },
    Youtube: {
      subscribers: ((seed * 890) % 100000) + 5000,
      is_connected: reviewer.channels.includes('Youtube'),
    },
    Store: {
      is_connected: reviewer.channels.includes('Store'),
    },
  };

  // 4개 채널 모두 생성 (Blog, Clip, Instagram, Youtube)
  all_channels.forEach((channel) => {
    const base_data = channel_data_map[channel];
    channel_details.push({
      channel: channel,
      ...base_data,
      is_connected: base_data.is_connected ?? false,
    } as ChannelDetail);
  });

  // 각 리뷰어마다 다른 계좌 정보 생성
  const bank_list = [
    '우리은행',
    'KB국민은행',
    '신한은행',
    '하나은행',
    'NH농협은행',
    '카카오뱅크',
    '토스뱅크',
  ];
  const bank_index = parseInt(reviewer.id) % bank_list.length;
  const selected_bank = bank_list[bank_index];

  // 계좌번호 생성 (각 리뷰어마다 다르게)
  const account_number_base = String(parseInt(reviewer.id) * 1234567);
  const account_number = account_number_base.padStart(14, '0').slice(0, 14);

  // 주민등록번호 생성 (각 리뷰어마다 다르게)
  const birth_year = 1980 + (parseInt(reviewer.id) % 30);
  const birth_month = String((parseInt(reviewer.id) % 12) + 1).padStart(2, '0');
  const birth_day = String((parseInt(reviewer.id) % 28) + 1).padStart(2, '0');
  const gender_code = personal_info.gender === '남성' ? '1' : '2';
  const resident_number = `${birth_year
    .toString()
    .slice(2)}${birth_month}${birth_day}-${gender_code}******`;

  // 디테일 정보 생성 (목업 데이터)
  // 실제 프로젝트에서는 API에서 받아온 데이터를 사용합니다
  const detail: ReviewerDetail = {
    ...reviewer,
    nickname: personal_info.nickname,
    gender: personal_info.gender,
    age: personal_info.age,
    email: personal_info.email,
    phone: personal_info.phone,
    address: personal_info.address,
    penalty_count: penalty_count,
    penalty_history: penalty_history,
    channel_details: channel_details,
    account_info: {
      account_holder: reviewer.name,
      bank: selected_bank,
      account_number: account_number,
      resident_number: resident_number,
    },
    recent_campaigns: recent_campaigns,
  };

  return detail;
}
