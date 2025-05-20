import React from 'react';
import { Modal, Tabs, Button } from 'antd';
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
          <Tabs defaultActiveKey="0" centered>
            {team.map((user, index) => (
              <Tabs.TabPane tab={user.username} key={index.toString()}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <RoleCard role={user.role} />
                </div>
              </Tabs.TabPane>
            ))}
          </Tabs>
        </Modal>
  );
};