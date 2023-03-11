export interface PageScraperInterface<T extends object> {
  scrap: () => Promise<T[]>;
}
