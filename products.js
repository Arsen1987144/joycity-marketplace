/*
 * Product catalog for the JoyCity marketplace.
 *
 * This file exports a global variable `products` containing an array of
 * product objects. Each product has an id, name, category, price, imageUrl
 * and description. Feel free to extend or replace this data as you add
 * more items to your marketplace. The placeholder images come from
 * via.placeholder.com and can be swapped out for real product photos later.
 */

const products = [
  {
    id: 1,
    name: "Летнее платье",
    category: "Женщинам",
    price: 49.99,
    // Use a locally hosted photo of a red summer dress generated for JoyCity.
    imageUrl: "dress1.png",
    description: "Стильное летнее платье для женщин, изготовленное из лёгкой ткани. Подходит для прогулок и отдыха.",
  },
  {
    id: 2,
    name: "Кроссовки беговые",
    category: "Обувь",
    price: 69.99,
    // Use a locally hosted photo of neutral running shoes with no branding.
    imageUrl: "shoes1.png",
    description: "Удобные беговые кроссовки с амортизацией и дышащим верхом. Идеальны для занятий спортом.",
  },
  {
    id: 3,
    name: "Детский конструктор",
    category: "Детям",
    price: 29.99,
    imageUrl: "https://via.placeholder.com/300x300.png?text=Конструктор",
    description: "Развивающий набор конструктора для детей. Содержит яркие блоки для создания различных моделей.",
  },
  {
    id: 4,
    name: "Мужская рубашка",
    category: "Мужчинам",
    price: 39.99,
    imageUrl: "https://via.placeholder.com/300x300.png?text=Рубашка",
    description: "Классическая мужская рубашка с длинным рукавом из хлопка. Подходит для офиса и повседневной носки.",
  },
  {
    id: 5,
    name: "Смартфон X200",
    category: "Электроника",
    price: 499.99,
    // Use a locally hosted photo of a generic smartphone with gradient screen.
    imageUrl: "phone1.png",
    description: "Современный смартфон с большим экраном, мощным процессором и камерой высокого разрешения.",
  },
  {
    id: 6,
    name: "Набор косметики",
    category: "Красота",
    price: 24.99,
    imageUrl: "https://via.placeholder.com/300x300.png?text=Косметика",
    description: "Набор декоративной косметики, включающий помаду, тушь и тену. Подходит для создания повседневного макияжа.",
  },
  {
    id: 7,
    name: "Фитнес браслет",
    category: "Спорт",
    price: 59.99,
    imageUrl: "https://via.placeholder.com/300x300.png?text=Фитнес+браслет",
    description: "Умный фитнес-браслет для отслеживания физической активности, сна и сердечного ритма.",
  },
  {
    id: 8,
    name: "Кофеварка",
    category: "Дом",
    price: 79.99,
    imageUrl: "https://via.placeholder.com/300x300.png?text=Кофеварка",
    description: "Компактная кофеварка для приготовления ароматного эспрессо дома. Лёгкая в управлении.",
  },
  {
    id: 9,
    name: "Игрушечный робот",
    category: "Игрушки",
    price: 34.99,
    imageUrl: "https://via.placeholder.com/300x300.png?text=Робот",
    description: "Интерактивная игрушка-робот для детей с функциями танцев и звуковых эффектов.",
  },
  {
    id: 10,
    name: "Блендер кухонный",
    category: "Бытовая техника",
    price: 89.99,
    imageUrl: "https://via.placeholder.com/300x300.png?text=Блендер",
    description: "Многофункциональный блендер для приготовления коктейлей, супов-пюре и смузи. Имеет несколько режимов.",
  },
  {
    id: 11,
    name: "Книга 'Путешествие во времени'",
    category: "Книги",
    price: 14.99,
    imageUrl: "https://via.placeholder.com/300x300.png?text=Книга",
    description: "Захватывающий фантастический роман о путешествиях во времени и загадках прошлого.",
  },
  {
    id: 12,
    name: "Набор инструментов",
    category: "Для ремонта",
    price: 54.99,
    imageUrl: "https://via.placeholder.com/300x300.png?text=Инструменты",
    description: "Профессиональный набор инструментов в кейсе: отвертки, ключи, плоскогубцы и многое другое.",
  },
];

// Expose the products to the global scope so that other scripts can access them.
window.products = products;