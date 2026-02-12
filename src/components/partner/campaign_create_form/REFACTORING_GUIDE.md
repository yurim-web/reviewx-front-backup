# 캠페인 폼 리팩토링 가이드

## 📋 개요

5개의 캠페인 폼 컴포넌트에서 중복되는 코드를 공통 컴포넌트로 추출하여 재사용성을 높였습니다.

## 🎯 생성된 공통 컴포넌트

### 1. `ImageUploadSection.tsx`

- **목적**: 이미지 업로드 UI를 재사용
- **주요 기능**: 이미지 선택, 미리보기, 제거, 최대 7개 제한
- **사용 예시**:

```tsx
<ImageUploadSection
  uploadedImages={uploadedImages}
  imagePreviews={imagePreviews}
  onImageSelect={handleImageSelect}
  onImageRemove={handleImageRemove}
  isEditMode={isEditMode}
  isEditable={isEditableField("images")}
/>
```

### 2. `FormInputField.tsx`

- **목적**: 텍스트 입력 필드를 재사용
- **주요 기능**: 라벨, 필수 표시, 읽기 전용 모드
- **사용 예시**:

```tsx
<FormInputField
  label="캠페인 제목"
  required
  value={formData.title}
  onChange={(value) => updateFormData("title", value)}
  placeholder="제목을 입력하세요"
  readOnly={isEditMode && !isEditableField("title")}
/>
```

### 3. `PointsInputSection.tsx`

- **목적**: 포인트 입력 필드를 재사용
- **주요 기능**: 숫자 포맷팅, 포인트 충전 버튼
- **사용 예시**:

```tsx
<PointsInputSection
  label="추가 지급 포인트"
  value={formData.additionalPoints}
  displayValue={formatNumberWithComma(formData.additionalPoints)}
  onChange={(e) => handleNumericChangeWrapper("additionalPoints", e)}
  onKeyDown={(e) => handleNumericKeyDownWrapper("additionalPoints", e)}
  readOnly={isEditMode && !isEditableField("additionalPoints")}
/>
```

### 4. `RecruitmentFieldsSection.tsx`

- **목적**: 모집 관련 필드들을 한 번에 렌더링
- **주요 기능**: 모집 인원, 모집 기간, 선정 날짜, 등록 기간
- **사용 예시**:

```tsx
<RecruitmentFieldsSection
  recruitmentCount={formData.recruitmentCount}
  recruitmentPeriod={formData.recruitmentPeriod}
  announcementDate={formData.announcementDate}
  registrationPeriod={formData.registrationPeriod}
  onRecruitmentCountChange={(value) =>
    updateFormData("recruitmentCount", value)
  }
  onRecruitmentPeriodChange={(value) =>
    updateFormData("recruitmentPeriod", value)
  }
  onAnnouncementDateChange={(value) =>
    updateFormData("announcementDate", value)
  }
  onRegistrationPeriodChange={(value) =>
    updateFormData("registrationPeriod", value)
  }
  isEditMode={isEditMode}
  isEditableField={isEditableField}
/>
```

### 5. `SimpleGuideSection.tsx`

- **목적**: 간편 안내 옵션들을 재사용
- **주요 기능**: 글자 수, 이미지 장수, 동영상 개수/초수, 본문 링크/키워드 첨부
- **사용 예시**:

```tsx
<SimpleGuideSection
  checkboxStates={checkboxStates}
  formData={{
    minTextLength: formData.minTextLength,
    minImageCount: formData.minImageCount,
    videoCount: formData.videoCount,
    videoDuration: formData.videoDuration,
    requireLinkAttachment: formData.requireLinkAttachment,
    requireKeywordAttachment: formData.requireKeywordAttachment,
  }}
  onCheckboxChange={(field, checked) => updateCheckboxState(field, checked)}
  onNumericChange={handleNumericChangeWrapper}
  onNumericKeyDown={handleNumericKeyDownWrapper}
  formatNumberWithComma={formatNumberWithComma}
  onFieldClear={(field) => updateFormData(field as keyof CampaignFormData, "")}
  onAttachmentChange={(field, value) => updateFormData(field, value)}
  isEditMode={isEditMode}
  isEditableField={isEditableField}
/>
```

### 6. `ParticipationOptionsSection.tsx`

- **목적**: 참여/제출 옵션들을 재사용
- **주요 기능**: 만 19세 이상, 재참여 허용, 지각 제출 허용
- **사용 예시**:

```tsx
<ParticipationOptionsSection
  adultOnly={formData.adultOnly}
  allowReParticipation={formData.allowReParticipation}
  allowLateSubmission={formData.allowLateSubmission}
  onAdultOnlyChange={(value) => updateFormData("adultOnly", value)}
  onAllowReParticipationChange={(value) =>
    updateFormData("allowReParticipation", value)
  }
  onAllowLateSubmissionChange={(value) =>
    updateFormData("allowLateSubmission", value)
  }
  isEditMode={isEditMode}
  isEditableField={isEditableField}
  additionalOptions={[
    // 미션형의 경우 추가 옵션
    {
      id: "requireContentLink",
      label: "콘텐츠 링크 제출",
      checked: formData.requireContentLink,
      onChange: (value) => updateFormData("requireContentLink", value),
      field: "requireContentLink",
    },
  ]}
/>
```

