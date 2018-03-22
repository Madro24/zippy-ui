export class ScheduledItemLog {
    id: string;
    items: Array<string>;

    constructor( id: string, itemId: string) {
      this.id = id;
      this.items = [];
      this.items.push(itemId);
    }
}
