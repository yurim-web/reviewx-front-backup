import fs from 'fs';
import path from 'path';

const base = 'C:/develop/reviewx-web';

const files = [
  // components/manager/ga
  'src/components/manager/ga/campaign/rejected/section/CampaignRejectedFilterSection.tsx',
  'src/components/manager/ga/campaign/rejected/section/RejectCodeInfoSection.tsx',
  'src/components/manager/ga/campaign/rejected/section/RejectStatsSection.tsx',
  'src/components/manager/ga/campaign/reported/section/CampaignReportedFilterSection.tsx',
  'src/components/manager/ga/campaign/reported/section/ReportCodeInfoSection.tsx',
  'src/components/manager/ga/campaign/reported/section/ReportStatsSection.tsx',
  'src/components/manager/ga/common/ManagerGAHeader.tsx',
  'src/components/manager/ga/common/SidebarMenu.tsx',
  'src/components/manager/ga/common/filter/BaseFilterDropdown.tsx',
  'src/components/manager/ga/common/filter/BaseFilterModal.tsx',
  'src/components/manager/ga/common/filter/BaseFilterSection.tsx',
  'src/components/manager/ga/common/filter/DateFilterButton.tsx',
  'src/components/manager/ga/common/filter/FilterButton.tsx',
  'src/components/manager/ga/common/filter/SortDropdown.tsx',
  'src/components/manager/ga/dashboard/ChartsSection.tsx',
  'src/components/manager/ga/dashboard/MemberStatsSection.tsx',
  'src/components/manager/ga/dashboard/StatCard.tsx',
  'src/components/manager/ga/dashboard/chart/CampaignRecruitmentChart.tsx',
  'src/components/manager/ga/dashboard/chart/ChannelMemberPieChart.tsx',
  'src/components/manager/ga/dashboard/chart/DeviceStatsChart.tsx',
  'src/components/manager/ga/dashboard/chart/MemberActivationDonutChart.tsx',
  'src/components/manager/ga/dashboard/chart/MemberTypeBarChart.tsx',
  'src/components/manager/ga/dashboard/chart/RejectionReportChart.tsx',
  'src/components/manager/ga/dashboard/section/AccessStatsSection.tsx',
  'src/components/manager/ga/dashboard/section/CampaignRecruitmentSection.tsx',
  'src/components/manager/ga/dashboard/section/CampaignSummarySection.tsx',
  'src/components/manager/ga/dashboard/section/ChannelMemberSection.tsx',
  'src/components/manager/ga/dashboard/section/DateFilterSection.tsx',
  'src/components/manager/ga/dashboard/section/DateRangePickerModal.tsx',
  'src/components/manager/ga/dashboard/section/MemberActivationSection.tsx',
  'src/components/manager/ga/dashboard/section/MemberTypeSection.tsx',
  'src/components/manager/ga/dashboard/section/RejectionReportSection.tsx',
  // data/manager_ga
  'src/data/manager_ga/common/filterOptions.ts',
  'src/data/manager_ga/community/categoriesData.ts',
  'src/data/manager_ga/community/postsData.ts',
  'src/data/manager_ga/member/blacklist.ts',
  'src/data/manager_ga/member/partners.ts',
  'src/data/manager_ga/member/reviewers.ts',
  'src/data/manager_ga/progress.ts',
  'src/data/manager_ga/rejected.ts',
  'src/data/manager_ga/reported.ts',
];

// 이모지 유니코드 범위 제거
function removeEmoji(str) {
  return str.replace(
    /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2702}-\u{27B0}\u{24C2}-\u{1F251}]+/gu,
    ''
  ).trim();
}

function fixHeader(content) {
  // 1. "주요 기능:" 섹션 제거 (섹션 + 항목들 + 후행 빈줄)
  //    패턴: " * 주요 기능:\n" 이후 " * - ..." 라인들 + " *\n" 빈줄
  content = content.replace(/ \* 주요 기능:\n( \* - [^\n]*\n)+ \*\n/g, '');
  content = content.replace(/ \* 주요 기능:\n( \* - [^\n]*\n)+/g, '');

  // 2. "사용 위치:" → "사용 페이지:" 통일
  content = content.replace(/ \* 사용 위치:\n/g, ' * 사용 페이지:\n');

  // 3. 헤더 구분선 제목의 이모지 제거
  //    패턴: /* ====\n   이모지 제목\n   ==== */
  content = content.replace(
    /(\/\* ={38,}\n\s+)([^\n]+)/g,
    (_, prefix, title) => prefix + removeEmoji(title)
  );

  // 4. JSDoc 내 연속 빈 줄 3개 이상 → 1개로
  content = content.replace(/( \*\n){3,}/g, ' *\n');

  return content;
}

let modified = 0;
const errors = [];

for (const rel of files) {
  const full = path.join(base, rel);
  try {
    const original = fs.readFileSync(full, 'utf-8');
    const fixed = fixHeader(original);
    if (fixed !== original) {
      fs.writeFileSync(full, fixed, 'utf-8');
      modified++;
      console.log(`✅ 수정: ${rel}`);
    } else {
      console.log(`⏭  변경 없음: ${rel}`);
    }
  } catch (e) {
    if (e.code === 'ENOENT') {
      errors.push(`❌ 파일 없음: ${rel}`);
    } else {
      errors.push(`❌ 오류 (${rel}): ${e.message}`);
    }
  }
}

console.log(`\n총 ${modified}개 파일 수정 완료`);
if (errors.length) {
  console.log('\n오류:');
  errors.forEach(e => console.log(e));
}