### 7. `ThumbnailAndDetailImages.tsx` (신규)

- **목적**: 썸네일(1개)과 상세 이미지(최대 7개)를 분리하여 업로드
- **주요 기능**: 썸네일/상세 이미지 분리, 미리보기, 제거
- **사용 예시**:

```tsx
<ThumbnailAndDetailImages
  thumbnailImage={thumbnailImage}
  thumbnailPreview={thumbnailPreview}
  detailImages={detailImages}
  detailPreviews={detailPreviews}
  onThumbnailSelect={handleThumbnailSelect}
  onThumbnailRemove={handleThumbnailRemove}
  onDetailImagesSelect={handleDetailImagesSelect}
  onDetailImageRemove={handleDetailImageRemove}
  isEditMode={isEditMode}
  isEditable={isEditableField("images")}
/>
```

### 8. `PointsManagementSection.tsx` (신규)

- **목적**: 보유 포인트, 차감 포인트, 추가 지급 포인트를 한 번에 관리
- **주요 기능**: 포인트 표시, 차감 포인트 계산, 포인트 충전 버튼, 포인트 부족 경고
- **사용 예시**:

```tsx
<PointsManagementSection
  currentPoints={formData.currentPoints}
  additionalPoints={formData.additionalPoints}
  deductedPoints={deductedPoints} // 계산된 값
  onAdditionalPointsChange={(value) =>
    updateFormData("additionalPoints", value)
  }
  onChargeClick={handleChargeClick}
  isEditMode={isEditMode}
  isEditable={isEditableField("additionalPoints")}
  showInsufficientPointsWarning={showInsufficientPointsWarning}
/>
```

### 9. `ContactPhoneField.tsx` (신규)

- **목적**: 문의 담당자 휴대폰 번호 입력 필드
- **주요 기능**: 전화번호 자동 포맷팅 (010-1234-5678)
- **사용 예시**:

```tsx
<ContactPhoneField
  value={formData.contactPhone || ""}
  onChange={(value) => updateFormData("contactPhone", value)}
  isEditMode={isEditMode}
  isEditable={isEditableField("contactPhone")}
/>
```

### 10. `FairTradeAgreement.tsx` (신규)

- **목적**: 공정위 문구(경제적 이해관계) 동의 체크박스
- **주요 기능**: 필수 동의 체크박스
- **사용 예시**:

```tsx
<FairTradeAgreement
  agreed={formData.fairTradeAgreement || false}
  onChange={(agreed) => updateFormData("fairTradeAgreement", agreed)}
  isEditMode={isEditMode}
/>
```

### 11. `FloatingActionButtons.tsx` (신규)

- **목적**: 우측 하단 플로팅 버튼 (임시 저장/불러오기)
- **주요 기능**: 고정 위치 플로팅 버튼
- **참고**: 기획이 보여줄 예정이므로 현재는 기본 구조만 제공
- **사용 예시**:

```tsx
<FloatingActionButtons
  onSave={handleSave}
  onLoad={handleLoad}
  isSaveDisabled={isSubmitting}
  isLoadDisabled={isSubmitting}
/>
```

## 🔄 업데이트된 컴포넌트

### `SimpleGuideSection.tsx` (업데이트)

- **변경 사항**: 기본 미션 설정에서 설정된 항목(체크된 항목)만 노출
- **동작**: 체크박스가 체크된 항목만 화면에 표시됩니다.
- **이유**: Figma 디자인에 따라 설정된 항목만 보여주도록 변경

```tsx
<ParticipationOptionsSection
  adultOnly={formData.adultOnly}
  allowReParticipation={formData.allowReParticipation}
  allowLateSubmission={formData.allowLateSubmission}
  onAdultOnlyChange={(value) => updateFormData("adultOnly", value)}
  onAllowReParticipationChange={(value) =>
    updateFormData("allowReParticipation", value)
  }
  onAllowLateSubmissionChange={(value) =>
    updateFormData("allowLateSubmission", value)
  }
  isEditMode={isEditMode}
  isEditableField={isEditableField}
  additionalOptions={[
    // 미션형의 경우 추가 옵션
    {
      id: "requireContentLink",
      label: "콘텐츠 링크 제출",
      checked: formData.requireContentLink,
      onChange: (value) => updateFormData("requireContentLink", value),
      field: "requireContentLink",
    },
  ]}
/>
```

## 🛠️ 공통 유틸리티 함수

### `formUtils.ts`

- `formatNumberWithComma`: 숫자에 쉼표 추가
- `handleNumericInput`: 숫자만 입력 허용
- `handleNumericChange`: 숫자 입력 변경 처리 (쉼표 자동 추가)
- `validateImageFile`: 이미지 파일 검증

**사용 예시**:

