import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Menu, Facebook, Instagram, Twitter, Youtube, ArrowLeft, Plus, Minus, Trash2, X, Heart, ClipboardList, LogIn, LogOut, Settings, Download, ChevronLeft, ChevronRight } from 'lucide-react';

// --- MOCK DATA (Initial Data) ---
const mockProductsInitial = [
    {
        id: 1,
        name: 'Urban Jacket',
        category: "Men's Outerwear",
        price: 129.00,
        stock: 10, // Added stock
        isOnSale: true, // Added for sale carousel
        imageUrls: [
            'https://placehold.co/600x750/d4a373/fefae0?text=Urban+Jacket+1',
            'https://placehold.co/600x750/d4a373/fefae0?text=Urban+Jacket+2',
            'https://placehold.co/600x750/d4a373/fefae0?text=Urban+Jacket+3'
        ],
        description: 'A stylish and durable jacket perfect for urban exploration. Made with water-resistant fabric.'
    },
    {
        id: 2,
        name: 'Flowy Summer Dress',
        category: "Women's Dresses",
        price: 89.00,
        stock: 3, // Low stock
        isOnSale: false, // Not on sale
        imageUrls: [
            'https://placehold.co/600x750/e9c46a/2a9d8f?text=Flowy+Dress+1',
            'https://placehold.co/600x750/e9c46a/2a9d8f?text=Flowy+Dress+2',
            'https://placehold.co/600x750/e9c46a/2a9d8f?text=Flowy+Dress+3'
        ],
        description: 'Light and airy, this dress is perfect for warm summer days. Features a beautiful floral pattern.'
    },
    {
        id: 3,
        name: 'Leather Backpack',
        category: 'Accessories',
        price: 159.00,
        stock: 0, // Out of stock
        isOnSale: true, // On sale even if out of stock, for demonstration of warning
        imageUrls: [
            'https://placehold.co/600x750/2a9d8f/e9c46a?text=Leather+Backpack+1',
            'https://placehold.co/600x750/2a9d8f/e9c46a?text=Leather+Backpack+2',
            'https://placehold.co/600x750/2a9d8f/e9c46a?text=Leather+Backpack+3'
        ],
        description: 'A handcrafted leather backpack with multiple compartments, combining style and functionality.'
    },
    {
        id: 4,
        name: 'The Classic Tee',
        category: 'Unisex',
        price: 39.00,
        stock: 7, // In stock
        isOnSale: true, // On sale
        imageUrls: [
            'https://placehold.co/600x750/f4a261/264653?text=Classic+Tee+1',
            'https://placehold.co/600x750/f4a261/264653?text=Classic+Tee+2',
            'https://placehold.co/600x750/f4a261/264653?text=Classic+Tee+3'
        ],
        description: 'Made from 100% premium cotton, this t-shirt offers unparalleled comfort and a timeless look.'
    },
    {
        id: 5,
        name: 'Cozy Knit Sweater',
        category: "Women's Knitwear",
        price: 75.00,
        stock: 5,
        isOnSale: true,
        imageUrls: [
            'https://placehold.co/600x750/b4a373/fefae0?text=Sweater+1',
            'https://placehold.co/600x750/b4a373/fefae0?text=Sweater+2',
            'https://placehold.co/600x750/b4a373/fefae0?text=Sweater+3'
        ],
        description: 'Soft and warm, perfect for chilly evenings.'
    },
    {
        id: 6,
        name: 'Denim Jeans',
        category: "Men's Bottoms",
        price: 99.00,
        stock: 12,
        isOnSale: false,
        imageUrls: [
            'https://placehold.co/600x750/8a9b8a/344e41?text=Jeans+1',
            'https://placehold.co/600x750/8a9b8a/344e41?text=Jeans+2',
            'https://placehold.co/600x750/8a9b8a/344e41?text=Jeans+3'
        ],
        description: 'Classic fit denim jeans, durable and stylish.'
    },
];

const categories = [
    { name: "Women's", imageUrl: 'https://placehold.co/600x800/ccd5ae/606c38?text=Women' },
    { name: "Men's", imageUrl: 'https://placehold.co/600x800/a3b18a/344e41?text=Men' },
    { name: 'Accessories', imageUrl: 'https://placehold.co/600x800/94d2bd/005f73?text=Accessories' },
];

// --- AUTH LOGIC (Custom Hook) ---
/**
 * A custom React hook for managing user authentication state.
 * For demonstration purposes, authentication is simulated with hardcoded credentials.
 */
const useAuth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null); // { id, email, isAdmin }

    /**
     * Simulates a login process.
     * @param {string} email - User's email.
     * @param {string} password - User's password.
     * @returns {boolean} - True if login is successful, false otherwise.
     */
    const login = (email, password) => {
        // Hardcoded credentials for demonstration
        if (email === 'test@example.com' && password === 'password123') {
            setIsLoggedIn(true);
            setUser({ id: 'user123', email: 'test@example.com', isAdmin: false });
            return true;
        } else if (email === 'admin@example.com' && password === 'admin123') {
            setIsLoggedIn(true);
            setUser({ id: 'admin456', email: 'admin@example.com', isAdmin: true });
            return true;
        }
        setIsLoggedIn(false);
        setUser(null);
        return false;
    };

    /**
     * Logs out the current user.
     */
    const logout = () => {
        setIsLoggedIn(false);
        setUser(null);
    };

    return { isLoggedIn, user, login, logout };
};

// --- CART LOGIC (Custom Hook) ---
/**
 * A custom React hook for managing shopping cart state and logic.
 * Provides functions to add, remove, and update quantities of items in the cart,
 * along with computed cart count and total.
 * @param {Array<object>} products - The current list of available products.
 */
const useCart = (products) => {
    const [items, setItems] = useState([]);

    /**
     * Adds a product to the cart or increments its quantity if it already exists.
     * @param {object} product - The product object to add.
     * @param {number} quantity - The quantity to add (defaults to 1).
     */
    const addToCart = (product, quantity = 1) => {
        setItems(prevItems => {
            // Prevent adding to cart if product is out of stock
            const actualProduct = products.find(p => p.id === product.id);
            if (!actualProduct || actualProduct.stock === 0) {
                console.warn(`Attempted to add out-of-stock product: ${product.name}`);
                return prevItems; // Do not modify cart if out of stock
            }

            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                // Ensure not to exceed available stock when updating quantity
                const newQuantity = existingItem.quantity + quantity;
                if (newQuantity > actualProduct.stock) {
                    console.warn(`Cannot add more. Only ${actualProduct.stock} left for ${product.name}.`);
                    return prevItems; // Do not add beyond stock
                }
                return prevItems.map(item =>
                    item.id === product.id ? { ...item, quantity: newQuantity } : item
                );
            }
            // Ensure not to add if requested quantity exceeds stock
            if (quantity > actualProduct.stock) {
                console.warn(`Cannot add ${quantity} of ${product.name}. Only ${actualProduct.stock} left.`);
                return prevItems;
            }
            return [...prevItems, { ...product, quantity }];
        });
    };

    /**
     * Removes an item from the cart by its product ID.
     * @param {number} productId - The ID of the product to remove.
     */
    const removeFromCart = (productId) => {
        setItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    /**
     * Updates the quantity of a specific item in the cart.
     * If the new quantity is 0 or less, the item is removed.
     * @param {number} productId - The ID of the product to update.
     * @param {number} newQuantity - The new quantity for the product.
     */
    const updateQuantity = (productId, newQuantity) => {
        const product = products.find(p => p.id === productId);
        if (!product) return; // Product not found in mock data

        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else if (newQuantity > product.stock) {
            console.warn(`Cannot set quantity to ${newQuantity}. Only ${product.stock} left for ${product.name}.`);
            // Optionally set to max available stock
            setItems(prevItems =>
                prevItems.map(item =>
                    item.id === productId ? { ...item, quantity: product.stock } : item
                )
            );
        }
        else {
            setItems(prevItems =>
                prevItems.map(item =>
                    item.id === productId ? { ...item, quantity: newQuantity } : item
                )
            );
        }
    };

    // Calculate total number of items in the cart
    const cartCount = items.reduce((count, item) => count + item.quantity, 0);
    // Calculate the total price of all items in the cart
    const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

    return { items, addToCart, removeFromCart, updateQuantity, cartCount, cartTotal };
};

