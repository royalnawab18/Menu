/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChefHat, 
  Search, 
  ShoppingCart, 
  RotateCcw, 
  UtensilsCrossed, 
  Coffee, 
  Wine, 
  Filter,
  X,
  Plus,
  Minus,
  Star,
  Info
} from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  tags: string[];
  isChefSpecial?: boolean;
}

const MENU_DATA: MenuItem[] = [
  {
    id: '1',
    name: "Truffle Mushroom Arancini",
    description: "Crispy risotto balls infused with black truffle oil, served with garlic aioli.",
    price: 18.50,
    category: "Starters",
    image: "https://picsum.photos/seed/arancini/600/400",
    tags: ["Vegetarian", "Nuts Free"],
    isChefSpecial: true
  },
  {
    id: '2',
    name: "Burrata & Heirloom Tomato",
    description: "Creamy burrata cheese with organic heirloom tomatoes, balsamic glaze, and fresh basil.",
    price: 22.00,
    category: "Starters",
    image: "https://picsum.photos/seed/burrata/600/400",
    tags: ["Vegetarian", "Gluten Free"]
  },
  {
    id: '3',
    name: "Pan-Seared Sea Bass",
    description: "Line-caught sea bass with saffron risotto, charred asparagus, and lemon butter sauce.",
    price: 42.00,
    category: "Main Course",
    image: "https://picsum.photos/seed/seabass/600/400",
    tags: ["Gluten Free", "Seafood"]
  },
  {
    id: '4',
    name: "Wagyu Beef Ribeye",
    description: "Grade A5 Wagyu beef from Miyazaki, served with truffle mash and bordelaise sauce.",
    price: 85.00,
    category: "Main Course",
    image: "https://picsum.photos/seed/wagyu/600/400",
    tags: ["Premium", "Chef's Choice"],
    isChefSpecial: true
  },
  {
    id: '5',
    name: "Saffron Scented Pappardelle",
    description: "Hand-rolled pasta with wild mushroom ragout and parmigiano reggiano.",
    price: 32.00,
    category: "Main Course",
    image: "https://picsum.photos/seed/pasta/600/400",
    tags: ["Vegetarian"]
  },
  {
    id: '6',
    name: "Golden Chocolate Sphere",
    description: "Dark chocolate shell filled with hazelnut mousse, gold leaf, and warm caramel sauce.",
    price: 16.00,
    category: "Desserts",
    image: "https://picsum.photos/seed/dessert/600/400",
    tags: ["Signature"],
    isChefSpecial: true
  },
  {
    id: '7',
    name: "Tahitian Vanilla Panna Cotta",
    description: "Creamy vanilla bean custard with wild berry coulis and fresh mint.",
    price: 14.00,
    category: "Desserts",
    image: "https://picsum.photos/seed/pannacotta/600/400",
    tags: ["Gluten Free"]
  },
  {
    id: '8',
    name: "Midnight Martini",
    description: "Espresso, premium vodka, and house-made vanilla liqueur.",
    price: 18.00,
    category: "Drinks",
    image: "https://picsum.photos/seed/martini/600/400",
    tags: ["Alcoholic"]
  },
  {
    id: '9',
    name: "Imperial Oolong Tea",
    description: "Rare high-altitude oolong tea from Taiwan with notes of honey and stone fruit.",
    price: 12.00,
    category: "Drinks",
    image: "https://picsum.photos/seed/tea/600/400",
    tags: ["Premium"]
  }
];

