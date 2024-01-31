import React from 'react';
import { Modal, Carousel } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { User } from '../../Types/User';
import { RoleCard } from '../RoleCard';

type TeamOverviewModalProps = {
  isOpen: boolean;
  onOk: () => void;
  onCancel: () => void;
  team: User[];
};

export const TeamOverviewModal: React.FC<TeamOverviewModalProps> = ({
  isOpen,
  onOk,
  onCancel,
  team
}) => {

  return (
    <Modal
      title="Team Overview"
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
      {team.map((user: User, index: number) => (
        <div key={index}>
        <h1 style={{ marginBottom: '10px', marginTop: '0', color: "white", textAlign: "center" }}> {user.username}</h1>
        <RoleCard key={user.role?.name} role={user.role} />
        </div>
      ))}
    </Carousel>
    </Modal>
  );
};