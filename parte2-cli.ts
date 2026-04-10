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
  // NOVO: usa item.toJSON() para acessar description e completed,
  // e exibe o status ao lado de cada item.
  items.forEach((item, index) => {
    const { description, completed } = item.toJSON();
    const status = completed ? '[✔]' : '[ ]';
    console.log(`${index}: ${status} ${description}`);
  });
  process.exit(0);
}

// NOVO: comando estava como // ... no material.
// Lê índice e nova descrição, cria um novo Item e chama todo.updateItem().
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
  } catch (error: any) {
    console.error(error.message);
    process.exit(1);
  }
  process.exit(0);
}

// NOVO: comando estava como // ... no material.
// Lê o índice e chama todo.removeItem().
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
  } catch (error: any) {
    console.error(error.message);
    process.exit(1);
  }
  process.exit(0);
}

// NOVO: chama todo.toggleItem() que por sua vez chama item.toggleCompleted().
// O retorno indica se o item ficou concluído ou pendente após a alternância.
// Exemplo: bun cli.ts lista.json toggle 0
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
  } catch (error: any) {
    console.error(error.message);
    process.exit(1);
  }
  process.exit(0);
}

// NOVO: usa findItemByDescription() já definido na classe ToDo.
// A busca é por descrição exata (não parcial).
// Exemplo: bun cli.ts lista.json search "Comprar leite"
if (command === "search") {
  const keyword = process.argv[4];
  if (!keyword) {
    console.error("Por favor, forneça uma descrição para buscar.");
    process.exit(1);
  }
  const found = await todo.findItemByDescription(keyword);
  if (!found) {
    console.log(`Nenhum item encontrado com a descrição "${keyword}".`);
    process.exit(0);
  }
  const { description, completed } = found.toJSON();
  console.log(`Item encontrado: ${description} — ${completed ? 'concluído ✔' : 'pendente [ ]'}`);
  process.exit(0);
}

console.error("Comando desconhecido. Use 'add', 'list', 'update', 'remove', 'toggle' ou 'search'.");
process.exit(1);