const CATEGORIES = ["All", "Starters", "Main Course", "Desserts", "Drinks"];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<{ [id: string]: number }>({});
  const [showCart, setShowCart] = useState(false);

  const filteredMenu = useMemo(() => {
    return MENU_DATA.filter(item => {
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const addToCart = (id: string) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[id] > 1) {
        newCart[id] -= 1;
      } else {
        delete newCart[id];
      }
      return newCart;
    });
  };

  const cartItemsCount = Object.values(cart).reduce((a, b) => (a as number) + (b as number), 0) as number;
  const cartTotal = Object.entries(cart).reduce((total, [id, qty]) => {
    const item = MENU_DATA.find(i => i.id === id);
    return total + (item?.price || 0) * (qty as number);
  }, 0);

  return (
    <div className="min-h-screen pb-20 scroll-smooth bg-[var(--color-page-bg)] selection:bg-[var(--color-accent)] selection:text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[var(--color-canvas-bg)] border-b border-[var(--color-line-light)] px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 border border-[var(--color-accent)] flex items-center justify-center group">
            <ChefHat className="text-[var(--color-accent)] group-hover:scale-110 transition-transform w-5 h-5" />
          </div>
          <div className="ml-2">
            <h1 className="text-xl font-serif tracking-[0.2em] leading-tight uppercase font-light">Lumière</h1>
            <p className="text-[9px] text-[var(--color-subtle)] uppercase tracking-[0.3em] -mt-1 font-bold">Resort & Spa</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-subtle)]" />
            <input 
              type="text" 
              placeholder="Search the collection..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-1.5 bg-[var(--color-page-bg)] border border-transparent rounded-sm text-sm focus:border-[var(--color-accent)] outline-none w-64 transition-all placeholder:text-[var(--color-subtle)]"
            />
          </div>
          <button 
            onClick={() => setShowCart(true)}
            className="relative p-2 hover:bg-[var(--color-badge-bg)] rounded-sm transition-colors"
          >
            <ShoppingCart className="w-6 h-6 text-[var(--color-ink)]" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[var(--color-accent)] text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-sm font-bold">
                {cartItemsCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Main Container ("Menu Canvas") */}
      <div className="max-w-6xl mx-auto mt-12 mb-20 relative bg-[var(--color-canvas-bg)] p-8 md:p-16 border border-[var(--color-line)] shadow-xl overflow-hidden">
        {/* Decorative corner accents */}
        <div className="absolute top-8 right-8 w-12 h-12 border-t border-r border-[var(--color-accent)] pointer-events-none" />
        <div className="absolute bottom-8 left-8 w-12 h-12 border-b border-l border-[var(--color-accent)] pointer-events-none" />

        {/* Hero Header */}
        <header className="text-center mb-16 pb-8 border-b border-[var(--color-line-light)]">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 text-[var(--color-accent)] text-[10px] font-bold uppercase tracking-[0.4em] mb-4"
          >
            <UtensilsCrossed className="w-3 h-3" />
            <span>Seasonal Culinary Selection</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif text-[var(--color-accent)] leading-tight uppercase tracking-[0.1em] font-light"
          >
            Lumière Grand
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[var(--color-subtle)] font-serif italic text-sm md:text-base mt-2 tracking-wide"
          >
            Kitchen & Botanical Garden &mdash; Harvest Collection
          </motion.p>
        </header>

        {/* Filter Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1 text-[10px] font-bold tracking-[0.2em] uppercase transition-all border-b-2 ${
                selectedCategory === cat 
                ? "border-[var(--color-accent)] text-[var(--color-accent)]" 
                : "border-transparent text-[var(--color-subtle)] hover:text-[var(--color-accent)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Main Grid */}
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12">
          <AnimatePresence mode="popLayout">
            {filteredMenu.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="group relative"
              >
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-[15px] font-serif font-bold tracking-wide uppercase flex items-center gap-2">
                    {item.name}
                    {item.isChefSpecial && (
                      <span className="bg-[var(--color-badge-bg)] text-[var(--color-accent)] px-1.5 py-0.5 rounded text-[8px] font-bold">SPECIAL</span>
                    )}
                  </h3>
                  <div className="flex-grow border-b border-dotted border-[var(--color-line)] mx-3" />
                  <span className="text-[15px] font-serif text-[var(--color-accent)] font-semibold">
                    ${item.price.toFixed(0)}
                  </span>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <p className="text-[var(--color-desc)] text-[13px] leading-relaxed font-normal italic mb-3">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-2 text-[8px] font-bold uppercase tracking-wider text-[var(--color-subtle)]">
                      {item.tags.map(tag => (
                        <span key={tag} className="border border-[var(--color-line-light)] px-1.5 py-0.5">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="relative w-20 h-20 flex-shrink-0 group">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all border border-[var(--color-line-light)]"
                      referrerPolicy="no-referrer"
                    />
                    <button 
                      onClick={() => addToCart(item.id)}
                      className="absolute inset-0 bg-[var(--color-accent)]/80 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </main>

        {filteredMenu.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <h3 className="text-lg font-serif italic text-[var(--color-subtle)]">No selections found for your request...</h3>
            <button 
              onClick={() => {setSelectedCategory("All"); setSearchQuery("");}}
              className="text-[var(--color-accent)] text-[10px] font-bold uppercase tracking-widest border-b border-[var(--color-accent)]"
            >
              Return to main menu
            </button>
          </div>
        )}

        {/* Footer Note */}
        <footer className="mt-20 pt-10 border-t border-[var(--color-line-light)] text-center">
          <p className="text-[10px] text-[var(--color-subtle)] uppercase tracking-[0.3em] font-medium py-4">
            &bull; Executive Chef Julian Mercer &bull; {new Date().getFullYear()} Seasonal Collection &bull;
          </p>
        </footer>
      </div>

      {/* Cart Sidebar (Drawer) */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCart(false)}
              className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-[100]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-sm bg-[var(--color-canvas-bg)] shadow-2xl z-[101] flex flex-col border-l border-[var(--color-line)]"
            >
              <div className="p-8 border-b border-[var(--color-line-light)] flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-serif uppercase tracking-widest font-light">Your Order</h3>
                  <p className="text-[9px] text-[var(--color-subtle)] uppercase tracking-widest font-bold mt-1">Lumière Dining Selection</p>
                </div>
                <button onClick={() => setShowCart(false)} className="p-2 hover:bg-[var(--color-page-bg)] transition-colors">
                  <X className="w-5 h-5 text-[var(--color-ink)]" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {cartItemsCount === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-20">
                    <UtensilsCrossed className="w-12 h-12 text-[var(--color-ink)]" />
                    <p className="font-serif italic text-sm">Awaiting your menu selection...</p>
                  </div>
                ) : (
                  Object.entries(cart).map(([id, qty]) => {
                    const item = MENU_DATA.find(i => i.id === id);
                    if (!item) return null;
                    const quantity = qty as number;
                    return (
                      <div key={id} className="group">
                        <div className="flex justify-between items-baseline mb-2">
                          <h4 className="font-serif font-bold text-sm uppercase tracking-wide">{item.name}</h4>
                          <span className="text-[var(--color-accent)] font-serif italic text-sm">${(item.price * quantity).toFixed(0)}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-3">
                            <button onClick={() => removeFromCart(id)} className="w-5 h-5 border border-[var(--color-line)] flex items-center justify-center hover:bg-[var(--color-page-bg)]">
                              <Minus className="w-3 h-3 text-[var(--color-accent)]" />
                            </button>
                            <span className="text-[11px] font-bold w-4 text-center">{quantity}</span>
                            <button onClick={() => addToCart(id)} className="w-5 h-5 border border-[var(--color-line)] flex items-center justify-center hover:bg-[var(--color-page-bg)]">
                              <Plus className="w-3 h-3 text-[var(--color-accent)]" />
                            </button>
                          </div>
                          <span className="text-[10px] text-[var(--color-desc)] uppercase tracking-widest">{item.category}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {cartItemsCount > 0 && (
                <div className="p-8 bg-[var(--color-page-bg)] border-t border-[var(--color-line)] space-y-6">
                  <div className="space-y-3 font-serif">
                    <div className="flex justify-between text-[var(--color-desc)] text-sm">
                      <span>Selection Subtotal</span>
                      <span>${cartTotal.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t border-[var(--color-line)] pt-3 text-[var(--color-accent)]">
                      <span className="uppercase tracking-widest text-sm">Grand Total</span>
                      <span>${cartTotal.toFixed(0)}</span>
                    </div>
                  </div>
                  <button className="w-full bg-[var(--color-accent)] text-white py-4 rounded-sm font-bold uppercase tracking-[0.3em] text-[10px] shadow-lg hover:brightness-110 active:scale-[0.98] transition-all">
                    Finalize Order
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
