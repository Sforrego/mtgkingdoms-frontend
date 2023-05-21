import { Role } from "../../Types/Role";
import { RoleType } from "../../Types/RoleType";
import { CardColor, MagicCard } from "../MtgCard/MagicCard";

const roleTypeToColorMap: Record<RoleType, CardColor> = {
  Monarch: "white",
  Noble: "blue",
  Renegade: "black",
  Outlaw: "red",
  Knight: "green",
};

const roleTypeToSetMap: Record<RoleType, string> = {
  Monarch: "ss ss-v11 ss-mythic ss-grad",
  Noble: "ss ss-leg ss-mythic ss-grad",
  Renegade: "ss ss-mmq ss-mythic ss-grad",
  Outlaw: "ss ss-mrd ss-mythic ss-grad",
  Knight: "ss ss-5dn ss-mythic ss-grad",
};

export const RoleCard = ({
  role: { RoleType, RoleName, RoleDescription, RoleImage },
}: {
  role: Role;
}) => (
  <MagicCard
    artUrl={RoleImage}
    name={RoleName}
    cardColor={roleTypeToColorMap[RoleType]}
    descriptions={RoleDescription.split("\n")}
    type={`Role - ${RoleType}`}
    expansionSymbol={roleTypeToSetMap[RoleType]}
  />
);
