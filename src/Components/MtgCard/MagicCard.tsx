import "mana-font";
import "keyrune";
import styles from "./MagicCard.module.css";
import { manaCostMatcher} from "./magicUtils";
import "./MTGFonts.css";

export type CardProps = {
  name?: string;
  type?: string;
  manaCost?: string;
  descriptions?: string[];
  flavorText?: string[];
  expansionSymbol?: string;
  powerAndThougness?: string;
  artUrl?: string;
  fotterLeftText?: string[];
  fotterRightText?: string[];
  cardColor?: CardColor;
  cardFrame?: CardColor;
  cardBackground?: CardColor;
};

export type CardColor =
  | "green"
  | "blue"
  | "black"
  | "red"
  | "white"
  | "colorless";

const manaIcons: Record<string, string> = {
  G: "ms ms-g ms-cost",
  R: "ms ms-r ms-cost",
  U: "ms ms-u ms-cost",
  B: "ms ms-b ms-cost",
  W: "ms ms-w ms-cost",
};

const backgroundClassesMap: Record<CardColor, string> = {
  green: styles["green-background"],
  red: styles["red-background"],
  blue: styles["blue-background"],
  black: styles["black-background"],
  white: styles["white-background"],
  colorless: styles["colorless-background"],
};


const MagicCard = ({
  cardColor,
  artUrl,
  name,
  type,
  descriptions,
}: CardProps) => {
  const backgroundClass = backgroundClassesMap[cardColor ?? "colorless"]
  return (
    <div className={styles.imageContainer}>
      <img src={artUrl} alt="card art" className={backgroundClass} />
      <div className={`${styles.titleBox} ${backgroundClass}`}>
        <p className={styles.title}>{name}</p>
        <p className={styles.subtitle}>{type}</p>
      </div>
      <div className={`${styles.bodyBox} ${backgroundClass}`}>
        {descriptions?.map((text, index) => {
          const textWithManaCosts = text.replaceAll(
            manaCostMatcher,
            (match: string) => {
              const cost = match.slice(1, -1);
              return /*html*/ `
                                    <span style="font-size: 14px;">
                                        <i style="padding-left: 2px;" class="${`${manaIcons[cost] ||
                                          `ms ms-${cost} ms-cost`
                }`}"></i>
                                    </span>
                                `;
            }
          );
          return (
            <p
              key={index}
              dangerouslySetInnerHTML={{ __html: textWithManaCosts }}
            />
          );
        })}
      </div>
    </div>)
}

export { MagicCard };