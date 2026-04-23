import { ToDo, Item } from './core.ts';

const file = process.argv[2];
const command = process.argv[3];

if (!file) {
  console.error("Por favor, forneça o caminho do arquivo.");
  process.exit(1);
}

const todo = new ToDo(file);

if (command === "add") {
  const itemDescription = process.argv[4];

  if (!itemDescription) {
    console.error("Por favor, forneça uma descrição para o item.");
    process.exit(1);
  }

  const item = new Item(itemDescription);
  await todo.addItem(item);
  console.log(`Item "${itemDescription}" adicionado com sucesso!`);
  process.exit(0);
}

if (command === "list") {
  const items = await todo.getItems();

  if (items.length === 0) {
    console.log("Nenhum item na lista.");
    process.exit(0);
  }

  console.log("Lista de itens:");
  items.forEach((item, index) => {
    const { description, completed } = item.toJSON();
    const status = completed ? '[✔]' : '[ ]';
    console.log(`${index}: ${status} ${description}`);
  });
  process.exit(0);
}

// update
if (command === "update") {
  if (!process.argv[4]) {
    console.error("Por favor, forneça um índice válido.");
    process.exit(1);
  }

  const index = parseInt(process.argv[4]);
  const newDescription = process.argv[5];

  if (isNaN(index) || !newDescription) {
    console.error("Por favor, forneça um índice válido e uma nova descrição.");
    process.exit(1);
  }

  try {
    await todo.updateItem(index, new Item(newDescription));
    console.log(`Item no índice ${index} atualizado para "${newDescription}".`);
    process.exit(0);
  } catch (error: any) {
    console.error(error.message);
    process.exit(1);
  }
}

// remove
if (command === "remove") {
  if (!process.argv[4]) {
    console.error("Por favor, forneça um índice válido.");
    process.exit(1);
  }

  const index = parseInt(process.argv[4]);

  if (isNaN(index)) {
    console.error("Por favor, forneça um índice válido para remover.");
    process.exit(1);
  }

  try {
    await todo.removeItem(index);
    console.log(`Item no índice ${index} removido com sucesso.`);
    process.exit(0);
  } catch (error: any) {
    console.error(error.message);
    process.exit(1);
  }
}

if (command === "toggle") {
  if (!process.argv[4]) {
    console.error("Por favor, forneça um índice válido.");
    process.exit(1);
  }

  const index = parseInt(process.argv[4]);

  if (isNaN(index)) {
    console.error("Por favor, forneça um índice válido.");
    process.exit(1);
  }

  try {
    const nowCompleted = await todo.toggleItem(index);
    console.log(`Item no índice ${index} marcado como ${nowCompleted ? 'concluído ✔' : 'pendente [ ]'}.`);
    process.exit(0);
  } catch (error: any) {
    console.error(error.message);
    process.exit(1);
  }
}

console.error("Comando desconhecido. Use 'add', 'list', 'update', 'remove' ou 'toggle'.");
process.exit(1);