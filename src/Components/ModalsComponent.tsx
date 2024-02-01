import { useAppContext } from '../AppContext';
import { RolesModal } from './Modals/RolesModal';
import { ProfileModal } from './Modals/ProfileModal';
import { If } from "conditional-jsx";

export const ModalsComponent = () => {
  const { showRoles, profile, user } = useAppContext();

  return (
    <>
      <If condition={showRoles}>
        <RolesModal/>
      </If>
      <If condition={profile}>
        {user && <ProfileModal />}
      </If>
    </>
  );
};