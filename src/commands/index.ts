import * as current from "./current";
import * as upcoming from "./upcoming";
import * as nextWeapon from "./next-weapon";
import * as nextArmor from "./next-armor";
import * as alert from "./alert";

export const commands = {
  current,
  upcoming,
  "next-weapon": nextWeapon,
  "next-armor": nextArmor,
  alert,
};
