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

const NextArrow = ({ currentSlide, slideCount, ...props }: { currentSlide?: number, slideCount?: number, [x: string]: any }) => (
  <ArrowRightOutlined {...props} />
);

const PrevArrow = ({ currentSlide, slideCount, ...props }: { currentSlide?: number, slideCount?: number, [x: string]: any }) => (
  <ArrowLeftOutlined {...props} />
);

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
            disabled={!selectedRole}
            >
            OK
            </Button>
        ]}
        >
        <Carousel
            autoplay={false}
            arrows
            dots={false}
            nextArrow={<NextArrow currentSlide={0} slideCount={0}/>}
            prevArrow={<PrevArrow currentSlide={0} slideCount={0}/>}
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