// --- WISHLIST LOGIC (Custom Hook) ---
/**
 * A custom React hook for managing wishlist state and logic.
 * Allows adding and removing items from the wishlist, and checking if an item is in the wishlist.
 */
const useWishlist = () => {
    const [wishlistItems, setWishlistItems] = useState([]);

    /**
     * Adds a product to the wishlist.
     * @param {object} product - The product object to add.
     */
    const addToWishlist = (product) => {
        setWishlistItems(prevItems => {
            if (!prevItems.find(item => item.id === product.id)) {
                return [...prevItems, product];
            }
            return prevItems;
        });
    };

    /**
     * Removes a product from the wishlist.
     * @param {number} productId - The ID of the product to remove.
     */
    const removeFromWishlist = (productId) => {
        setWishlistItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    /**
     * Checks if a product is already in the wishlist.
     * @param {number} productId - The ID of the product to check.
     * @returns {boolean} - True if the item is in the wishlist, false otherwise.
     */
    const isItemInWishlist = (productId) => {
        return wishlistItems.some(item => item.id === productId);
    };

    return { wishlistItems, addToWishlist, removeFromWishlist, isItemInWishlist };
};


// --- NAVIGATION LOGIC (Custom Hook) ---
/**
 * A custom React hook for managing page navigation within the single-page application.
 * Provides the current page, page context, and a function to navigate to different pages.
 */
const usePageNavigation = () => {
    const [page, setPage] = useState('home'); // Current active page
    const [pageContext, setPageContext] = useState(null); // Contextual data for the page (e.g., product ID)

    /**
     * Navigates to a new page and optionally sets a context.
     * Scrolls to the top of the window after navigation.
     * @param {string} newPage - The name of the page to navigate to.
     * @param {object} context - Optional context data for the new page.
     */
    const navigate = (newPage, context = null) => {
        setPage(newPage);
        setPageContext(context);
        window.scrollTo(0, 0); // Scroll to top on page change
    };

    return { page, pageContext, navigate };
};

// --- UI COMPONENTS ---

/**
 * Renders the main header of the application, including navigation links,
 * search, cart, and user icons, and a mobile menu toggle.
 * @param {object} props - Component props.
 * @param {function} props.onNavigate - Function to handle page navigation.
 * @param {number} props.cartItemCount - Number of items in the cart to display.
 * @param {boolean} props.isLoggedIn - Authentication status of the user.
 * @param {function} props.onLogout - Function to handle user logout.
 * @param {boolean} props.isAdmin - True if the logged-in user is an admin.
 */
const Header = ({ onNavigate, cartItemCount, isLoggedIn, onLogout, isAdmin }) => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Navigation links for the header
    const navLinks = [
        { name: 'Home', page: 'home' },
        { name: 'Shop', page: 'shop' },
        { name: 'New Arrivals', page: 'new-arrivals' },
        { name: 'About', page: 'about' },
        { name: 'Contact', page: 'contact' },
    ];

    /**
     * Handles navigation clicks, closes the mobile menu, and triggers the onNavigate prop.
     * @param {string} page - The page to navigate to.
     */
    const handleNavClick = (page) => {
        onNavigate(page);
        setMobileMenuOpen(false); // Close mobile menu on navigation
    };

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    {/* Brand Logo/Name */}
                    <a onClick={() => handleNavClick('home')} className="text-3xl font-bold font-heading text-gray-900 cursor-pointer">Raiwear</a>
                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-8">
                        {navLinks.map(link => (
                            <a key={link.name} onClick={() => handleNavClick(link.page)} className="text-gray-600 hover:text-indigo-600 transition-colors duration-300 cursor-pointer">{link.name}</a>
                        ))}
                    </nav>
                    {/* Right-aligned Icons (Search, Cart, User, Mobile Menu) */}
                    <div className="flex items-center space-x-5">
                        <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors duration-300" aria-label="Search"><Search size={20} /></a>
                        <a onClick={() => handleNavClick('cart')} className="relative text-gray-500 hover:text-indigo-600 transition-colors duration-300 cursor-pointer" aria-label="Shopping Cart">
                            <ShoppingCart size={20} />
                            {/* Cart Item Count Badge */}
                            {cartItemCount > 0 && <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{cartItemCount}</span>}
                        </a>
                        {/* User Profile / Login Button */}
                        {isAdmin && (
                            <a onClick={() => handleNavClick('admin')} className="hidden sm:block text-gray-500 hover:text-indigo-600 transition-colors duration-300 cursor-pointer" aria-label="Admin Panel"><Settings size={20} /></a>
                        )}
                        {isLoggedIn ? (
                            <>
                                <a onClick={() => handleNavClick('profile')} className="hidden sm:block text-gray-500 hover:text-indigo-600 transition-colors duration-300 cursor-pointer" aria-label="User Profile"><User size={20} /></a>
                                <a onClick={() => handleNavClick('orders')} className="hidden sm:block text-gray-500 hover:text-indigo-600 transition-colors duration-300 cursor-pointer" aria-label="Your Orders"><ClipboardList size={20} /></a>
                                <a onClick={() => handleNavClick('wishlist')} className="hidden sm:block text-gray-500 hover:text-indigo-600 transition-colors duration-300 cursor-pointer" aria-label="Your Wishlist"><Heart size={20} /></a>
                                <button onClick={onLogout} className="hidden sm:block text-gray-500 hover:text-indigo-600 transition-colors duration-300" aria-label="Log Out"><LogOut size={20} /></button>
                            </>
                        ) : (
                            <a onClick={() => handleNavClick('login')} className="hidden sm:block text-gray-500 hover:text-indigo-600 transition-colors duration-300 cursor-pointer" aria-label="Log In"><LogIn size={20} /></a>
                        )}

                        {/* Mobile Menu Toggle Button */}
                        <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden text-gray-500 hover:text-indigo-600" aria-label="Toggle mobile menu"><Menu size={24} /></button>
                    </div>
                </div>
            </div>
            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden px-4 pb-4 border-t border-gray-200">
                    {navLinks.map(link => (
                        <a key={link.name} onClick={() => handleNavClick(link.page)} className="block py-2 text-gray-600 hover:text-indigo-600 cursor-pointer">{link.name}</a>
                    ))}
                    {isAdmin && (
                        <a onClick={() => handleNavClick('admin')} className="block py-2 text-gray-600 hover:text-indigo-600 cursor-pointer">Admin Panel</a>
                    )}
                    {isLoggedIn ? (
                        <>
                            <a onClick={() => handleNavClick('profile')} className="block py-2 text-gray-600 hover:text-indigo-600 cursor-pointer">Profile</a>
                            <a onClick={() => handleNavClick('orders')} className="block py-2 text-gray-600 hover:text-indigo-600 cursor-pointer">Orders</a>
                            <a onClick={() => handleNavClick('wishlist')} className="block py-2 text-gray-600 hover:text-indigo-600 cursor-pointer">Wishlist</a>
                            <button onClick={onLogout} className="block w-full text-left py-2 text-gray-600 hover:text-indigo-600 cursor-pointer">Logout</button>
                        </>
                    ) : (
                        <a onClick={() => handleNavClick('login')} className="block py-2 text-gray-600 hover:text-indigo-600 cursor-pointer">Login</a>
                    )}
                </div>
            )}
        </header>
    );
};

