'use strict';

const toggleMenu = ({currentTarget}) => {
  const menuElement = currentTarget.closest('.main-navigation').querySelector('.main-navigation__list');
  menuElement.classList.toggle('main-navigation__list--closed');
};

const contentLoadedHandler = () => {
  const mainMenu = document.querySelector('.main-navigation__list');
  mainMenu.classList.add('main-navigation__list--closed');

  const mainMenuToggleButton = document.querySelector('.main-navigation__toggle-button');
  mainMenuToggleButton.addEventListener('click', toggleMenu);
};

document.addEventListener('DOMContentLoaded', contentLoadedHandler);
