"""
manager_ga 파일 헤더 정리 스크립트
- "주요 기능:" 섹션 제거
- "사용 위치:" → "사용 페이지:" 통일
- 헤더 이모지(📊📋📅 등) 제거
"""
import re
import os

files = [
    # components/manager/ga
    "src/components/manager/ga/campaign/rejected/section/CampaignRejectedFilterSection.tsx",
    "src/components/manager/ga/campaign/rejected/section/RejectCodeInfoSection.tsx",
    "src/components/manager/ga/campaign/rejected/section/RejectStatsSection.tsx",
    "src/components/manager/ga/campaign/reported/section/CampaignReportedFilterSection.tsx",
    "src/components/manager/ga/campaign/reported/section/ReportCodeInfoSection.tsx",
    "src/components/manager/ga/campaign/reported/section/ReportStatsSection.tsx",
    "src/components/manager/ga/common/ManagerGAHeader.tsx",
    "src/components/manager/ga/common/SidebarMenu.tsx",
    "src/components/manager/ga/common/filter/BaseFilterDropdown.tsx",
    "src/components/manager/ga/common/filter/BaseFilterModal.tsx",
    "src/components/manager/ga/common/filter/BaseFilterSection.tsx",
    "src/components/manager/ga/common/filter/DateFilterButton.tsx",
    "src/components/manager/ga/common/filter/FilterButton.tsx",
    "src/components/manager/ga/common/filter/SortDropdown.tsx",
    "src/components/manager/ga/dashboard/ChartsSection.tsx",
    "src/components/manager/ga/dashboard/MemberStatsSection.tsx",
    "src/components/manager/ga/dashboard/StatCard.tsx",
    "src/components/manager/ga/dashboard/chart/CampaignRecruitmentChart.tsx",
    "src/components/manager/ga/dashboard/chart/ChannelMemberPieChart.tsx",
    "src/components/manager/ga/dashboard/chart/DeviceStatsChart.tsx",
    "src/components/manager/ga/dashboard/chart/MemberActivationDonutChart.tsx",
    "src/components/manager/ga/dashboard/chart/MemberTypeBarChart.tsx",
    "src/components/manager/ga/dashboard/chart/RejectionReportChart.tsx",
    "src/components/manager/ga/dashboard/section/AccessStatsSection.tsx",
    "src/components/manager/ga/dashboard/section/CampaignRecruitmentSection.tsx",
    "src/components/manager/ga/dashboard/section/CampaignSummarySection.tsx",
    "src/components/manager/ga/dashboard/section/ChannelMemberSection.tsx",
    "src/components/manager/ga/dashboard/section/DateFilterSection.tsx",
    "src/components/manager/ga/dashboard/section/DateRangePickerModal.tsx",
    "src/components/manager/ga/dashboard/section/MemberActivationSection.tsx",
    "src/components/manager/ga/dashboard/section/MemberTypeSection.tsx",
    "src/components/manager/ga/dashboard/section/RejectionReportSection.tsx",
    # data/manager_ga
    "src/data/manager_ga/common/filterOptions.ts",
    "src/data/manager_ga/community/categoriesData.ts",
    "src/data/manager_ga/community/postsData.ts",
    "src/data/manager_ga/member/blacklist.ts",
    "src/data/manager_ga/member/partners.ts",
    "src/data/manager_ga/member/reviewers.ts",
    "src/data/manager_ga/progress.ts",
    "src/data/manager_ga/rejected.ts",
    "src/data/manager_ga/reported.ts",
]

# 이모지 제거 패턴 (헤더 구분선 내의 이모지)
EMOJI_PATTERN = re.compile(
    r'(\/\* ={38,}\n\s+)'  # /* ====... 시작
    r'([^\n]*)',            # 제목 라인
    re.MULTILINE
)

def remove_emoji(text):
    """유니코드 이모지 제거"""
    emoji_re = re.compile(
        "["
        "\U0001F300-\U0001F5FF"
        "\U0001F600-\U0001F64F"
        "\U0001F680-\U0001F6FF"
        "\U0001F700-\U0001F77F"
        "\U0001F780-\U0001F7FF"
        "\U0001F800-\U0001F8FF"
        "\U0001F900-\U0001F9FF"
        "\U0001FA00-\U0001FA6F"
        "\U0001FA70-\U0001FAFF"
        "\U00002702-\U000027B0"
        "\U000024C2-\U0001F251"
        "]+", flags=re.UNICODE
    )
    return emoji_re.sub('', text)

def fix_header(content):
    # 1. "주요 기능:" 섹션 제거
    # 패턴: " * 주요 기능:\n" 이후 " * - ..." 라인들과 빈 " *\n" 라인까지
    content = re.sub(
        r' \* 주요 기능:\n( \* - [^\n]*\n)* \*\n',
        '',
        content
    )
    # 주요 기능 섹션 뒤에 빈줄이 없는 경우도 처리
    content = re.sub(
        r' \* 주요 기능:\n( \* - [^\n]*\n)+',
        '',
        content
    )

    # 2. "사용 위치:" → "사용 페이지:" 통일
    content = content.replace(' * 사용 위치:\n', ' * 사용 페이지:\n')

    # 3. 헤더 구분선 내 이모지 제거 (/* === 제목 === */ 부분)
    def clean_header_line(m):
        prefix = m.group(1)
        title = m.group(2)
        clean_title = remove_emoji(title).strip()
        return prefix + clean_title

    content = EMOJI_PATTERN.sub(clean_header_line, content)

    # 4. 연속 빈 줄 정리 (/** 블록 내에서 3줄 이상 빈 줄 → 1줄)
    content = re.sub(r'( \*\n){3,}', ' *\n', content)

    return content

base = "C:/develop/reviewx-web"
modified = 0
errors = []

for rel_path in files:
    full_path = os.path.join(base, rel_path)
    try:
        with open(full_path, 'r', encoding='utf-8') as f:
            original = f.read()

        fixed = fix_header(original)

        if fixed != original:
            with open(full_path, 'w', encoding='utf-8', newline='\n') as f:
                f.write(fixed)
            modified += 1
            print(f"✅ 수정: {rel_path}")
        else:
            print(f"⏭️  변경 없음: {rel_path}")
    except FileNotFoundError:
        errors.append(f"❌ 파일 없음: {rel_path}")
    except Exception as e:
        errors.append(f"❌ 오류 ({rel_path}): {e}")

print(f"\n총 {modified}개 파일 수정 완료")
if errors:
    print("\n오류 목록:")
    for e in errors:
        print(e)
