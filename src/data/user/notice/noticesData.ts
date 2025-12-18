export interface NoticeDetail {
  id: number;

  title: string;

  date: string;

  category: string;

  content: string;
}

export const notices: NoticeDetail[] = [
  {
    id: 1,

    title: "리뷰X 서비스 리뉴얼 안내",

    date: "2025-09-12",

    category: "전체",

    content:
      "리뷰X 서비스가 새롭게 리뉴얼되었습니다.\n주요 기능과 UI가 개선되었으며, 자세한 내용은 추후 공지를 통해 안내드리겠습니다.",
  },

  {
    id: 2,

    title: "리뷰X 사용자 기능 추가 안내",

    date: "2025-09-12",

    category: "소식",

    content:
      "사용자 편의를 위한 새로운 기능이 추가되었습니다.\n마이페이지에서 채널 연결과 내 정보 수정 기능을 확인해 주세요.",
  },

  {
    id: 3,

    title:
      "판매하기 버튼, 월급 이외 수익 창출한 방법 제시! 박재범 대표 \"물건을 쇼핑하기만 하는 것이 아니라 판매를 통해 수익을 얻는 '놀이터'입니다\" 브릿지 총 60억 투자 비결은? 남들과 다른 차별성을 제시한다!",

    date: "2025-09-12",

    category: "중요",

    content:
      "판매하기 버튼과 관련된 주요 소식을 안내드립니다.\n해당 기능을 통해 다양한 수익 창출 사례가 이어지고 있습니다.",
  },

  {
    id: 4,

    title: "리뷰X 홍보 캐시 서비스 지급 정책 변경 안내문",

    date: "2025-09-12",

    category: "이벤트",

    content:
      "홍보 캐시 서비스 지급 정책이 변경되었습니다.\n상세 내용은 이벤트 페이지 및 공지사항을 통해 확인해 주세요.",
  },

  {
    id: 5,

    title: "리뷰X 보유 캐시 변동 안내문",

    date: "2025-09-12",

    category: "미션형",

    content:
      "보유 캐시 변동 정책에 대한 안내입니다.\n미션형 캠페인 참여 시 지급되는 캐시 정책이 일부 변경되었습니다.",
  },

  {
    id: 6,

    title: "리뷰X 알림톡 다중 발송 오류 사과문",

    date: "2025-09-12",

    category: "소식",

    content:
      "일부 사용자에게 알림톡이 중복 발송된 오류가 발생하였습니다.\n이용에 불편을 드린 점 진심으로 사과드리며, 재발 방지를 위해 시스템을 점검 중입니다.",
  },
];

export const get_notice_detail = (id: string): NoticeDetail | null => {
  const numericId = Number(id);

  if (Number.isNaN(numericId)) return null;

  return notices.find((notice) => notice.id === numericId) ?? null;
};

