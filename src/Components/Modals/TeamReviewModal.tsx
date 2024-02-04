import React from 'react';
import { Modal, Carousel, Button } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { User } from '../../Types/User';
import { RoleCard } from '../RoleCard';

type TeamReviewModalProps = {
  isOpen: boolean;
  onOk: () => void;
  onCancel: () => void;
  team: User[];
};

export const TeamReviewModal: React.FC<TeamReviewModalProps> = ({
  isOpen,
  onOk,
  onCancel,
  team,
}) => {

  return (
    <Modal
        title="Review your team"
        open={isOpen}
        closable={false}
        onOk={onOk}
        onCancel={onCancel}
        centered
        footer={[
            <Button 
            key="cancel" 
            onClick={onCancel}
            >
            Cancel
            </Button>,
            <Button 
            key="submit" 
            type="primary" 
            onClick={onOk}
            >
            Confirm
            </Button>
        ]}
        >
        <Carousel
            autoplay={false}
            arrows
            dots={false}
            nextArrow={<ArrowRightOutlined />}
            prevArrow={<ArrowLeftOutlined />}
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