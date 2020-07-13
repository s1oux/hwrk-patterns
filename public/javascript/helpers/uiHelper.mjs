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