```tsx
import {
  formatNumberWithComma,
  handleNumericInput,
  handleNumericChange,
  validateImageFile,
} from "./common/formUtils";

// 숫자 포맷팅
const displayValue = formatNumberWithComma(formData.additionalPoints);

// 숫자 입력 핸들러
const handleNumericChangeWrapper = (
  field: string,
  e: React.ChangeEvent<HTMLInputElement>
) => {
  handleNumericChange(e, (value) => {
    updateFormData(field as keyof CampaignFormData, value);
  });
};
```

## 📝 리팩토링 체크리스트

각 폼 컴포넌트를 리팩토링할 때 다음을 확인하세요:

### 1. 이미지 업로드 섹션

- [ ] `ImageUploadSection` 컴포넌트로 교체
- [ ] `validateImageFile` 유틸리티 함수 사용

### 2. 기본 입력 필드

- [ ] `FormInputField` 컴포넌트로 교체 (제목, 제공 내역, 홍보 링크 등)
- [ ] 드롭다운은 `CustomDropdown` 유지

### 3. 포인트 관련 필드

- [ ] `PointsInputSection` 컴포넌트로 교체
- [ ] `formatNumberWithComma` 사용

### 4. 모집 관련 필드

- [ ] `RecruitmentFieldsSection` 컴포넌트로 교체

### 5. 간편 안내 섹션

- [ ] `SimpleGuideSection` 컴포넌트로 교체
- [ ] 숫자 입력 핸들러 래퍼 함수 생성
- [ ] **주의**: 설정된 항목(체크된 항목)만 표시됨

### 6. 참여/제출 옵션

- [ ] `ParticipationOptionsSection` 컴포넌트로 교체
- [ ] 추가 옵션이 있으면 `additionalOptions` prop에 전달

### 7. 이미지 업로드 (업데이트)

- [ ] `ThumbnailAndDetailImages` 컴포넌트로 교체 (썸네일/상세 이미지 분리)
- [ ] 썸네일 1개, 상세 이미지 최대 7개로 분리

### 8. 포인트 관리

- [ ] `PointsManagementSection` 컴포넌트로 교체
- [ ] 차감 포인트 계산 로직 추가
- [ ] 포인트 부족 경고 메시지 표시

### 9. 문의 담당자 정보

- [ ] `ContactPhoneField` 컴포넌트로 교체
- [ ] 전화번호 자동 포맷팅 적용

### 10. 공정위 문구 동의

- [ ] `FairTradeAgreement` 컴포넌트 추가
- [ ] 등록 버튼 위에 배치

### 11. 플로팅 버튼

- [ ] `FloatingActionButtons` 컴포넌트 추가
- [ ] 우측 하단 고정 위치
- [ ] 임시 저장/불러오기 기능 구현 (기획 확인 후)

### 12. 유틸리티 함수

- [ ] 중복된 숫자 포맷팅 함수 제거
- [ ] `formUtils.ts`의 함수들 사용

## 🔍 각 폼별 특수 사항

### 배송형 (DeliveryCampaignForm)

- 플랫폼 선택 있음
- 홍보 링크 필드

### 방문형 (VisitCampaignForm)

- 플랫폼 선택 있음
- 지역 선택 필드
- 방문 주소, 주소 상세 안내 필드
- 방문 링크 필드

### 구매평 (ReviewCampaignForm)

- 플랫폼 선택 있음
- 구매 링크 필드 (홍보 링크 대신)
- 구매 지급 포인트 필드
- 구매 기간 필드

### 기자단 (ReporterCampaignForm)

- 플랫폼 선택 있음

### 미션형 (MissionCampaignForm)

- 플랫폼 선택 없음
- 콘텐츠 링크 제출 옵션
- 콘텐츠 이미지 제출 옵션

## 💡 리팩토링 팁

1. **점진적 리팩토링**: 한 번에 모든 것을 바꾸지 말고, 섹션별로 하나씩 교체하세요.

2. **테스트**: 각 섹션을 교체한 후 해당 기능이 정상 작동하는지 확인하세요.

3. **타입 안정성**: TypeScript 타입을 정확히 맞춰주세요.

4. **기존 동작 유지**: 리팩토링 후에도 기존과 동일하게 작동해야 합니다.

## 📊 예상 효과

- **코드 라인 수**: 약 40-50% 감소
- **유지보수성**: 공통 로직 변경 시 한 곳만 수정
- **일관성**: 모든 폼에서 동일한 UI/UX 제공
- **재사용성**: 새로운 캠페인 타입 추가 시 빠른 개발

## 🆕 Figma 디자인 반영 사항

다음 변경사항들이 Figma 디자인에 맞춰 반영되었습니다:

1. **썸네일/상세 이미지 분리**: 썸네일 1개, 상세 이미지 최대 7개로 분리
2. **포인트 관리 섹션**: 보유 포인트, 차감 포인트, 추가 지급 포인트 통합 관리
3. **문의 담당자 휴대폰 번호**: 필수 필드로 추가, 자동 포맷팅 적용
4. **공정위 문구 동의**: 등록 버튼 위에 필수 동의 체크박스 추가
5. **플로팅 버튼**: 우측 하단 임시 저장/불러오기 버튼 (기획 확인 후 구현)
6. **기본 미션 설정**: 설정된 항목(체크된 항목)만 노출되도록 변경
