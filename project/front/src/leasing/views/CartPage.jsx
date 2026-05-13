import { useState } from "react";

export default function CartPage() {
  const product = {
    id: 1,
    name: "Poussette bébé compacte",
    duration: "1 mois",
    price: 29.99,
    image:
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
  };

  const [cartItems, setCartItems] = useState([]);

  const addToCart = () => {
    setCartItems([product]);
  };

  const removeFromCart = () => {
    setCartItems([]);
  };

  const deliveryFees = cartItems.length > 0 ? 4.99 : 0;
  const total = cartItems.length > 0 ? product.price + deliveryFees : 0;

  return (
    <main className="min-h-screen bg-[#F2F2F9] p-4">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#040037]">Leasing</h1>

        <button
          type="button"
          className="relative rounded-full bg-white px-4 py-2 shadow-sm"
        >
          🛒
          {cartItems.length > 0 && (
            <span className="absolute -right-1 -top-1 rounded-full bg-[#040037] px-2 text-xs text-white">
              {cartItems.length}
            </span>
          )}
        </button>
      </header>

      <section className="rounded-3xl bg-white p-4 shadow-sm">
        <img
          src={product.image}
          alt={product.name}
          className="h-48 w-full rounded-2xl object-cover"
        />

        <h2 className="mt-4 text-xl font-bold text-[#040037]">
          {product.name}
        </h2>

        <p className="mt-2 text-sm text-[#757388]">
          Durée sélectionnée : {product.duration}
        </p>

        <p className="mt-2 text-lg font-bold text-[#040037]">
          {product.price.toFixed(2)} € / mois
        </p>

        <button
          type="button"
          onClick={addToCart}
          className="mt-5 w-full rounded-full bg-[#040037] py-3 font-semibold text-white"
        >
          Ajouter au panier
        </button>
      </section>

      <section className="mt-6">
        <h2 className="mb-3 text-xl font-bold text-[#040037]">Mon panier</h2>

        {cartItems.length === 0 ? (
          <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
            <p className="text-4xl">🛒</p>

            <p className="mt-3 font-bold text-[#040037]">
              Votre panier est vide
            </p>

            <p className="mt-2 text-sm text-[#757388]">
              Ajoutez un article pour commencer votre réservation.
            </p>

            <button
              type="button"
              className="mt-5 w-full rounded-full bg-[#040037] py-3 font-semibold text-white"
            >
              Retour au catalogue
            </button>
          </div>
        ) : (
          <div>
            <div className="flex gap-3 rounded-3xl bg-white p-4 shadow-sm">
              <img
                src={product.image}
                alt={product.name}
                className="h-24 w-24 rounded-2xl object-cover"
              />

              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-[#040037]">
                    {product.name}
                  </h3>

                  <p className="mt-1 text-sm text-[#757388]">
                    Durée : {product.duration}
                  </p>

                  <p className="mt-2 font-bold text-[#040037]">
                    {product.price.toFixed(2)} €
                  </p>
                </div>

                <button
                  type="button"
                  onClick={removeFromCart}
                  className="mt-3 self-start text-sm font-medium text-red-600"
                >
                  Supprimer
                </button>
              </div>
            </div>

            <div className="mt-4 rounded-3xl bg-white p-4 shadow-sm">
              <div className="flex justify-between text-sm">
                <span>Frais de livraison</span>
                <span>{deliveryFees.toFixed(2)} €</span>
              </div>

              <div className="mt-3 flex justify-between border-t pt-3 text-lg font-bold text-[#040037]">
                <span>Total</span>
                <span>{total.toFixed(2)} €</span>
              </div>

              <button
                type="button"
                className="mt-5 w-full rounded-full bg-[#040037] py-3 font-semibold text-white"
              >
                Confirmer la réservation
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}