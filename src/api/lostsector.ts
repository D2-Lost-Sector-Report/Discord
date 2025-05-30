import fetch from "node-fetch";

const USER_AGENT =
  "D2LS-Discord/1.0 (+https://github.com/D2-Lost-Sector-Report/Discord)";
const UPCOMING_URL = "https://api.d2lostsector.report/lostsectors/upcoming";
const SECTOR_BY_DATE_URL = "https://api.d2lostsector.report/lostsector/";

export interface LostSectorReward {
  id: string;
  name: string;
  description: string;
  type: string;
}

export interface LostSector {
  id: string;
  date: string;
  name: string;
  planet: string;
  imageCount: number;
  champions: any[];
  shields: any[];
  banes: any[];
  surges: string[];
  threat: string;
  overcharge: string;
  rahool: string;
  activityid: string;
  rewardIds: string[];
  rewards: { reward: LostSectorReward }[];
}

export class LostSectorAPI {
  static async fetchUpcoming(): Promise<LostSector[]> {
    const res = await fetch(UPCOMING_URL, {
      headers: { "User-Agent": USER_AGENT },
    });
    if (!res.ok)
      throw new Error(`Failed to fetch upcoming lost sectors: ${res.status}`);
    return res.json() as Promise<LostSector[]>;
  }

  static async fetchByDate(date: string): Promise<LostSector> {
    const url = SECTOR_BY_DATE_URL + date;
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
    });
    if (!res.ok)
      throw new Error(
        `Failed to fetch lost sector for date ${date}: ${res.status}`
      );
    return res.json() as Promise<LostSector>;
  }

  /**
   * Get the currently active lost sector, using UTC time.
   * If before 17:00 UTC, fetch the previous day's sector.
   */
  static async fetchCurrent(): Promise<LostSector> {
    const date = new Date();
    if (date.getUTCHours() < 17) {
      date.setUTCDate(date.getUTCDate() - 1);
    }
    const dateStr = date.toISOString().slice(0, 10);
    return this.fetchByDate(dateStr);
  }
}

export const rewardsList: string[] = [];

export async function populateRewardsList() {
  try {
    const upcoming = await LostSectorAPI.fetchUpcoming();
    const seen = new Set<string>();
    rewardsList.length = 0;
    for (const sector of upcoming) {
      for (const { reward } of sector.rewards || []) {
        const formatted = `${reward.name} (${reward.type})`;
        if (!seen.has(formatted)) {
          seen.add(formatted);
          rewardsList.push(formatted);
        }
      }
    }
  } catch (err) {
    console.error("Failed to populate rewardsList:", err);
  }
}
