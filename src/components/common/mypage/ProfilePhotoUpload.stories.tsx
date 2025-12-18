/**
 * ProfilePhotoUpload 컴포넌트 스토리북
 *
 * 프로필 사진 업로드 컴포넌트의 다양한 사용 예시를 보여줍니다.
 */

import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import ProfilePhotoUpload from "./ProfilePhotoUpload";

const meta: Meta<typeof ProfilePhotoUpload> = {
  title: "Common/MyPage/ProfilePhotoUpload",
  component: ProfilePhotoUpload,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    profileImage: {
      description: "현재 프로필 이미지 URL (없으면 null)",
      control: "text",
    },
    onImageChange: {
      description: "프로필 이미지 변경 핸들러",
      action: "image changed",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ProfilePhotoUpload>;

// 프로필 이미지가 없는 경우
export const NoProfileImage: Story = {
  render: (args) => {
    const [profileImage, setProfileImage] = useState<string | null>(null);
    return React.createElement(ProfilePhotoUpload, {
      ...args,
      profileImage,
      onImageChange: (imageUrl: string | null) => {
        setProfileImage(imageUrl);
        args.onImageChange?.(imageUrl);
      },
    });
  },
  args: {
    profileImage: null,
    onImageChange: (imageUrl: string | null) => console.log("Profile image changed:", imageUrl),
  },
};

// 프로필 이미지가 있는 경우
export const WithProfileImage: Story = {
  render: (args) => {
    const [profileImage, setProfileImage] = useState<string | null>(
      "https://via.placeholder.com/150"
    );
    return React.createElement(ProfilePhotoUpload, {
      ...args,
      profileImage,
      onImageChange: (imageUrl: string | null) => {
        setProfileImage(imageUrl);
        args.onImageChange?.(imageUrl);
      },
    });
  },
  args: {
    profileImage: "https://via.placeholder.com/150",
    onImageChange: (imageUrl: string | null) => console.log("Profile image changed:", imageUrl),
  },
};

// 인터랙티브 예시 (이미지 업로드 및 삭제 시뮬레이션)
export const Interactive: Story = {
  render: (args) => {
    const [profileImage, setProfileImage] = useState<string | null>(
      args.profileImage || null
    );

    const handleImageChange = (imageUrl: string | null) => {
      setProfileImage(imageUrl);
      args.onImageChange?.(imageUrl);
      console.log("[Storybook] Profile image changed to:", imageUrl);
    };

    return React.createElement(ProfilePhotoUpload, {
      ...args,
      profileImage,
      onImageChange: handleImageChange,
    });
  },
  args: {
    profileImage: null,
    onImageChange: (imageUrl: string | null) => console.log("Profile image changed:", imageUrl),
  },
};

