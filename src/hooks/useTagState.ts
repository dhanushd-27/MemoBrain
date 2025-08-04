import { create } from "zustand";

export enum tagTypeEnum {
  all = "all",
  links = "links",
  videos = "videos",
  docs = "docs",
  tweet = "tweets"
}

interface tagStoreInterface {
  tagState: tagTypeEnum;
  changeTagType: (tagType: tagTypeEnum) => void;
}

export const useTagStore = create<tagStoreInterface>((set) => ({
  tagState: tagTypeEnum.all,
  changeTagType: (tagState: tagTypeEnum) => {
    set(() => ({
      tagState,
    }));
  },
}));
