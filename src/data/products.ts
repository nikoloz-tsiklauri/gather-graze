export interface Product {
  id: string;
  name: Record<string, string>;
  description: Record<string, string>;
  category: string;
  tags: string[];
  price: number;
  unit: 'piece' | 'tray' | 'person' | 'liter' | 'kg';
  popular?: boolean;
  gradient: string;
}

export const categories = [
  { id: 'all', icon: '🍽️' },
  { id: 'canapes', icon: '🥪' },
  { id: 'salads', icon: '🥗' },
  { id: 'hot', icon: '🍖' },
  { id: 'desserts', icon: '🍰' },
  { id: 'drinks', icon: '🥂' },
];

export const products: Product[] = [
  {
    id: 'canape-salmon',
    name: { ka: 'ორაგულის კანაპე', en: 'Salmon Canapé', ru: 'Канапе с лососем' },
    description: { ka: 'ნაზი ორაგული კრემ-ყველით ბრიოშის პურზე', en: 'Delicate salmon with cream cheese on brioche', ru: 'Нежный лосось со сливочным сыром на бриоши' },
    category: 'canapes', tags: ['popular'], price: 3.5, unit: 'piece', popular: true,
    gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
  },
  {
    id: 'canape-prosciutto',
    name: { ka: 'პროშუტო და ნესვი', en: 'Prosciutto & Melon', ru: 'Прошутто с дыней' },
    description: { ka: 'იტალიური პროშუტო ტკბილ ნესვთან ერთად', en: 'Italian prosciutto with sweet melon', ru: 'Итальянское прошутто со сладкой дыней' },
    category: 'canapes', tags: ['glutenFree'], price: 4, unit: 'piece',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    id: 'canape-caprese',
    name: { ka: 'კაპრეზე სამარსზე', en: 'Caprese Skewers', ru: 'Капрезе на шпажках' },
    description: { ka: 'მოცარელა, პომიდორი, ბაზილიკი ბალზამიკის სოუსით', en: 'Mozzarella, tomato, basil with balsamic glaze', ru: 'Моцарелла, томат, базилик с бальзамиком' },
    category: 'canapes', tags: ['vegan', 'glutenFree'], price: 3, unit: 'piece',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  },
  {
    id: 'canape-mushroom',
    name: { ka: 'სოკოს ტარტალეტი', en: 'Mushroom Tartlet', ru: 'Тарталетка с грибами' },
    description: { ka: 'კრემისებრი სოკოს ტარტალეტი თაიმით', en: 'Creamy mushroom tartlet with thyme', ru: 'Сливочная тарталетка с грибами и тимьяном' },
    category: 'canapes', tags: ['vegan', 'new'], price: 3.5, unit: 'piece',
    gradient: 'linear-gradient(135deg, #d4a574 0%, #a0845c 100%)',
  },
  {
    id: 'salad-caesar',
    name: { ka: 'ცეზარის სალათი', en: 'Caesar Salad', ru: 'Салат Цезарь' },
    description: { ka: 'კლასიკური ცეზარი ქათმით, პარმეზანით და კრუტონებით', en: 'Classic Caesar with chicken, parmesan, and croutons', ru: 'Классический Цезарь с курицей, пармезаном и крутонами' },
    category: 'salads', tags: ['popular'], price: 25, unit: 'tray', popular: true,
    gradient: 'linear-gradient(135deg, #96e6a1 0%, #d4fc79 100%)',
  },
  {
    id: 'salad-greek',
    name: { ka: 'ბერძნული სალათი', en: 'Greek Salad', ru: 'Греческий салат' },
    description: { ka: 'ახალი ბოსტნეული ფეტა ყველით და ზეითუნით', en: 'Fresh vegetables with feta cheese and olives', ru: 'Свежие овощи с фетой и оливками' },
    category: 'salads', tags: ['vegan', 'glutenFree'], price: 22, unit: 'tray',
    gradient: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
  },
  {
    id: 'salad-seasonal',
    name: { ka: 'სეზონური სალათი', en: 'Seasonal Salad', ru: 'Сезонный салат' },
    description: { ka: 'სეზონური ბოსტნეული სპეციალური სოუსით', en: 'Seasonal vegetables with special dressing', ru: 'Сезонные овощи со специальной заправкой' },
    category: 'salads', tags: ['vegan', 'new'], price: 20, unit: 'tray',
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  },
  {
    id: 'hot-chicken',
    name: { ka: 'შემწვარი ქათამი', en: 'Grilled Chicken', ru: 'Курица гриль' },
    description: { ka: 'სანელებლებით შემწვარი ქათმის ფილე', en: 'Herb-grilled chicken fillet', ru: 'Филе курицы на гриле с травами' },
    category: 'hot', tags: ['popular', 'glutenFree'], price: 35, unit: 'tray', popular: true,
    gradient: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
  },
  {
    id: 'hot-beef',
    name: { ka: 'ხბოს მედალიონები', en: 'Beef Medallions', ru: 'Медальоны из говядины' },
    description: { ka: 'ნაზი ხბოს მედალიონები სოუსთან ერთად', en: 'Tender beef medallions with sauce', ru: 'Нежные медальоны из говядины с соусом' },
    category: 'hot', tags: ['popular'], price: 45, unit: 'tray',
    gradient: 'linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)',
  },
  {
    id: 'hot-veggie',
    name: { ka: 'ბოსტნეულის რაგუ', en: 'Vegetable Stir-Fry', ru: 'Овощное рагу' },
    description: { ka: 'სეზონური ბოსტნეული აზიურ სოუსში', en: 'Seasonal vegetables in Asian sauce', ru: 'Сезонные овощи в азиатском соусе' },
    category: 'hot', tags: ['vegan', 'spicy'], price: 28, unit: 'tray',
    gradient: 'linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)',
  },
  {
    id: 'hot-salmon',
    name: { ka: 'გამომცხვარი ორაგული', en: 'Baked Salmon', ru: 'Запечённый лосось' },
    description: { ka: 'ორაგული ლიმონისა და ბალახეულის ქერქით', en: 'Salmon with lemon and herb crust', ru: 'Лосось с лимонной и травяной корочкой' },
    category: 'hot', tags: ['glutenFree', 'new'], price: 40, unit: 'tray',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  },
  {
    id: 'dessert-fruit',
    name: { ka: 'ხილის ასორტი', en: 'Fruit Platter', ru: 'Фруктовая тарелка' },
    description: { ka: 'სეზონური ხილის ლამაზი კომპოზიცია', en: 'Beautiful arrangement of seasonal fruits', ru: 'Красивая композиция из сезонных фруктов' },
    category: 'desserts', tags: ['vegan', 'glutenFree', 'popular'], price: 30, unit: 'tray', popular: true,
    gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
  },
  {
    id: 'dessert-pastries',
    name: { ka: 'მინი ნამცხვრები', en: 'Mini Pastries', ru: 'Мини пирожные' },
    description: { ka: 'ასორტი მინი ტორტები და ნამცხვრები', en: 'Assorted mini cakes and pastries', ru: 'Ассорти мини тортов и пирожных' },
    category: 'desserts', tags: ['popular'], price: 2.5, unit: 'piece',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    id: 'dessert-mousse',
    name: { ka: 'შოკოლადის მუსი', en: 'Chocolate Mousse', ru: 'Шоколадный мусс' },
    description: { ka: 'ბელგიური შოკოლადის ნაზი მუსი', en: 'Silky Belgian chocolate mousse', ru: 'Нежный мусс из бельгийского шоколада' },
    category: 'desserts', tags: ['glutenFree'], price: 4, unit: 'piece',
    gradient: 'linear-gradient(135deg, #3c1053 0%, #ad5389 100%)',
  },
  {
    id: 'drink-lemonade',
    name: { ka: 'ლიმონათი', en: 'Fresh Lemonade', ru: 'Лимонад' },
    description: { ka: 'ახლად მომზადებული ლიმონათი პიტნით', en: 'Freshly made lemonade with mint', ru: 'Свежий лимонад с мятой' },
    category: 'drinks', tags: ['vegan'], price: 8, unit: 'liter',
    gradient: 'linear-gradient(135deg, #f6d365 0%, #96e6a1 100%)',
  },
  {
    id: 'drink-wine',
    name: { ka: 'ქართული ღვინო', en: 'Georgian Wine', ru: 'Грузинское вино' },
    description: { ka: 'სელექცია ქართული წითელი ღვინო', en: 'Selection of Georgian red wine', ru: 'Подборка грузинского красного вина' },
    category: 'drinks', tags: ['popular'], price: 35, unit: 'liter', popular: true,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    id: 'drink-water',
    name: { ka: 'მინერალური წყალი', en: 'Sparkling Water', ru: 'Минеральная вода' },
    description: { ka: 'ნაბეღლავი ან ბორჯომი', en: 'Nabeghlavi or Borjomi', ru: 'Набеглави или Боржоми' },
    category: 'drinks', tags: [], price: 5, unit: 'liter',
    gradient: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
  },
];
