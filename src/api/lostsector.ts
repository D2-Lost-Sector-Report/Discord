import fetch from "node-fetch";

const USER_AGENT =
  "D2LS-Discord/2.0 (+https://github.com/D2-Lost-Sector-Report/Discord)";
const UPCOMING_URL = "https://api.d2lostsector.report/lostsectors/5/";
const SECTOR_BY_DATE_URL = "https://api.d2lostsector.report/lostsectors/active/";

export const imageEndpoint = "assets.d2lostsector.report";
export const cfWebsiteAssetPath = `https://cf-${imageEndpoint}/for-website/`;
export const cfParams = `width=800&watermark=true`;

export const LostSectorLogo = "<:lostsector:976423790261207080>";
export const SoloOpsLogo = "<:soloops:1404844763525681282>";


export interface LostSector {
  sectorId: string;
  sectorName: string;
  planetName: string;
  threat: string;
  overcharged: string;
  variants: {
    expert: LostSectorVariant;
    master: LostSectorVariant;
  };
}

export interface LostSectorVariant {
  activityId: number;
  champions: {
    barrier: number;
    overload: number;
    unstoppable: number;
  };
  shields: {
    solar: number;
    arc: number;
    void: number;
    stasis: number;
    strand: number;
  };
}

export interface LostSectors {
  lostSectors: LostSector[];
}

export class LostSectorAPI {

  static async fetchAll(): Promise<LostSectors[]> {
    const res = await fetch(UPCOMING_URL, {
      headers: { "User-Agent": USER_AGENT },
    });
    if (!res.ok)
      throw new Error(`Failed to fetch upcoming lost sectors: ${res.status}`);
    return res.json() as Promise<LostSectors[]>;
  }


  static async fetchByDate(date: string): Promise<LostSectors> {
    const url = SECTOR_BY_DATE_URL + date;
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
    });
    if (!res.ok)
      throw new Error(
        `Failed to fetch lost sector for date ${date}: ${res.status}`
      );
    return res.json() as Promise<LostSectors>;
  }

  /**
   * Get the currently active lost sectors, using UTC time.
   * If before 17:00 UTC, fetch the previous day's sector.
   */
  static async fetchCurrent(): Promise<LostSectors> {
    const date = new Date();
    if (date.getUTCHours() < 17) {
      date.setUTCDate(date.getUTCDate() - 1);
    }
    const dateStr = date.toISOString().slice(0, 10);
    return this.fetchByDate(dateStr);
  }
}