/**
 * Renders the footer section of the application.
 * @param {object} props - Component props.
 * @param {function} props.onNavigate - Function to handle page navigation for footer links.
 */
const Footer = ({ onNavigate }) => {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="container mx-auto px-4 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Info */}
                    <div>
                        <h3 className="text-2xl font-bold">Raiwear</h3>
                        <p className="mt-4 text-gray-400">Dressing the future with style, sustainability, and comfort.</p>
                        {/* Social Media Links */}
                        <div className="flex space-x-4 mt-6">
                            <a href="#" className="text-gray-400 hover:text-white" aria-label="Facebook"><Facebook /></a>
                            <a href="#" className="text-gray-400 hover:text-white" aria-label="Instagram"><Instagram /></a>
                            <a href="#" className="text-gray-400 hover:text-white" aria-label="Twitter"><Twitter /></a>
                            <a href="#" className="text-gray-400 hover:text-white" aria-label="YouTube"><Youtube /></a>
                        </div>
                    </div>
                    {/* Quick Links Section */}
                    <div>
                        <h4 className="font-semibold text-lg tracking-wider">Quick Links</h4>
                        <ul className="mt-4 space-y-3">
                            <li><a onClick={() => onNavigate('about')} className="text-gray-400 hover:text-white cursor-pointer">About Us</a></li>
                            <li><a onClick={() => onNavigate('contact')} className="text-gray-400 hover:text-white cursor-pointer">Contact</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Size Guide</a></li>
                        </ul>
                    </div>
                    {/* Shop Links Section */}
                    <div>
                        <h4 className="font-semibold text-lg tracking-wider">Shop</h4>
                        <ul className="mt-4 space-y-3">
                            <li><a onClick={() => onNavigate('shop')} className="text-gray-400 hover:text-white cursor-pointer">Men's Collection</a></li>
                            <li><a onClick={() => onNavigate('shop')} className="text-gray-400 hover:text-white cursor-pointer">Women's Collection</a></li>
                            <li><a onClick={() => onNavigate('shop')} className="text-gray-400 hover:text-white cursor-pointer">Accessories</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">Sale</a></li>
                        </ul>
                    </div>
                    {/* Newsletter Signup */}
                    <div>
                        <h4 className="font-semibold text-lg tracking-wider">Join Our Newsletter</h4>
                        <p className="mt-4 text-gray-400">Get 10% off your first order when you subscribe.</p>
                        <div className="mt-4 flex">
                            <input type="email" placeholder="Your email" className="w-full px-4 py-2 rounded-l-md text-gray-800 focus:outline-none" aria-label="Email for newsletter" />
                            <button className="bg-indigo-600 px-4 py-2 rounded-r-md hover:bg-indigo-500">Subscribe</button>
                        </div>
                    </div>
                </div>
                {/* Copyright Information */}
                <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
                    <p>&copy; {new Date().getFullYear() + 1} Raiwear. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

/**
 * Renders a single product card with image, name, category, price, and a quick view button.
 * @param {object} props - Component props.
 * @param {object} props.product - The product object to display.
 * @param {function} props.onNavigate - Function to handle navigation to the product detail page.
 */
const ProductCard = ({ product, onNavigate }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group h-full flex flex-col"> {/* Added h-full and flex-col for consistent height */}
        <div className="relative flex-grow"> {/* flex-grow to make image section fill space */}
            {/* Product Image - uses the first image from the imageUrls array */}
            <img src={product.imageUrls[0]} alt={product.name} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity duration-300" onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/400x500/cccccc/333333?text=Image+Not+Found"; }}/>
            {/* Quick View Overlay */}
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button onClick={() => onNavigate('product', { productId: product.id })} className="px-6 py-2 bg-white text-black font-semibold rounded-md">Quick View</button>
            </div>
        </div>
        <div className="p-4 text-center">
            {/* Product Details */}
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <p className="text-gray-500 text-sm">{product.category}</p>
            <p className="font-bold text-indigo-600 mt-2">R{product.price.toFixed(2)}</p>
        </div>
    </div>
);

/**
 * Renders the home page with a hero section, featured products, and categories.
 * @param {object} props - Component props.
 * @param {function} props.onNavigate - Function to handle page navigation.
 * @param {Array<object>} props.products - The current list of available products.
 */
