export type FactStatus = "confirmed" | "unconfirmed" | "unknown";

export type CaseFact<T = string> = {
  value: T | null;
  status: FactStatus;
  sourceIds: string[];
  note?: string;
};

export type CaseSource = {
  id: string;
  title: string;
  path?: string;
  note?: string;
};

export type CopySceneId = "signup" | "route" | "guide";
export type CopyTone = "official" | "passion" | "culture" | "young";
export type RequiredEventFact = "date" | "registrationPeriod" | "collectionPeriod" | "scale" | "categories" | "route";

export type CopyScene = {
  id: CopySceneId;
  name: string;
  icon: string;
  hint: string;
  subtitle: string;
  focus: string;
  requires: RequiredEventFact[];
  titles: string[];
  body: Record<CopyTone, string>;
  moments: string[];
  video: string;
};

export type CopywritingModule = {
  tones: Record<CopyTone, string>;
  scenes: Record<CopySceneId, CopyScene>;
};

export type VideoAssetConfig = { src:string; name:string; label:string; note:string; orientation:"横图"|"竖图" };
export type VideoModule = {
  title: string;
  duration: number;
  landscapeRatio: string;
  portraitRatio: string;
  story: string[];
  insight: string;
  assets: VideoAssetConfig[];
  finalVideo: string;
  poster: string;
};

export type PptSlideConfig = { section:string; title:string; purpose:string; keywords:string[] };
export type PptModule = {
  title:string; audience:string; style:string; display:string; slides:PptSlideConfig[];
  compactSlideIndexes:number[]; downloadPath:string; previewPath:string; strategy:string;
};

export type CreativeProductId = "medal" | "shirt" | "mascot" | "poster";
export type CreativeDirectionConfig = { id:"heritage"|"future"|"charity"; code:string; name:string; keywords:string[]; summary:string };
export type CreativeProductConfig = { product:CreativeProductId; design_name:string; keywords:string[]; description:string; image:string; label:string };
export type CreativeModule = {
  brief:{ values:string[]; culture:string[]; brand:string[]; charity:string[] };
  genes:string[]; directions:CreativeDirectionConfig[]; products:CreativeProductConfig[];
};

export type DemoCase = {
  id: string;
  version: string;
  updatedAt: string;
  sources: CaseSource[];
  facts: {
    event: {
      fullName: CaseFact;
      shortName: CaseFact;
      slogan: CaseFact;
      publicTheme: CaseFact;
      date: CaseFact;
      registrationPeriod: CaseFact;
      collectionPeriod: CaseFact;
      scale: CaseFact;
      categories: CaseFact<string[]>;
      city: CaseFact;
      venue: CaseFact;
      route: CaseFact;
    };
    sponsor: {
      name: CaseFact;
      cooperationType: CaseFact;
      industryKeywords: CaseFact<string[]>;
    };
    charity: {
      positioning: CaseFact<string[]>;
      beneficiary: CaseFact;
      donationCommitment: CaseFact;
    };
  };
  demoDefaults: {
    city: string;
    venue: string;
    culture: string[];
    notice: string;
  };
  presentation: {
    pptClosing: string;
    disclaimer: string;
    prohibitedClaims: string[];
  };
  modules: {
    copywriting: CopywritingModule;
    video: VideoModule;
    ppt: PptModule;
    creative: CreativeModule;
  };
};
