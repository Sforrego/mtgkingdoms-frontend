import React from 'react';
import { Modal, Carousel, Button } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Role } from '../../Types/Role';
import { RoleCard } from '../RoleCard';

type RoleSelectionModalProps = {
  isOpen: boolean;
  onOk: () => void;
  onCancel: () => void;
  potentialRoles: Role[];
  selectedRole: Role | null;
  setSelectedRole: (role: Role) => void;
};

export const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({
  isOpen,
  onOk,
  onCancel,
  potentialRoles,
  selectedRole,
  setSelectedRole,
}) => {

  return (
    <Modal
        title="Select Your Role"
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
            disabled={!selectedRole} // Disable button if selectedRole is null or undefined
            >
            OK
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
            {potentialRoles.map((role, index) => (
            <div key={index} className="carousel-item">
                <RoleCard key={role.name} role={role}/>
                <Button
                onClick={() => setSelectedRole(role)}
                className={selectedRole === role ? "selected-role-button" : "role-select-button"}
                >
                {selectedRole === role ? "Selected" : "Select"}
                </Button>
            </div>
            ))}
        </Carousel>
        </Modal>
  );
};