import { Role } from "../../Types/Role";
import { RoleType } from "../../Types/RoleType";
import { CardColor, MagicCard } from "../MtgCard/MagicCard";

const roleTypeToColorMap: Record<RoleType, CardColor> = {
  Monarch: "white",
  Noble: "blue",
  Renegade: "black",
  Bandit: "red",
  Knight: "green",
  SubRole: "uncolor",
};

export const roleTypeToSetMap: Record<RoleType, string> = {
  Monarch: "ss ss-v11 ss-mythic ss-grad",
  Noble: "ss ss-leg ss-mythic ss-grad",
  Renegade: "ss ss-mmq ss-mythic ss-grad",
  Bandit: "ss ss-mrd ss-mythic ss-grad",
  Knight: "ss ss-5dn ss-mythic ss-grad",
  SubRole: "ss ss-apc ss-mythic ss-grad",
};

export const RoleCard = ({
  role: { name: Name, type: Type, ability: Ability, image: Image },
}: {
  role: Role;
}) => (
  <MagicCard
    artUrl={Image}
    name={Name}
    cardColor={roleTypeToColorMap[Type]}
    descriptions={Ability.split("\n")}
    type={`Role - ${Type}`}
    expansionSymbol={roleTypeToSetMap[Type]}
  />
);
