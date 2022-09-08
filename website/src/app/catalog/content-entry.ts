import { getBasePath } from "../router";
import { getBaseUrl, getFileUrl } from "../shared/github";
import { updateAssetsBasePath } from "../shared/loader";

const defaultBanner = 'images/workshop-banner-default.jpg';

export interface ContentEntry {
  title: string;
  description: string;
  tags: string[];
  url: string;
  authors: string[];
  duration: number | undefined;
  bannerUrl: string | undefined;
  lastUpdated: string;
}

export async function loadCatalog(): Promise<ContentEntry[]> {
  const response = await fetch('workshops.json');
  
  if (response.status !== 200) {
    const error = `Cannot load content catalog: ${response.status} ${response.statusText}`;
    console.error(error);
    throw new Error(error);
  }

  const entries = await response.json() as ContentEntry[];
  entries.forEach((entry) => {
    entry.bannerUrl = entry.bannerUrl ? createBannerUrl(entry.url, entry.bannerUrl) : defaultBanner;
    entry.url = createWorkshopUrl(entry.url);
  });

  return entries;
}

function createWorkshopUrl(file: string) {
  return `${window.location.origin}${getBasePath()}workshop/?src=${file}`;
}

function createBannerUrl(repoPath: string, file: string) {
  const gitHubFileUrl = getFileUrl(repoPath);
  return updateAssetsBasePath(file, getBaseUrl(gitHubFileUrl))
}
