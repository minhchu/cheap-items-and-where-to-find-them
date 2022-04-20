import Dexie, { Table } from "dexie";

export interface Item {
  id?: number;
  name: string;
  price: number;
  store_address: string;
}

export class CheapItems extends Dexie {
  items!: Table<Item>;

  constructor() {
    super("cheap_items");
    this.version(1).stores({
      items: "++id, name, price, store_address", // Primary key and indexed props
    });
  }
}

export const db = new CheapItems();
