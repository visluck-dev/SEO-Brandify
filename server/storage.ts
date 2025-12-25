// Static website - no storage needed
// All data is in client/src/constants

export interface IStorage {
  // Placeholder
}

export class MemStorage implements IStorage {}

export const storage = new MemStorage();
