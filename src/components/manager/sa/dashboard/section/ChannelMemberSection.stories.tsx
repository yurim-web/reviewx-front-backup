/**
 * ChannelMemberSection 컴포넌트 스토리북
 */

import type { Meta, StoryObj } from "@storybook/react";
import ChannelMemberSection from "./ChannelMemberSection";

const meta: Meta<typeof ChannelMemberSection> = {
  title: "Manager/SA/Dashboard/Section/ChannelMemberSection",
  component: ChannelMemberSection,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj<typeof ChannelMemberSection>;

export const Default: Story = {};
