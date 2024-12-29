export default class Card {
  constructor(tasksTable) {
    this.tasksTable = tasksTable;
    this.columns = document.querySelectorAll('.tasks-table-column');
    this.draggedCard = null;

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);

    this.columns.forEach((column) => {
      column.addEventListener('mousedown', this.onMouseDown);
    });

    document.documentElement.addEventListener('mouseup', this.onMouseUp);
  }

  createPlaceholder(card) {
    const placeholder = document.createElement('div');
    placeholder.classList.add('placeholder');

    const rect = card.getBoundingClientRect();
    placeholder.style.height = `${rect.height}px`;
    placeholder.style.width = `${rect.width}px`;

    return placeholder;
  }

  onMouseDown(e) {
    if (e.target.classList.contains('card-close-button')) {
      return;
    }

    const card = e.target.closest('.card');
    if (card) {
      e.preventDefault();
      this.draggedCard = card;
      this.draggedCard.classList.add('dragged');

      const rect = this.draggedCard.getBoundingClientRect();
      this.offsetX = e.clientX - rect.left;
      this.offsetY = e.clientY - rect.top;

      this.placeholder = this.createPlaceholder(this.draggedCard);

      document.documentElement.addEventListener('mousemove', this.onMouseMove);
    }
  }

  onMouseMove(e) {
    if (this.draggedCard) {
      this.draggedCard.style.top = `${e.clientY - this.offsetY}px`;
      this.draggedCard.style.left = `${e.clientX - this.offsetX}px`;

      const elementUnderMouse = document.elementFromPoint(e.clientX, e.clientY);

      if (elementUnderMouse) {
        const closestColumn = elementUnderMouse.closest('.tasks-table-column');

        if (closestColumn) {
          const cardsContainer = closestColumn.querySelector('.tasks-table-column-cards');

          if (cardsContainer) {
            const closestCard = elementUnderMouse.closest('.card');

            if (closestCard && closestCard !== this.draggedCard && closestCard
              !== this.placeholder) {
              const parent = closestCard.parentNode;
              const rect = closestCard.getBoundingClientRect();

              if (e.clientY < rect.top + rect.height / 2) {
                parent.insertBefore(this.placeholder, closestCard);
              } else {
                parent.insertBefore(this.placeholder, closestCard.nextSibling);
              }
            } else if (!closestCard) {
              cardsContainer.appendChild(this.placeholder);
            }
          }
        }
      }
    }
  }

  onMouseUp() {
    if (this.draggedCard) {
      if (this.placeholder && this.placeholder.parentNode) {
        this.placeholder.parentNode.insertBefore(this.draggedCard, this.placeholder);
      }

      this.placeholder.remove();
      this.placeholder = null;

      this.draggedCard.classList.remove('dragged');
      this.draggedCard.style.top = '';
      this.draggedCard.style.left = '';
      this.draggedCard = null;

      document.documentElement.removeEventListener('mousemove', this.onMouseMove);

      const newState = this.tasksTable.getStateFromDOM();
      this.tasksTable.state = newState;
      this.tasksTable.saveState();
    }
  }
}
