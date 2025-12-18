/**
 * RejectCodeFilterModal 컴포넌트 스토리북
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState, useCallback } from "react";
import RejectCodeFilterModal from "./RejectCodeFilterModal";
import type { RejectCode } from "@/data/manager_ga/rejected";

const meta: Meta<typeof RejectCodeFilterModal> = {
  title: "Manager/GA/Campaign/Rejected/Filter/RejectCodeFilterModal",
  component: RejectCodeFilterModal,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof RejectCodeFilterModal>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    const [selectedCodes, setSelectedCodes] = useState<RejectCode[]>([]);
    const handleClose = useCallback(() => setIsOpen(false), []);
    return (
      <RejectCodeFilterModal
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
