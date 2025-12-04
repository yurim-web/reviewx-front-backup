'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import PartnerTabNavigation from '@/components/partner/campaign_management/TabNavigation';
import SubTabNavigation from '@/components/common/mypage/SubTabNavigation';
import layoutStyles from '../../../styles/partner/layout.module.css';
import profileStyles from '../../../styles/user/mypage/profile.module.css';
import type { PartnerMainTab } from '@/types/partner/partner';

export default function PartnerMypagePage() {
  const router = useRouter();
  const [activeTopTab, setActiveTopTab] = useState<PartnerMainTab>('account');
  const [activeSubTab, setActiveSubTab] = useState<'profile'>('profile');

  return (
    <div className={layoutStyles.partner_dashboard_container}>
      <main className={layoutStyles.partner_main_content}>
        <PartnerTabNavigation
          activeTab={activeTopTab}
          setActiveTab={setActiveTopTab}
        />
        <SubTabNavigation
          activeSubTab={activeSubTab}
          setActiveSubTab={setActiveSubTab}
          basePath="/partner/mypage"
          availableTabs={['profile']}
        />
        <section className={layoutStyles.mypage_container}>
          {/* 프로필 섹션 */}
          <div className={profileStyles.profile_section}>
            <div className={profileStyles.profile_info}>
              <div className={profileStyles.profile_image} />
              <div className={profileStyles.profile_details}>
                <div className={profileStyles.profile_role}>광고주</div>
                <div className={profileStyles.profile_nickname_container}>
                  <div className={profileStyles.profile_nickname}>
                    주식회사 청명종합광고기획
                  </div>
                  <Image
                    className={profileStyles.edit_icon}
                    src="/images/icons/chevron_right.svg"
                    alt="프로필 편집 이동"
                    width={16}
                    height={16}
                    onClick={() => router.push('/partner/mypage/edit')}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 메뉴 리스트 */}
          <div className={profileStyles.menu_list}>
            <button
              className={profileStyles.menu_item}
              onClick={() =>
                window.open('https://markx.dev/guide_book', '_blank')
              }
            >
              <div className={profileStyles.menu_icon} />
              <div className={profileStyles.menu_text}>이용 가이드</div>
            </button>
            <button
              className={profileStyles.menu_item}
              onClick={() => router.push('/notice')}
            >
              <div className={profileStyles.menu_icon} />
              <div className={profileStyles.menu_text}>공지사항</div>
            </button>
            <button
              className={profileStyles.menu_item}
              onClick={() => router.push('/faq')}
            >
              <div className={profileStyles.menu_icon} />
              <div className={profileStyles.menu_text}>자주 묻는 질문</div>
            </button>
            <button
              className={profileStyles.menu_item}
              onClick={() =>
                window.open('https://pf.kakao.com/_xjxdxoxG/chat', '_blank')
              }
            >
              <div className={profileStyles.menu_icon} />
              <div className={profileStyles.menu_text}>카카오톡 상담</div>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
