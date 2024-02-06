import { useAppContext } from '../Context/AppContext';
import { RolesModal } from './Modals/RolesModal';
import { ProfileModal } from './Modals/ProfileModal';
import { If } from "conditional-jsx";

export const ModalsComponent = () => {
  const { showRoles, profile, accountUser } = useAppContext();

  return (
    <>
      <If condition={showRoles}>
        <RolesModal/>
      </If>
      <If condition={profile}>
        {accountUser && <ProfileModal />}
      </If>
    </>
  );
};