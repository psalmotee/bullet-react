import React from 'react';
import { Drawer } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { SecondaryButton, SubmitButton } from './Button';

export const CustomDrawer = ({
  open,
  onClose,
  onSubmit,
  title,
  loading = false,
  children,
  width = 540
}) => {
  return (
    <Drawer
      placement="right"
      width={width}
      onClose={onClose}
      open={open}
      closable={false}
      headerStyle={{ paddingBottom: 0, borderBottom: "none" }}
      bodyStyle={{ padding: "12px 18px 0px 24px" }}
      footerStyle={{ borderTop: "none" }}
      footer={
        <div className="flex justify-end gap-3 mb-3 pr-2 pb-1">
          <SecondaryButton onClick={onClose}>
            Close
          </SecondaryButton>
          <SubmitButton onClick={onSubmit} loading={loading}>
            Submit
          </SubmitButton>
        </div>
      }
    >
      <div className="flex items-start justify-between mb-1">
        <h2 className="text-lg font-medium text-black mt-3">{title}</h2>
        <button
          onClick={onClose}
          aria-label="Close"
          className="text-gray-500 hover:text-black transition duration-300 ease-in-out cursor-pointer"
        >
          <CloseOutlined style={{ fontSize: "12px" }} />
        </button>
      </div>
      <div className="flex flex-col gap-6 pr-2">
        {children}
      </div>
    </Drawer>
  );
};