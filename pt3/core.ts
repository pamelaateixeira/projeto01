export class Item {
  private description: string;
  // armazena o status de conclusão da tarefa
  private completed: boolean;

  // aceita completed como parâmetro opcional para restaurar itens salvos
  constructor(description: string, completed: boolean = false) {
    this.description = description;
    this.completed = completed;
  }

  updateDescription(newDescription: string) {
    this.description = newDescription;
  }

  // alterna o status e retorna o novo valor
  toggleCompleted() {
    this.completed = !this.completed;
    return this.completed;
  }

  // agora inclui completed além de description
  toJSON() {
    return {
      description: this.description,
      completed: this.completed,
    };
  }
}

export class ToDo {
  private filepath: string;
  private items: Promise<Item[]>;

  constructor(filepath: string) {
    this.filepath = filepath;
    this.items = this.loadFromFile();
  }

  private async saveToFile() {
    try {
      const items = await this.items;
      const file = Bun.file(this.filepath);
      const data = JSON.stringify(items);
      return Bun.write(file, data);
    } catch (error) {
      console.error('Error saving to file:', error);
    }
  }

  private async loadFromFile() {
    const file = Bun.file(this.filepath);
    if (!(await file.exists()))
      return [];
    const data = await file.text();
    // passa itemData.completed para restaurar o status salvo
    return JSON.parse(data).map((itemData: any) => new Item(itemData.description, itemData.completed));
  }

  async addItem(item: Item) {
    const items = await this.items;
    items.push(item);
    this.saveToFile();
  }

  async getItems() {
    return await this.items;
  }

  async updateItem(index: number, newItem: Item) {
    const items = await this.items;
    if (index < 0 || index >= items.length)
      throw new Error('Index out of bounds');
    items[index] = newItem;
    this.saveToFile();
  }

  async removeItem(index: number) {
    const items = await this.items;
    if (index < 0 || index >= items.length)
      throw new Error('Index out of bounds');
    items.splice(index, 1);
    this.saveToFile();
  }

  // chama toggleCompleted() no item e salva
  async toggleItem(index: number) {
    const items = await this.items;
    if (index < 0 || index >= items.length)
      throw new Error('Index out of bounds');
    const nowCompleted = items[index].toggleCompleted();
    this.saveToFile();
    return nowCompleted;
  }

  async findItemByDescription(description: string): Promise<Item | undefined> {
    const items = await this.items;
    return items.find(item => item.toJSON().description === description);
  }

  async findItemByIndex(index: number): Promise<Item | undefined> {
    const items = await this.items;
    if (index < 0 || index >= items.length)
      throw new Error('Index out of bounds');
    return items[index];
  }
}