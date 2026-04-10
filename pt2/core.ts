export class Item {
  private description: string;
  // NOVO: armazena o status de conclusão da tarefa.
  // É private para seguir o encapsulamento — só pode ser alterado pelos métodos da classe.
  private completed: boolean;

  // MUDANÇA: o constructor agora aceita um segundo parâmetro opcional 'completed'.
  // O valor padrão é false, então new Item("tarefa") cria uma tarefa pendente.
  // O parâmetro existe para que o loadFromFile() consiga recriar itens
  // que já estavam salvos como concluídos no arquivo JSON.
  constructor(description: string, completed: boolean = false) {
    this.description = description;
    this.completed = completed;
  }

  updateDescription(newDescription: string) {
    this.description = newDescription;
  }

  // NOVO: alterna o status de concluído/pendente e retorna o novo valor.
  // O cli.ts usa o valor retornado para exibir a mensagem correta ao usuário.
  toggleCompleted() {
    this.completed = !this.completed;
    return this.completed;
  }

  // MUDANÇA: toJSON() agora inclui o campo 'completed' além de 'description'.
  // Isso garante que o status seja salvo no arquivo JSON e recuperado corretamente.
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
    // MUDANÇA: agora passa itemData.completed para o constructor do Item
    // para restaurar o status salvo. Antes só passava itemData.description.
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
    if (index < 0 || index > items.length)
      throw new Error('Index out of bounds');
    items[index] = newItem;
    this.saveToFile();
  }

  async removeItem(index: number) {
    const items = await this.items;
    if (index < 0 || index > items.length)
      throw new Error('Index out of bounds');
    items.splice(index, 1);
    this.saveToFile();
  }

  // NOVO: encontra o item pelo índice, chama toggleCompleted() nele e salva.
  // Retorna o novo estado para o cli.ts exibir a mensagem certa.
  async toggleItem(index: number) {
    const items = await this.items;
    if (index < 0 || index > items.length)
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
    if (index < 0 || index > items.length)
      throw new Error('Index out of bounds');
    return items[index];
  }
}