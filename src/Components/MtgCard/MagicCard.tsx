import React from "react";
import "mana-font";
import "keyrune";
import styles from "./MagicCard.module.css";
import { manaCostMatcher, manaCostParser } from "./magicUtils";
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
  | "uncolor";

const frameClassesMap: Record<CardColor, string> = {
  green: styles["green-frame"],
  red: styles["red-frame"],
  blue: styles["blue-frame"],
  black: styles["black-frame"],
  white: styles["white-frame"],
  uncolor: styles["uncolor-frame"],
};

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
  uncolor: styles["uncolor-background"],
};

const MagicCard = ({
  cardColor,
  cardBackground,
  cardFrame,
  ...props
}: CardProps) => {
  const frameClass = frameClassesMap[cardFrame ?? cardColor ?? "uncolor"];
  const backgroundClass =
    backgroundClassesMap[cardBackground ?? cardColor ?? "uncolor"];

  const manaCostArray = props.manaCost && manaCostParser(props.manaCost);
  return (
    <div className={styles["card-container"]}>
      <div className={`${styles["card-background"]} ${backgroundClass}`}>
        <div className={[styles["card-frame"], frameClass].join(" ")}>
          <div className={styles["frame-header"]}>
            <div className={styles.name}>{props.name}</div>
            <div className={styles["mana-costs"]}>
              {manaCostArray &&
                manaCostArray.map((cost, index) => (
                  <div className={styles["mana-icon"]} key={index}>
                    <i
                      className={`${
                        manaIcons[cost] || `ms ms-${cost} ms-cost`
                      } ms-shadow`}
                    />
                  </div>
                ))}
            </div>
          </div>

          <div className={styles["frame-art"]}>
            <img src={props.artUrl} alt="card art" />
          </div>

          <div className={styles["frame-type-line"]}>
            <div className={styles["type"]}>{props.type}</div>
            {props.expansionSymbol && (
              <div className={styles["set-icon"]}>
                {props.expansionSymbol.startsWith("ss") ? (
                  <i className={`${props.expansionSymbol} ss-fw`} />
                ) : (
                  <img src={props.expansionSymbol} alt="expansion-icon" />
                )}
              </div>
            )}
          </div>

          <div className={styles["frame-text-box"]}>
            {props.descriptions?.map((text, index, { length }) => {
              const textWithManaCosts = text.replaceAll(
                manaCostMatcher,
                (match: string) => {
                  const cost = match.slice(1, -1);
                  return /*html*/ `
                                    <span style="font-size: 14px;">
                                        <i style="padding-left: 2px;" class="${`${
                                          manaIcons[cost] ||
                                          `ms ms-${cost} ms-cost`
                                        }`}"></i>
                                    </span>
                                `;
                }
              );
              return (
                <p
                  key={index}
                  className={`description${
                    index < length ? " ftb-inner-margin" : ""
                  }`}
                  dangerouslySetInnerHTML={{ __html: textWithManaCosts }}
                />
              );
            })}
            {props.flavorText?.map((text, index) => (
              <p
                key={index}
                className={`flavour-text${
                  !index ? " flavour-text-first-margin" : ""
                }`}
                dangerouslySetInnerHTML={{ __html: `<i>${text}</i>` }}
              />
            ))}
          </div>

          <div
            className={[
              styles["frame-bottom-info"],
              styles["inner-margin"],
            ].join(" ")}
          >
            <div className={styles["fbi-left"]}>
              {props.fotterLeftText?.map((text, index) => (
                <p dangerouslySetInnerHTML={{ __html: text }} key={index} />
              ))}
            </div>

            <div className={styles["fbi-center"]} />

            <div className={styles["fbi-right"]}>
              {props.fotterRightText?.map((text, index) => (
                <p dangerouslySetInnerHTML={{ __html: text }} key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { MagicCard };
