import React from 'react';
import { Modal, Carousel } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Role } from '../../Types/Role';
import { RoleCard } from '../RoleCard';

type NoblesModalProps = {
  isOpen: boolean;
  onOk: () => void;
  onCancel: () => void;
  nobles: Role[];
};

export const NoblesModal: React.FC<NoblesModalProps> = ({
  isOpen,
  onOk,
  onCancel,
  nobles
}) => {

  return (
    <Modal
      title="Nobles Roles"
      open={isOpen}
      onOk={onOk}
      onCancel={onCancel}
      centered
      >
        <Carousel
      autoplay={false}
      arrows
      nextArrow={<ArrowRightOutlined/>}
      prevArrow={<ArrowLeftOutlined/>}
    >
      {nobles.map((noble: Role, index: number) => (
        <div key={index}>
        <RoleCard key={noble.name} role={noble} />
        </div>
      ))}
    </Carousel>
    </Modal>
  );
};