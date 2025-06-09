import React from 'react';
import { Modal } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { LuCircleAlert } from 'react-icons/lu';
import { DangerButton, SecondaryButton } from './Button';

export const DeleteConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  loading = false,
  title = "Delete Item",
  message = "Are you sure you want to delete this item?"
}) => {
  return (
    <Modal
      open={open}
      closable={false}
      onOk={onConfirm}
      onCancel={onClose}
      footer={[
        <div className="flex justify-end gap-2 mb-1 pr-2\" key="footer">
          <DangerButton
            onClick={onConfirm}
            loading={loading}
          >
            Delete
          </DangerButton>
          <SecondaryButton onClick={onClose}>
            Cancel
          </SecondaryButton>
        </div>,
      ]}
    >
      <div className="flex items-start justify-between">
        <div className="inline-flex items-center justify-center mt-3">
          <span className="inline-block mr-2 text-red-600">
            <LuCircleAlert size="1.5rem" />
          </span>
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="text-gray-500 hover:text-black transition cursor-pointer"
        >
          <CloseOutlined style={{ fontSize: "12px" }} />
        </button>
      </div>
      <p className="px-6 pt-6 pb-2 text-[16px]">{message}</p>
    </Modal>
  );
};