export default class CloseButton {
  constructor() {
    this.closeButtons = document.querySelectorAll('.close-button');
    this.closeButtonOnClick = this.closeButtonOnClick.bind(this);

    this.closeButtons.forEach((button) => {
      button.addEventListener('click', this.closeButtonOnClick);
    });
  }

  closeButtonOnClick(e) {
    const closeButton = e.target;

    if (closeButton.classList.contains('tasks-table-column-close-button')) {
      closeButton.parentElement.classList.remove('visiable');
      const column = closeButton.closest('.tasks-table-column');
      const addCardButton = column.querySelector('.tasks-table-column-add-card-button');

      this.showAddCardButton(addCardButton);
    } else if (closeButton.classList.contains('card-close-button')) {
      const currentCard = closeButton.closest('.card');
      currentCard.remove();
    }
  }

  showAddCardButton(button) {
    button.classList.remove('unvisiable');
  }
}
