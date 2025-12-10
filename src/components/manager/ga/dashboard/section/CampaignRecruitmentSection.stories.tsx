/**
 * CampaignRecruitmentSection 컴포넌트 스토리북
 */

import type { Meta, StoryObj } from "@storybook/react";
import CampaignRecruitmentSection from "./CampaignRecruitmentSection";

const meta: Meta<typeof CampaignRecruitmentSection> = {
  title: "Manager/GA/Dashboard/Section/CampaignRecruitmentSection",
  component: CampaignRecruitmentSection,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj<typeof CampaignRecruitmentSection>;

export const Default: Story = {};
