import CloseButton from './closeButton';

export default class TasksTable {
  constructor() {
    this.state = JSON.parse(localStorage.getItem('tasksTableState')) || [
      { title: 'TODO', cards: [] },
      { title: 'In Progress', cards: [] },
      { title: 'Done', cards: [] },
    ];

    this.init();
  }

  init() {
    this.render();

    this.tableAddButtons = document.querySelectorAll('.tasks-table-column-add-card-button');
    this.tableButtonsOnclick = this.tableButtonsOnclick.bind(this);
    this.tableAddButtons.forEach((button) => {
      button.addEventListener('click', (e) => this.tableButtonsOnclick(e));
    });

    this.addCardButtons = document.querySelectorAll('.tasks-table-column-button');
    this.addCardButtonOnClick = this.addCardButtonOnClick.bind(this);
    this.addCardButtons.forEach((button) => {
      button.addEventListener('click', (e) => this.addCardButtonOnClick(e));
    });

    this.closeButton = new CloseButton();
  }

  saveState() {
    localStorage.setItem('tasksTableState', JSON.stringify(this.state));
  }

  render() {
    const tasksTable = document.querySelector('.tasks-table');
    tasksTable.innerHTML = '';

    this.state.forEach((column) => {
      const columnElement = document.createElement('li');
      columnElement.classList.add('tasks-table-column');

      columnElement.innerHTML = `
        <h2 class="tasks-table-column-title">${column.title}</h2>
        <div class="tasks-table-column-cards"></div>
        <button class="tasks-table-column-add-card-button">+ Add another card</button>
        <div class="tasks-table-column-add-card-wrapper">
          <textarea class="tasks-table-column-textarea" placeholder="Enter a title for this card..."></textarea>
          <button class="tasks-table-column-button">Add card</button>
          <button class="tasks-table-column-close-button close-button">&#10005;</button>
        </div>
      `;

      const cardsContainer = columnElement.querySelector('.tasks-table-column-cards');
      column.cards.forEach((card) => {
        const cardElement = this.createCardElement(card);
        cardsContainer.appendChild(cardElement);
      });

      tasksTable.appendChild(columnElement);
    });
  }

  getStateFromDOM() {
    const state = [];

    const columns = document.querySelectorAll('.tasks-table-column');
    columns.forEach((column) => {
      const title = column.querySelector('.tasks-table-column-title').textContent.trim();
      const cards = Array.from(column.querySelectorAll('.card')).map((card) => {
        const contentElement = card.querySelector('.card-content');
        return {
          title: contentElement ? contentElement.textContent.trim() : '',
        };
      });

      state.push({ title, cards });
    });

    return state;
  }

  tableButtonsOnclick(e) {
    const button = e.currentTarget;
    const column = button.closest('.tasks-table-column');
    const addCardWrapper = column.querySelector('.tasks-table-column-add-card-wrapper');

    addCardWrapper.classList.add('visiable');
    button.classList.add('unvisiable');
  }

  addCardButtonOnClick(e) {
    const addCardButton = e.target;
    const addCardWrapper = addCardButton.closest('.tasks-table-column-add-card-wrapper');
    const textarea = addCardWrapper.querySelector('.tasks-table-column-textarea');
    const column = addCardButton.closest('.tasks-table-column');

    if (textarea.value) {
      this.addCard(column, textarea.value);
      addCardWrapper.classList.remove('visiable');
      column.querySelector('.tasks-table-column-add-card-button').classList.remove('unvisiable');
      textarea.value = '';
    }
  }

  addCard(column, value) {
    const card = { title: value };

    const columnIndex = Array.from(column.parentElement.children).indexOf(column);
    this.state[columnIndex].cards.push(card);

    this.saveState();

    const cardElement = this.createCardElement(card);
    const cardsContainer = column.querySelector('.tasks-table-column-cards');
    cardsContainer.appendChild(cardElement);
  }

  createCardElement(card) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');

    const contentElement = document.createElement('div');
    contentElement.classList.add('card-content');
    contentElement.textContent = card.title;

    const closeButton = document.createElement('button');
    closeButton.classList.add('card-close-button', 'close-button');
    closeButton.innerHTML = '&#10005;';

    closeButton.addEventListener('click', () => {
      this.removeCard(cardElement, card);
    });

    cardElement.appendChild(contentElement);
    cardElement.appendChild(closeButton);

    return cardElement;
  }

  removeCard(cardElement, card) {
    const column = cardElement.closest('.tasks-table-column');
    const columnIndex = Array.from(column.parentElement.children).indexOf(column);

    const cardIndex = this.state[columnIndex].cards.findIndex(
      (storedCard) => storedCard.title === card.title,
    );

    if (cardIndex !== -1) {
      this.state[columnIndex].cards.splice(cardIndex, 1);
    }

    cardElement.remove();
    this.saveState();
  }
}
