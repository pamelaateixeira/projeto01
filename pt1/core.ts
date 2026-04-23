const jsonFilePath = __dirname + '/data.todo.json';

type Item = {
  description: string;
  completed: boolean;
};

const list: Item[] = await loadFromFile();

async function loadFromFile() {
  try {
    const file = Bun.file(jsonFilePath);
    const content = await file.text();
    return JSON.parse(content) as Item[];
  } catch (error: any) {
    if (error.code === 'ENOENT')
      return [];
    throw error;
  }
}

async function saveToFile() {
  try {
    await Bun.write(jsonFilePath, JSON.stringify(list));
  } catch (error: any) {
    throw new Error("Erro ao salvar os dados no arquivo: " + error.message);
  }
}

// add
// salva objeto com description e completed, em vez de string
async function addItem(item: string) {
  list.push({ description: item, completed: false });
  await saveToFile();
}

// list
async function getItems() {
  return list;
}

// update
async function updateItem(index: number, newItem: string) {
  if (index < 0 || index >= list.length)
    throw new Error("Index fora dos limites");
  list[index].description = newItem;
  await saveToFile();
}

// remove
async function removeItem(index: number) {
  if (index < 0 || index >= list.length)
    throw new Error("Index fora dos limites");
  list.splice(index, 1);
  await saveToFile();
}

// alterna o status de concluído/pendente e retorna o novo valor
async function toggleItem(index: number) {
  if (index < 0 || index >= list.length)
    throw new Error("Index fora dos limites");
  list[index].completed = !list[index].completed;
  await saveToFile();
  return list[index].completed;
}

export default { addItem, getItems, updateItem, removeItem, toggleItem};

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         