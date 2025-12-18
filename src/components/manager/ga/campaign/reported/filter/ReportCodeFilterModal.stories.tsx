/**
 * ReportCodeFilterModal 컴포넌트 스토리북
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState, useCallback } from "react";
import ReportCodeFilterModal from "./ReportCodeFilterModal";
import type { ReportCode } from "@/data/manager_ga/reported";

const meta: Meta<typeof ReportCodeFilterModal> = {
  title: "Manager/GA/Campaign/Reported/Filter/ReportCodeFilterModal",
  component: ReportCodeFilterModal,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof ReportCodeFilterModal>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    const [selectedCodes, setSelectedCodes] = useState<ReportCode[]>([]);
    const handleClose = useCallback(() => setIsOpen(false), []);
    return (
      <ReportCodeFilterModal
        is_open={isOpen}
        on_close={handleClose}
        selected_codes={selectedCodes}
        on_apply={(codes) => {
          setSelectedCodes(codes);
        }}
      />
    );
  },
};
