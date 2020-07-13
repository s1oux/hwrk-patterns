export const createElement = ({ tagName, className, attributes = {} }) => {
  const element = document.createElement(tagName);

  if (className) {
    addClass(element, className);
  }

  Object.keys(attributes).forEach(key => element.setAttribute(key, attributes[key]));

  return element;
};

export const getElement = (id) => {
  return document.getElementById(id);
}

export const showElement = (element) => {
  removeClass(element, "display-none");
}

export const hideElement = (element) => {
  addClass(element, "display-none");
};

export const addClass = (element, className) => {
  const classNames = formatClassNames(className);
  element.classList.add(...classNames);
};

export const removeClass = (element, className) => {
  const classNames = formatClassNames(className);
  element.classList.remove(...classNames);
};

export const formatClassNames = className => className.split(" ").filter(Boolean);


export const createParagraphElement = (text, id = '') => {
  let attributes = {};
  if(id) {
    attributes.id = id;
  }
  const paragraph = createElement({
    tagName: 'p',
    attributes
  });

  paragraph.append(text);
  return paragraph;
};

export const clearContainer = node => {
  while (node.lastElementChild) {
    node.removeChild(node.lastElementChild);
  }
  return node;
};

export const createModal = ({ title, bodyElement, onClose }) => {
  const layer = createElement({ tagName: 'div', className: 'modal-layer' });
  const modalContainer = createElement({ tagName: 'div', className: 'modal-root' });
  const header = createHeader(title, onClose);
  const bodyContent = createElement({ tagName: 'div', className: 'modal-body' });

  bodyContent.append(bodyElement);
  modalContainer.append(header, bodyContent);
  layer.append(modalContainer);

  return layer;
}

const createHeader = (title, onClose) => {
  const headerElement = createElement({ tagName: 'div', className: 'modal-header' });
  const titleElement = createElement({ tagName: 'span' });
  const closeButton = createElement({ tagName: 'div', className: 'close-btn' });

  titleElement.innerText = title;
  closeButton.innerText = '×';

  const close = () => {
    hideModal();
    onClose();
  };
  closeButton.addEventListener('click', close);
  headerElement.append(title, closeButton);

  return headerElement;
}

const hideModal = () => {
  const modal = document.getElementsByClassName('modal-layer')[0];
  modal?.remove();
}