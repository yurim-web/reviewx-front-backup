/**
 * MemberTypeBarChart 컴포넌트 스토리북
 */

import type { Meta, StoryObj } from "@storybook/react";
import MemberTypeBarChart from "./MemberTypeBarChart";

const meta: Meta<typeof MemberTypeBarChart> = {
  title: "Manager/SA/Dashboard/Chart/MemberTypeBarChart",
  component: MemberTypeBarChart,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;

type Story = StoryObj<typeof MemberTypeBarChart>;

export const Default: Story = {};
