
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    const container = document.querySelector('.card-container');
  
    let draggedCard = null;
  
    // Add drag-and-drop functionality
    cards.forEach((card) => {
      card.setAttribute('draggable', true);
  
      card.addEventListener('dragstart', () => {
        draggedCard = card;
        card.classList.add('dragging');
      });
  
      card.addEventListener('dragend', () => {
        draggedCard = null;
        card.classList.remove('dragging');
        reorderCards(); // Reorder cards when dragging ends
      });
    });
  
    // Allow drag-and-drop within the container
    container.addEventListener('dragover', (e) => {
      e.preventDefault();
      const afterElement = getDragAfterElement(container, e.clientY);
      if (afterElement == null) {
        container.appendChild(draggedCard);
      } else {
        container.insertBefore(draggedCard, afterElement);
      }
    });
  
    // Reorder cards after drag-and-drop
    const reorderCards = () => {
      const cardsArray = Array.from(container.children);
      const centerCard = findCenterCard();
  
      // Rearrange cards based on the center card
      const centerIndex = cardsArray.indexOf(centerCard);
      const reorderedCards = [
        ...cardsArray.slice(centerIndex),
        ...cardsArray.slice(0, centerIndex),
      ];
  
      // Clear the container and append reordered cards
      container.innerHTML = '';
      reorderedCards.forEach((card) => container.appendChild(card));
  
      updateCenterCard(); // Update the center card's appearance
    };
  
    // Find the card closest to the center
    const findCenterCard = () => {
      const containerRect = container.getBoundingClientRect();
      const containerCenterY = containerRect.top + containerRect.height / 2;
  
      let closestCard = null;
      let closestDistance = Infinity;
  
      Array.from(container.children).forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenterY = cardRect.top + cardRect.height / 2;
        const distance = Math.abs(cardCenterY - containerCenterY);
  
        if (distance < closestDistance) {
          closestCard = card;
          closestDistance = distance;
        }
      });
  
      return closestCard;
    };
  
    // Update the appearance of the center card
    const updateCenterCard = () => {
      const cardsArray = Array.from(container.children);
      const centerCard = findCenterCard();
  
      cardsArray.forEach((card) => card.classList.remove('center'));
      if (centerCard) {
        centerCard.classList.add('center');
      }
    };
  
    // Get the element after which the dragged card should be placed
    const getDragAfterElement = (container, y) => {
      const draggableElements = [...container.querySelectorAll('.card:not(.dragging)')];
  
      return draggableElements.reduce(
        (closest, child) => {
          const box = child.getBoundingClientRect();
          const offset = y - box.top - box.height / 2;
          if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
          } else {
            return closest;
          }
        },
        { offset: Number.NEGATIVE_INFINITY }
      ).element;
    };
  
    // Initial update to set the center card
    updateCenterCard();
  });
  