const HomePage = ({ onNavigate, products }) => {
    const saleProducts = products.filter(p => p.isOnSale);
    const [currentSaleIndex, setCurrentSaleIndex] = useState(0);

    // Function to determine how many items to show based on screen width
    const getItemsToShow = () => {
        if (window.innerWidth >= 1280) { // xl breakpoint
            return 4;
        } else if (window.innerWidth >= 1024) { // lg breakpoint
            return 3;
        } else if (window.innerWidth >= 768) { // md breakpoint
            return 2;
        } else { // default, sm and below
            return 1;
        }
    };

    const [itemsToShow, setItemsToShow] = useState(getItemsToShow());

    useEffect(() => {
        const handleResize = () => {
            setItemsToShow(getItemsToShow());
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Calculate total number of slides needed
    const totalSlides = Math.ceil(saleProducts.length / itemsToShow);

    // Ensure current index is valid if itemsToShow changes (e.g., on resize)
    useEffect(() => {
        if (currentSaleIndex >= totalSlides && totalSlides > 0) {
            setCurrentSaleIndex(0); // Reset index if it becomes out of bounds
        }
    }, [itemsToShow, totalSlides, currentSaleIndex]);

    const nextSlide = () => {
        setCurrentSaleIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    };

    const prevSlide = () => {
        setCurrentSaleIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
    };

    // Automatic carousel sliding
    useEffect(() => {
        let interval;
        // Only auto-slide if there are actually more "slides" than can be shown at once
        if (saleProducts.length > itemsToShow) {
            interval = setInterval(() => {
                nextSlide();
            }, 5000); // Change slide every 5 seconds
        }
        return () => clearInterval(interval); // Clear interval on component unmount
    }, [saleProducts, itemsToShow, totalSlides, nextSlide]); // Dependencies for auto-slide

    return (
        <>
            {/* Hero Section */}
            <section className="relative h-[60vh] md:h-[80vh] bg-cover bg-center text-white rounded-b-lg overflow-hidden" style={{ backgroundImage: "url('https://placehold.co/1800x900/a3b18a/344e41?text=Raiwear+Collection')" }}>
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">Elegance in Motion</h1>
                    <p className="mt-4 max-w-xl text-lg md:text-xl text-gray-200">Discover our new collection, crafted with passion and designed for the modern individual.</p>
                    <a onClick={() => onNavigate('shop')} className="mt-8 px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 cursor-pointer">Shop The New Collection</a>
                </div>
            </section>

            {/* Products on Sale Carousel Section */}
            {saleProducts.length > 0 && (
                <section className="py-16 sm:py-24 bg-gray-100">
                    <div className="container mx-auto px-4 lg:px-8">
                        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Products on Sale</h2>
                        <div className="relative">
                            <div className="overflow-hidden rounded-lg shadow-xl">
                                <div
                                    className="flex transition-transform duration-500 ease-in-out"
                                    // Shift by percentage of total width based on current slide index and items visible per slide
                                    style={{ transform: `translateX(-${currentSaleIndex * (100 / itemsToShow)}%)`, width: `${(saleProducts.length / itemsToShow) * 100}%` }} // Set total width of inner container
                                >
                                    {saleProducts.map((product) => (
                                        <div
                                            key={product.id}
                                            // Define width of each product card within the carousel
                                            // This ensures responsiveness for the items themselves
                                            className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 p-2" // Added p-2 for spacing
                                        >
                                            <ProductCard product={product} onNavigate={onNavigate} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Navigation Arrows */}
                            {totalSlides > 1 && ( // Only show arrows if there's more than one "slide"
                                <>
                                    <button
                                        onClick={prevSlide}
                                        className="absolute top-1/2 left-0 -translate-y-1/2 bg-white bg-opacity-75 p-2 rounded-full shadow-lg z-10 hover:bg-opacity-100 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        aria-label="Previous slide"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={nextSlide}
                                        className="absolute top-1/2 right-0 -translate-y-1/2 bg-white bg-opacity-75 p-2 rounded-full shadow-lg z-10 hover:bg-opacity-100 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        aria-label="Next slide"
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Featured Products Section */}
            <section className="py-16 sm:py-24">
                <div className="container mx-auto px-4 lg:px-8">
                    <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Featured Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Display first 4 products, or fewer if not enough */}
                        {products.slice(0, 4).map(product => <ProductCard key={product.id} product={product} onNavigate={onNavigate} />)}
                    </div>
                </div>
            </section>

            {/* Shop by Category Section */}
            <section className="py-16 sm:py-24 bg-white">
                <div className="container mx-auto px-4 lg:px-8">
                    <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Shop by Category</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {categories.map(category => (
                            <a key={category.name} onClick={() => onNavigate('shop')} className="relative rounded-lg overflow-hidden h-96 block group cursor-pointer">
                                <img src={category.imageUrl} alt={`${category.name} Collection`} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x800/cccccc/333333?text=Image+Not+Found"; }}/>
                                <div className="absolute inset-0 bg-black/40"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <h3 className="text-4xl font-bold text-white">{category.name}</h3>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Sale Call to Action Section */}
            <section className="bg-indigo-700 text-white">
                <div className="container mx-auto px-4 lg:px-8 py-16 text-center">
                    <h2 className="text-4xl font-bold">Mid-Season Sale</h2>
                    <p className="mt-2 text-lg text-indigo-200">Up to <span className="text-3xl font-bold text-yellow-300">40% OFF</span> on selected items.</p>
                    <button onClick={() => onNavigate('shop')} className="mt-6 inline-block px-8 py-3 bg-white text-indigo-700 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition-colors duration-300">Shop Sale</button>
                </div>
            </section>
        </>
    );
};

/**
 * A container component for pages, providing a consistent layout with a title and back button.
 * @param {object} props - Component props.
 * @param {string} props.title - The title to display on the page.
 * @param {React.ReactNode} props.children - The content to render inside the page container.
 * @param {function} props.onNavigate - Function to handle navigation.
 * @param {boolean} props.showBackButton - Whether to show the "Back to Home" button (defaults to true).
 */
const PageContainer = ({ title, children, onNavigate, showBackButton = true }) => (
    <div className="container mx-auto px-4 lg:px-8 py-16 min-h-[60vh]">
        {showBackButton && (
            <button onClick={() => onNavigate('home')} className="flex items-center text-gray-600 hover:text-indigo-600 mb-8">
                <ArrowLeft size={20} className="mr-2" />
                Back to Home
            </button>
        )}
        <h1 className="text-4xl font-bold mb-8">{title}</h1>
        <div className="bg-white p-8 rounded-lg shadow-md">
            {children}
        </div>
    </div>
);

/**
 * Renders the shop page, displaying all products.
 * @param {object} props - Component props.
 * @param {function} props.onNavigate - Function to handle page navigation.
 * @param {Array<object>} props.products - The current list of available products.
 */
const ShopPage = ({ onNavigate, products }) => (
    <PageContainer title="Shop All Products" onNavigate={onNavigate}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(product => <ProductCard key={product.id} product={product} onNavigate={onNavigate} />)}
        </div>
    </PageContainer>
);

/**
 * Renders a dismissible notification message, typically for successful actions.
 * @param {object} props - Component props.
 * @param {string} props.message - The message to display.
 * @param {boolean} props.show - Whether the notification should be visible.
 * @param {function} props.onDismiss - Function to call when the dismiss button is clicked.
 */
const Notification = ({ message, show, onDismiss }) => {
    if (!show) return null; // Don't render if not visible

    return (
        <div className="fixed top-24 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center z-50">
            <span>{message}</span>
            <button onClick={onDismiss} className="ml-4 text-white hover:text-gray-200" aria-label="Dismiss notification">
                <X size={20} />
            </button>
        </div>
    );
};

// --- PAGES WITH CART FUNCTIONALITY ---

/**
 * Renders the product detail page for a specific product.
 * Allows adding the product to the cart.
 * @param {object} props - Component props.
 * @param {number} props.productId - The ID of the product to display.
 * @param {function} props.onNavigate - Function to handle page navigation.
 * @param {function} props.onAddToCart - Function to add the product to the cart.
 * @param {function} props.onAddToWishlist - Function to add the product to the wishlist.
 * @param {function} props.onRemoveFromWishlist - Function to remove the product from the wishlist.
 * @param {boolean} props.isInWishlist - True if the product is in the wishlist.
 * @param {Array<object>} props.products - The current list of available products.
 */
const ProductDetailPage = ({ productId, onNavigate, onAddToCart, onAddToWishlist, onRemoveFromWishlist, isInWishlist, products }) => {
    const product = products.find(p => p.id === productId); // Find the product by ID
    // State to manage the currently displayed large image
    const [currentImage, setCurrentImage] = useState('');

    // Set the initial currentImage when the component mounts or product changes
    useEffect(() => {
        if (product && product.imageUrls && product.imageUrls.length > 0) {
            setCurrentImage(product.imageUrls[0]);
        }
    }, [product]);

    // If product is not found, display a message
    if (!product) {
        return (
            <PageContainer title="Product Not Found" onNavigate={onNavigate}>
                <p>We couldn't find the product you're looking for.</p>
            </PageContainer>
        );
    }

    const isOutOfStock = product.stock === 0;
    const isLowStock = product.stock > 0 && product.stock < 5; // Low stock threshold

    return (
        <div className="container mx-auto px-4 lg:px-8 py-16">
            <button onClick={() => onNavigate('shop')} className="flex items-center text-gray-600 hover:text-indigo-600 mb-8">
                <ArrowLeft size={20} className="mr-2" /> Back to Shop
            </button>
            <div className="bg-white p-8 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Product Image Section */}
                <div>
                    <img src={currentImage} alt={product.name} className="w-full rounded-lg" onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/600x750/cccccc/333333?text=Image+Not+Found"; }}/>
                </div>
                {/* Product Details and Add to Cart */}
                <div>
                    <h2 className="text-3xl font-bold">{product.name}</h2>
                    <p className="text-2xl font-semibold text-indigo-600 my-4">R{product.price.toFixed(2)}</p>
                    {isOutOfStock && <p className="text-red-500 font-semibold mb-4">Sold Out!</p>}
                    {isLowStock && !isOutOfStock && <p className="text-orange-500 font-semibold mb-4">Low Stock: Only {product.stock} left!</p>}
                    <p className="text-gray-600 leading-relaxed">{product.description}</p>
                    {/* Thumbnail Images moved here */}
                    <div className="flex mt-4 mb-8 space-x-2 justify-center">
                        {product.imageUrls.map((imgUrl, index) => (
                            <img
                                key={index}
                                src={imgUrl.replace('600x750', '100x125')} // Smaller size for thumbnails
                                alt={`${product.name} thumbnail ${index + 1}`}
                                className={`w-20 h-auto object-cover rounded-md cursor-pointer border-2 ${currentImage === imgUrl ? 'border-indigo-600' : 'border-transparent'}`}
                                onClick={() => setCurrentImage(imgUrl)}
                                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x125/cccccc/333333?text=Thumb"; }}
                            />
                        ))}
                    </div>
                    <div className="flex space-x-4 mt-8">
                        <button
                            onClick={() => onAddToCart(product)}
                            className={`flex-1 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md transition-colors duration-300 ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'}`}
                            disabled={isOutOfStock}
                        >
                            Add to Cart
                        </button>
                        <button
                            onClick={() => onAddToWishlist(product)} // Always call onAddToWishlist, it handles add/remove logic
                            className={`p-3 rounded-lg shadow-md transition-colors duration-300 ${isInWishlist ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                        >
                            <Heart size={20} fill={isInWishlist ? 'white' : 'currentColor'} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Renders the shopping cart page, displaying items, allowing quantity updates,
 * item removal, and showing the order summary.
 * @param {object} props - Component props.
 * @param {Array<object>} props.cartItems - List of items currently in the cart.
 * @param {function} props.onUpdateQuantity - Function to update item quantity.
 * @param {function} props.onRemoveFromCart - Function to remove an item from the cart.
 * @param {number} props.cartTotal - The total price of items in the cart.
 * @param {function} props.onNavigate - Function to handle page navigation.
 * @param {Array<object>} props.products - The current list of available products.
 */
const CartPage = ({ cartItems, onUpdateQuantity, onRemoveFromCart, cartTotal, onNavigate, products }) => {
    // If the cart is empty, display an empty cart message
    if (cartItems.length === 0) {
        return (
            <PageContainer title="Your Cart is Empty" onNavigate={onNavigate} showBackButton={false}>
                <div className="text-center">
                    <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
                    <button onClick={() => onNavigate('shop')} className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700">Continue Shopping</button>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer title="Your Shopping Cart" onNavigate={onNavigate}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items List */}
                <div className="lg:col-span-2">
                    {cartItems.map(item => {
                        const productData = products.find(p => p.id === item.id); // Use passed products
                        const currentStock = productData ? productData.stock : 0;
                        const isItemOutOfStock = currentStock === 0;

                        return (
                            <div key={item.id} className="flex items-center justify-between p-4 border-b">
                                <div className="flex items-center">
                                    {/* Product Image in Cart - uses the first image from imageUrls array */}
                                    <img src={item.imageUrls[0].replace('600x750','100x125')} alt={item.name} className="w-20 h-auto object-cover rounded-md mr-4" onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x125/cccccc/333333?text=Image+Not+Found"; }}/>
                                    {/* Product Name and Price */}
                                    <div>
                                        <h3 className="font-semibold">{item.name}</h3>
                                        <p className="text-gray-500 text-sm">R{item.price.toFixed(2)}</p>
                                        {isItemOutOfStock && <p className="text-red-500 text-sm mt-1">Out of Stock!</p>}
                                    </div>
                                </div>
                                {/* Quantity Controls and Remove Button */}
                                <div className="flex items-center">
                                    <div className="flex items-center border rounded-md">
                                        <button
                                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                            aria-label="Decrease quantity"
                                        >
                                            <Minus size={16}/>
                                        </button>
                                        <span className="px-4 py-1">{item.quantity}</span>
                                        <button
                                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                            aria-label="Increase quantity"
                                            disabled={item.quantity >= currentStock && currentStock > 0} // Disable if at max stock
                                        >
                                            <Plus size={16}/>
                                        </button>
                                    </div>
                                    <button onClick={() => onRemoveFromCart(item.id)} className="ml-6 text-red-500 hover:text-red-700" aria-label="Remove item"><Trash2 size={20}/></button>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-100 p-6 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                        <div className="flex justify-between mb-2">
                            <span>Subtotal</span>
                            <span>R{cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-4">
                            <span>Shipping</span>
                            <span>Free</span> {/* Assuming free shipping for simplicity */}
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-4 border-t">
                            <span>Total</span>
                            <span>R{cartTotal.toFixed(2)}</span>
                        </div>
                        <button onClick={() => onNavigate('checkout')} className="w-full mt-6 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700">Proceed to Checkout</button>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
};

// --- New Pages ---
/**
 * Renders the user's profile page.
 * @param {object} props - Component props.
 * @param {function} props.onNavigate - Function to handle page navigation.
 * @param {object} props.user - The current authenticated user object.
 */
const ProfilePage = ({ onNavigate, user }) => (
    <PageContainer title="My Profile" onNavigate={onNavigate}>
        {user ? (
            <div>
                <p className="text-gray-800 text-lg mb-2">Welcome, <span className="font-semibold">{user.email}</span>!</p>
                <p className="text-gray-600">This is your profile page. Here you can view and manage your personal information.</p>
                <p className="mt-4 text-gray-600">Features like editing profile details, managing addresses, and payment methods would appear here.</p>
                <div className="mt-6">
                    <button onClick={() => onNavigate('orders')} className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 mr-4">View My Orders</button>
                    <button onClick={() => onNavigate('wishlist')} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg shadow-md hover:bg-gray-300">View My Wishlist</button>
                </div>
            </div>
        ) : (
            <p className="text-red-500">You must be logged in to view your profile.</p>
        )}
    </PageContainer>
);

/**
 * Renders the user's orders page.
 * @param {object} props - Component props.
 * @param {function} props.onNavigate - Function to handle page navigation.
 * @param {boolean} props.isLoggedIn - Authentication status of the user.
 */
const OrdersPage = ({ onNavigate, isLoggedIn }) => (
    <PageContainer title="My Orders" onNavigate={onNavigate}>
        {isLoggedIn ? (
            <>
                <p className="text-gray-600">This page would display your past orders.</p>
                <p className="mt-4 text-gray-600">Currently, there are no past orders to show. Start shopping!</p>
                <div className="mt-6">
                    <button onClick={() => onNavigate('shop')} className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700">Continue Shopping</button>
                </div>
            </>
        ) : (
            <p className="text-red-500">You must be logged in to view your orders.</p>
        )}
    </PageContainer>
);

/**
 * Renders the wishlist page, displaying items added to the wishlist.
 * Shows warnings for low-stock items and allows removing items or adding them to the cart.
 * @param {object} props - Component props.
 * @param {Array<object>} props.wishlistItems - List of items in the wishlist.
 * @param {function} props.onRemoveFromWishlist - Function to remove an item from the wishlist.
 * @param {function} props.onAddToCart - Function to add an item to the cart.
 * @param {function} props.onNavigate - Function to handle page navigation.
 * @param {boolean} props.isLoggedIn - Authentication status of the user.
 * @param {Array<object>} props.products - The current list of available products.
 */
const WishlistPage = ({ wishlistItems, onRemoveFromWishlist, onAddToCart, onNavigate, isLoggedIn, products }) => {
    if (!isLoggedIn) {
        return (
            <PageContainer title="My Wishlist" onNavigate={onNavigate}>
                <p className="text-red-500">You must be logged in to view your wishlist.</p>
            </PageContainer>
        );
    }

    if (wishlistItems.length === 0) {
        return (
            <PageContainer title="Your Wishlist is Empty" onNavigate={onNavigate} showBackButton={false}>
                <div className="text-center">
                    <p className="text-gray-600 mb-6">You haven't added any items to your wishlist yet.</p>
                    <button onClick={() => onNavigate('shop')} className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700">Start Browsing</button>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer title="My Wishlist" onNavigate={onNavigate}>
            <div className="grid grid-cols-1 gap-8">
                {wishlistItems.map(item => {
                    // Find the current stock information from products
                    const productData = products.find(p => p.id === item.id);
                    const currentStock = productData ? productData.stock : 0; // Default to 0 if product not found/stock missing
                    const isOutOfStock = currentStock === 0;
                    const isLowStock = currentStock > 0 && currentStock < 5; // Define low stock threshold

                    return (
                        <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between p-4 border rounded-lg shadow-sm">
                            <div className="flex items-center w-full sm:w-auto mb-4 sm:mb-0">
                                <img src={item.imageUrls[0].replace('600x750', '100x125')} alt={item.name} className="w-24 h-auto object-cover rounded-md mr-4" onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x125/cccccc/333333?text=Image+Not+Found"; }}/>
                                <div>
                                    <h3 className="font-semibold text-lg">{item.name}</h3>
                                    <p className="text-gray-500 text-sm">R{item.price.toFixed(2)}</p>
                                    {isOutOfStock && <p className="text-red-500 text-sm mt-1">Sold Out!</p>}
                                    {isLowStock && !isOutOfStock && <p className="text-orange-500 text-sm mt-1">Low Stock: Only {currentStock} left!</p>}
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 items-center">
                                <button
                                    onClick={() => onAddToCart(item)}
                                    className={`px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md transition-colors duration-300 ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'}`}
                                    disabled={isOutOfStock}
                                >
                                    {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                                </button>
                                <button
                                    onClick={() => onRemoveFromWishlist(item.id)}
                                    className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition-colors duration-300"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </PageContainer>
    );
};

// --- Login Page Component ---
/**
 * Renders the login page with an email and password form.
 * @param {object} props - Component props.
 * @param {function} props.onLogin - Function to handle login attempt.
 * @param {function} props.onNavigate - Function to navigate between pages.
 * @param {function} props.setNotification - Function to set global notification message.
 */
const LoginPage = ({ onLogin, onNavigate, setNotification }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const success = onLogin(email, password);
        if (success) {
            setNotification('Logged in successfully!');
            onNavigate('profile'); // Navigate to profile or home on success
        } else {
            setNotification('Login failed: Invalid email or password.');
        }
    };

    return (
        <PageContainer title="Login to Your Account" onNavigate={onNavigate} showBackButton={false}>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                    <input
                        type="email"
                        id="email"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
                    <input
                        type="password"
                        id="password"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Login
                    </button>
                    {/* Optional: Link to a registration page if implemented */}
                    {/* <a href="#" className="inline-block align-baseline font-bold text-sm text-indigo-600 hover:text-indigo-800">
                        Forgot Password?
                    </a> */}
                </div>
            </form>
        </PageContainer>
    );
};


// --- Admin Page Component ---
/**
 * Renders the admin page where new products can be added.
 * @param {object} props - Component props.
 * @param {function} props.onNavigate - Function to handle page navigation.
 * @param {function} props.onAddProduct - Function to add a single new product.
 * @param {function} props.onAddProductsBulk - Function to add multiple new products (bulk).
 * @param {function} props.setNotification - Function to set global notification message.
 */
const AdminPage = ({ onNavigate, onAddProduct, onAddProductsBulk, setNotification }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl1, setImageUrl1] = useState('');
    const [imageUrl2, setImageUrl2] = useState('');
    const [imageUrl3, setImageUrl3] = useState('');

    const [selectedFile, setSelectedFile] = useState(null);

    const handleSingleProductSubmit = (e) => {
        e.preventDefault();
        // Basic validation
        if (!name || !category || !price || !stock || !description || !imageUrl1) {
            setNotification('Please fill in all required fields (Name, Category, Price, Stock, Description, Image URL 1).');
            return;
        }
        if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
            setNotification('Please enter a valid price.');
            return;
        }
        if (isNaN(parseInt(stock)) || parseInt(stock) < 0) {
            setNotification('Please enter a valid stock quantity.');
            return;
        }

        const newProduct = {
            // ID will be generated in App.js to ensure uniqueness
            name,
            category,
            price: parseFloat(price),
            stock: parseInt(stock),
            imageUrls: [imageUrl1, imageUrl2, imageUrl3].filter(url => url), // Filter out empty URLs
            description,
            isOnSale: false, // Default to not on sale when adding manually
        };

        onAddProduct(newProduct); // Call the single product add function
        setNotification(`Product "${name}" added successfully!`);

        // Clear form
        setName('');
        setCategory('');
        setPrice('');
        setStock('');
        setDescription('');
        setImageUrl1('');
        setImageUrl2('');
        setImageUrl3('');
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
            setSelectedFile(file);
        } else {
            setSelectedFile(null);
            setNotification('Please select a valid CSV file.');
        }
    };

    const handleDownloadTemplate = () => {
        const csvContent = "data:text/csv;charset=utf-8,name,category,price,stock,description,imageUrl1,imageUrl2,imageUrl3,isOnSale\n" +
                           "New T-Shirt,Unisex,29.99,50,A comfy cotton t-shirt.,https://placehold.co/600x750/f4a261/264653?text=New+Tee+1,,,TRUE\n" +
                           "Sport Shorts,Men's Activewear,45.00,30,Breathable shorts for your workout.,https://placehold.co/600x750/e9c46a/2a9d8f?text=Sport+Shorts+1,,,FALSE\n";
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "product_template.csv");
        document.body.appendChild(link); // Required for Firefox
        link.click();
        document.body.removeChild(link);
        setNotification("Product template downloaded!");
    };

    const handleBulkUpload = () => {
        if (!selectedFile) {
            setNotification('Please select a CSV file to upload.');
            return;
        }

        // Simulate file reading and parsing
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            // Simplified CSV parsing: split by newline, then by comma.
            // In a real app, use a robust CSV parser (e.g., PapaParse).
            const lines = text.split('\n').filter(line => line.trim() !== '');
            if (lines.length <= 1) { // Only header or empty
                setNotification('The uploaded CSV file is empty or contains only headers.');
                return;
            }

            const headers = lines[0].split(',').map(h => h.trim());
            const bulkProducts = [];
            let errorCount = 0;

            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(',').map(v => v.trim());
                if (values.length !== headers.length) {
                    console.error(`Skipping malformed row ${i + 1}: ${lines[i]}`);
                    errorCount++;
                    continue;
                }

                try {
                    const product = {
                        name: values[headers.indexOf('name')],
                        category: values[headers.indexOf('category')],
                        price: parseFloat(values[headers.indexOf('price')]),
                        stock: parseInt(values[headers.indexOf('stock')]),
                        description: values[headers.indexOf('description')],
                        imageUrls: [
                            values[headers.indexOf('imageUrl1')],
                            values[headers.indexOf('imageUrl2')],
                            values[headers.indexOf('imageUrl3')]
                        ].filter(url => url),
                        // Parse isOnSale as boolean
                        isOnSale: values[headers.indexOf('isOnSale')]?.toLowerCase() === 'true'
                    };

                    // Basic validation for parsed data
                    if (!product.name || !product.category || isNaN(product.price) || product.price <= 0 || isNaN(product.stock) || product.stock < 0 || !product.description || product.imageUrls.length === 0) {
                        throw new Error('Missing or invalid data in row.');
                    }
                    bulkProducts.push(product);
                } catch (error) {
                    console.error(`Error parsing row ${i + 1}: ${lines[i]} - ${error.message}`);
                    errorCount++;
                }
            }

            if (bulkProducts.length > 0) {
                onAddProductsBulk(bulkProducts);
                setNotification(`Successfully uploaded ${bulkProducts.length} products! ${errorCount > 0 ? `(${errorCount} rows skipped due to errors)` : ''}`);
            } else if (errorCount === lines.length - 1) { // All data rows had errors
                setNotification('No products could be uploaded. All rows had errors.');
            } else {
                setNotification('No valid products found in the uploaded file.');
            }
            setSelectedFile(null); // Clear the file input
            e.target.value = ''; // Reset the input field
        };

        reader.onerror = () => {
            setNotification('Failed to read file.');
        };

        reader.readAsText(selectedFile);
    };


    return (
        <PageContainer title="Admin Panel" onNavigate={onNavigate}>
            {/* Single Product Addition */}
            <div className="mb-12 p-6 bg-gray-50 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Single Product</h2>
                <form onSubmit={handleSingleProductSubmit} className="max-w-2xl mx-auto">
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Product Name:</label>
                        <input type="text" id="name" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">Category:</label>
                        <input type="text" id="category" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={category} onChange={(e) => setCategory(e.target.value)} required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">Price (R):</label>
                            <input type="number" id="price" step="0.01" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={price} onChange={(e) => setPrice(e.target.value)} required />
                        </div>
                        <div>
                            <label htmlFor="stock" className="block text-gray-700 text-sm font-bold mb-2">Stock Quantity:</label>
                            <input type="number" id="stock" step="1" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={stock} onChange={(e) => setStock(e.target.value)} required />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
                        <textarea id="description" rows="4" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="imageUrl1" className="block text-gray-700 text-sm font-bold mb-2">Image URL 1 (Main):</label>
                        <input type="url" id="imageUrl1" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={imageUrl1} onChange={(e) => setImageUrl1(e.target.value)} required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="imageUrl2" className="block text-gray-700 text-sm font-bold mb-2">Image URL 2:</label>
                        <input type="url" id="imageUrl2" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={imageUrl2} onChange={(e) => setImageUrl2(e.target.value)} />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="imageUrl3" className="block text-gray-700 text-sm font-bold mb-2">Image URL 3:</label>
                        <input type="url" id="imageUrl3" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={imageUrl3} onChange={(e) => setImageUrl3(e.target.value)} />
                    </div>
                    <div className="flex items-center justify-between">
                        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Add Product
                        </button>
                    </div>
                </form>
            </div>

            {/* Bulk Product Upload */}
            <div className="p-6 bg-gray-50 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Bulk Product Upload</h2>
                <div className="mb-4">
                    <p className="text-gray-700 mb-2">Download our template to quickly add multiple products.</p>
                    <button
                        onClick={handleDownloadTemplate}
                        className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-md"
                    >
                        <Download size={18} className="mr-2" /> Download Template (CSV)
                    </button>
                </div>
                <div className="mb-6">
                    <label htmlFor="bulkUploadFile" className="block text-gray-700 text-sm font-bold mb-2">Upload Products CSV:</label>
                    <input
                        type="file"
                        id="bulkUploadFile"
                        accept=".csv"
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        onChange={handleFileChange}
                    />
                    {selectedFile && <p className="mt-2 text-sm text-gray-600">Selected file: {selectedFile.name}</p>}
                </div>
                <div className="flex items-center justify-between">
                    <button
                        onClick={handleBulkUpload}
                        className={`bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${!selectedFile ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={!selectedFile}
                    >
                        Upload Products
                    </button>
                </div>
            </div>
        </PageContainer>
    );
};

/**
 * Placeholder component for the checkout page.
 * @param {object} props - Component props.
 * @param {function} props.onNavigate - Function to handle page navigation.
 */
const CheckoutPage = ({ onNavigate }) => (
    <PageContainer title="Checkout" onNavigate={onNavigate}>
        <p className="text-gray-600">This is the checkout page. Here you would typically enter shipping information and payment details.</p>
        <p className="mt-4 text-gray-600">For this demo, we're keeping it simple. In a real application, you'd proceed with payment integration here.</p>
        <div className="mt-6">
            <button onClick={() => onNavigate('home')} className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700">Complete Purchase (Demo)</button>
        </div>
    </PageContainer>
);


// --- Placeholder Pages ---
/**
 * Placeholder component for the New Arrivals page.
 * @param {object} props - Component props.
 * @param {function} props.onNavigate - Function to handle page navigation.
 */
const NewArrivalsPage = ({ onNavigate }) => <PageContainer title="New Arrivals" onNavigate={onNavigate}><p>Check back soon for our latest styles!</p></PageContainer>;

/**
 * Placeholder component for the About Us page.
 * @param {object} props - Component props.
 * @param {function} props.onNavigate - Function to handle page navigation.
 */
const AboutPage = ({ onNavigate }) => <PageContainer title="About Raiwear" onNavigate={onNavigate}><p>Raiwear was founded with a passion for creating sustainable and stylish apparel for the modern world.</p></PageContainer>;

/**
 * Placeholder component for the Contact Us page.
 * @param {object} props - Component props.
 * @param {function} props.onNavigate - Function to handle page navigation.
 */
const ContactPage = ({ onNavigate }) => <PageContainer title="Contact Us" onNavigate={onNavigate}><p>Have questions? Email us at contact@raiwear.com</p></PageContainer>;


// --- MAIN APP COMPONENT ---

/**
 * The main application component that manages global state, routing, and renders different pages.
 */
export default function App() {
    // State for all products, initialized with mock data
    const [products, setProducts] = useState(mockProductsInitial);

    // Custom hooks for navigation and cart management
    const { page, pageContext, navigate } = usePageNavigation();
    const { items: cartItems, addToCart, removeFromCart, updateQuantity, cartCount, cartTotal } = useCart(products); // Pass products to useCart
    const { wishlistItems, addToWishlist, removeFromWishlist, isItemInWishlist } = useWishlist();
    const { isLoggedIn, user, login, logout } = useAuth(); // Auth hook
    const [showNotification, setShowNotification] = useState(false); // State for showing/hiding notification
    const [notificationMessage, setNotificationMessage] = useState(""); // State for notification message

    // Function to set and show a notification
    const showAppNotification = (message) => {
        setNotificationMessage(message);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
    };

    /**
     * Handles adding a new product to the global product list.
     * Generates a new ID for the product.
     * @param {object} newProduct - The product object to add.
     */
    const handleAddProduct = (newProduct) => {
        setProducts(prevProducts => {
            const newId = prevProducts.length > 0 ? Math.max(...prevProducts.map(p => p.id)) + 1 : 1;
            return [...prevProducts, { ...newProduct, id: newId }];
        });
    };

    /**
     * Handles adding multiple new products to the global product list (bulk upload).
     * Generates new unique IDs for all products in the bulk array.
     * @param {Array<object>} newProductsArray - An array of new product objects to add.
     */
    const handleAddProductsBulk = (newProductsArray) => {
        setProducts(prevProducts => {
            let currentMaxId = prevProducts.length > 0 ? Math.max(...prevProducts.map(p => p.id)) : 0;
            const productsWithIds = newProductsArray.map(product => {
                currentMaxId++;
                return { ...product, id: currentMaxId };
            });
            return [...prevProducts, ...productsWithIds];
        });
    };

    /**
     * Handles adding a product to the cart and triggers a notification.
     * @param {object} product - The product to add.
     */
    const handleAddToCart = (product) => {
        // Find the actual product to check stock from the current products state
        const actualProduct = products.find(p => p.id === product.id);
        if (!actualProduct || actualProduct.stock === 0) {
            showAppNotification(`Sorry, "${product.name}" is out of stock!`);
            return;
        }
        addToCart(product);
        showAppNotification(`"${product.name}" added to cart!`);
    };

    /**
     * Handles adding a product to the wishlist and triggers a notification.
     * @param {object} product - The product to add.
     */
    const handleAddToWishlist = (product) => {
        if (!isItemInWishlist(product.id)) {
            addToWishlist(product);
            showAppNotification(`"${product.name}" added to wishlist!`);
        } else {
            showAppNotification(`"${product.name}" is already in your wishlist.`);
        }
    };

    /**
     * Handles removing a product from the wishlist and triggers a notification.
     * @param {number} productId - The ID of the product to remove.
     */
    const handleRemoveFromWishlist = (productId) => {
        const product = products.find(p => p.id === productId); // Use current products state
        removeFromWishlist(productId);
        showAppNotification(`"${product?.name || 'Item'}" removed from wishlist.`);
    };

    /**
     * Handles user logout and navigates to home page.
     */
    const handleLogout = () => {
        logout();
        showAppNotification("Logged out successfully!");
        navigate('home');
    };
    
    /**
     * Renders the appropriate page component based on the current navigation state.
     * Includes logic for protected routes.
     */
    const renderPage = () => {
        // Define protected routes
        const protectedRoutes = ['profile', 'orders', 'wishlist'];
        // Define admin-only routes
        const adminRoutes = ['admin'];

        // Redirect if trying to access a protected route and not logged in
        if (protectedRoutes.includes(page) && !isLoggedIn) {
            return <LoginPage onLogin={login} onNavigate={navigate} setNotification={showAppNotification} />;
        }

        // Redirect if trying to access an admin route and not an an admin
        if (adminRoutes.includes(page) && (!isLoggedIn || !user?.isAdmin)) {
            showAppNotification("Access Denied: You need admin privileges to view this page.");
            return <LoginPage onLogin={login} onNavigate={navigate} setNotification={showAppNotification} />;
        }


        switch (page) {
            case 'shop':
                return <ShopPage onNavigate={navigate} products={products} />; // Pass products
            case 'product':
                // Pass productId from pageContext to ProductDetailPage, along with wishlist functions and products
                return <ProductDetailPage
                            productId={pageContext?.productId}
                            onNavigate={navigate}
                            onAddToCart={handleAddToCart}
                            onAddToWishlist={handleAddToWishlist}
                            onRemoveFromWishlist={handleRemoveFromWishlist}
                            isInWishlist={isItemInWishlist(pageContext?.productId)}
                            products={products} // Pass products
                        />;
            case 'cart':
                // Pass cart state and functions to CartPage, and products
                return <CartPage cartItems={cartItems} onUpdateQuantity={updateQuantity} onRemoveFromCart={removeFromCart} cartTotal={cartTotal} onNavigate={navigate} products={products} />; // Pass products
            case 'wishlist':
                // Pass wishlist state and functions to WishlistPage, and products
                return <WishlistPage
                            wishlistItems={wishlistItems}
                            onRemoveFromWishlist={handleRemoveFromWishlist}
                            onAddToCart={handleAddToCart}
                            onNavigate={navigate}
                            isLoggedIn={isLoggedIn}
                            products={products} // Pass products
                        />;
            case 'profile':
                return <ProfilePage onNavigate={navigate} user={user} />;
            case 'orders':
                return <OrdersPage onNavigate={navigate} isLoggedIn={isLoggedIn} />;
            case 'login':
                return <LoginPage onLogin={login} onNavigate={navigate} setNotification={showAppNotification} />;
            case 'admin':
                return <AdminPage onNavigate={navigate} onAddProduct={handleAddProduct} onAddProductsBulk={handleAddProductsBulk} setNotification={showAppNotification} />;
            case 'checkout':
                return <CheckoutPage onNavigate={navigate} />;
            case 'new-arrivals':
                return <NewArrivalsPage onNavigate={navigate} />;
            case 'about':
                return <AboutPage onNavigate={navigate} />;
            case 'contact':
                return <ContactPage onNavigate={navigate} />;
            case 'home':
            default:
                return <HomePage onNavigate={navigate} products={products} />; // Pass products
        }
    };

    // Global styles applied to the root div, primarily for font consistency
    const globalStyles = { fontFamily: "'Inter', sans-serif", backgroundColor: '#f8f9fa', color: '#343a40' };

    return (
        <div style={globalStyles} className="min-h-screen flex flex-col">
            {/* Notification component for user feedback */}
            <Notification message={notificationMessage} show={showNotification} onDismiss={() => setShowNotification(false)} />
            {/* Header component, always visible */}
            <Header onNavigate={navigate} cartItemCount={cartCount} isLoggedIn={isLoggedIn} onLogout={handleLogout} isAdmin={user?.isAdmin} />
            {/* Main content area, where different pages are rendered */}
            <main className="flex-grow">
                {renderPage()}
            </main>
            {/* Footer component, always visible */}
            <Footer onNavigate={navigate} />
        </div>
    );
}
