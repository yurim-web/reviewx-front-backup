/**
 * MemberActivationSection 컴포넌트 스토리북
 */

import type { Meta, StoryObj } from "@storybook/react";
import MemberActivationSection from "./MemberActivationSection";

const meta: Meta<typeof MemberActivationSection> = {
  title: "Manager/GA/Dashboard/Section/MemberActivationSection",
  component: MemberActivationSection,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;

type Story = StoryObj<typeof MemberActivationSection>;

export const Default: Story = {};
