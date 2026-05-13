import { useState } from "react";

export default function CartPage() {
  const product = {
    id: 1,
    name: "Poussette bébé compacte",
    duration: "1 mois",
    price: 29.99,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80",
  };

  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const addToCart = () => {
    setCartItems([product]);
    setShowCart(true);
    setShowMessage(true);

    setTimeout(() => {
      setShowMessage(false);
    }, 2000);
  };

  const increaseQuantity = () => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  };

  const decreaseQuantity = () => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === product.id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      ),
    );
  };

  const removeFromCart = () => {
    setCartItems([]);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const deliveryFees = cartItems.length > 0 ? 4.99 : 0;
  const total = subtotal + deliveryFees;

  return (
    <main className="min-h-screen bg-[#F2F2F9] p-4 text-[#040037]">
      <header className="mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowCart(false)}
          className="text-2xl"
        >
          ←
        </button>

        <h1 className="text-2xl font-bold">Leasing</h1>

        <button
          type="button"
          onClick={() => setShowCart(true)}
          className="relative rounded-full bg-white px-4 py-2 shadow-sm"
        >
          🛒
          {cartItems.length > 0 && (
            <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-2 text-xs text-white">
              {cartItems[0].quantity}
            </span>
          )}
        </button>
      </header>

      {showMessage && (
        <div className="mb-4 rounded-2xl bg-[#040037] p-4 text-sm font-medium text-white">
          ✓ L’article a bien été ajouté.
        </div>
      )}

      {!showCart ? (
        <section className="rounded-3xl bg-white p-4 shadow-sm">
          <img
            src={product.image}
            alt={product.name}
            className="h-48 w-full rounded-2xl object-cover"
          />

          <h2 className="mt-4 text-xl font-bold">{product.name}</h2>

          <p className="mt-2 text-sm text-[#757388]">
            Durée sélectionnée : {product.duration}
          </p>

          <p className="mt-2 text-lg font-bold">
            {product.price.toFixed(2)} € / mois
          </p>

          <button
            type="button"
            onClick={addToCart}
            className="mt-5 w-full rounded-full bg-[#040037] py-4 text-base font-semibold text-white"
          >
            Ajouter au panier
          </button>
        </section>
      ) : (
        <section className="mt-8">
          <h2 className="mb-4 text-xl font-bold">Détail du panier</h2>

          {cartItems.length === 0 ? (
            <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
              <p className="text-4xl">🛒</p>

              <p className="mt-4 font-bold">Votre panier est vide</p>

              <p className="mt-2 text-sm text-[#757388]">
                Ajoutez un article pour commencer votre réservation.
              </p>

              <button
                type="button"
                onClick={() => setShowCart(false)}
                className="mt-6 w-full rounded-full bg-[#040037] py-4 text-base font-semibold text-white"
              >
                Retour au catalogue
              </button>
            </div>
          ) : (
            <div>
              <div className="rounded-3xl bg-white p-4 shadow-sm">
                <div className="mb-4 flex justify-between text-sm">
                  <span>
                    Vendu et expédié par <strong>Kiabi Leasing</strong>
                  </span>
                  <span>{cartItems[0].quantity} article(s)</span>
                </div>

                <div className="flex gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-32 w-28 rounded-2xl object-cover"
                  />

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="font-semibold">{product.name}</h3>

                      <p className="mt-1 text-sm text-[#757388]">
                        Durée : {product.duration}
                      </p>

                      <p className="mt-3 text-lg font-bold">
                        {(product.price * cartItems[0].quantity).toFixed(2)} €
                      </p>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={removeFromCart}
                        className="rounded-full bg-[#F2F2F9] px-4 py-2 text-sm font-medium"
                      >
                        Supprimer
                      </button>

                      <button
                        type="button"
                        onClick={decreaseQuantity}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2F2F9] text-xl font-bold"
                      >
                        -
                      </button>

                      <span className="font-bold">{cartItems[0].quantity}</span>

                      <button
                        type="button"
                        onClick={increaseQuantity}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2F2F9] text-xl font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-5 border-t pt-4 text-sm">
                  <p>
                    <strong>Estimation de livraison :</strong>{" "}
                    <span className="text-green-700">
                      sous 1 à 2 jours ouvrés
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-3xl bg-white p-4 shadow-sm">
                <div className="flex justify-between text-sm">
                  <span>Sous-total</span>
                  <span>{subtotal.toFixed(2)} €</span>
                </div>

                <div className="mt-2 flex justify-between text-sm">
                  <span>Frais de livraison</span>
                  <span>{deliveryFees.toFixed(2)} €</span>
                </div>

                <div className="mt-3 flex justify-between border-t pt-3 text-lg font-bold">
                  <span>Total</span>
                  <span>{total.toFixed(2)} €</span>
                </div>

                <button
                  type="button"
                  className="mt-5 w-full rounded-full bg-[#040037] py-4 text-base font-semibold text-white"
                >
                  Confirmer la réservation
                </button>
              </div>
            </div>
          )}
        </section>
      )}
    </main>
  );
}