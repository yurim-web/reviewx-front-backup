/**
 * MemberTypeSection 컴포넌트 스토리북
 */

import type { Meta, StoryObj } from "@storybook/react";
import MemberTypeSection from "./MemberTypeSection";

const meta: Meta<typeof MemberTypeSection> = {
  title: "Manager/GA/Dashboard/Section/MemberTypeSection",
  component: MemberTypeSection,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj<typeof MemberTypeSection>;

export const Default: Story = {};
