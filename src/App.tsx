import { useState } from "react";
import { menuItems } from "./data/db";
import type { MenuItems } from "./types/index";

function App() {
  const [selectedItem, setSelectedItem] = useState<MenuItems | null>(null);
  const [cartItems, setCartItems] = useState<
    { item: MenuItems; quantity: number }[]
  >([]);
  const [alertVisible, setAlertVisible] = useState(false);

  // Añadir al carrito
  const handleAddToCart = () => {
    if (selectedItem) {
      setCartItems((prevItems) => {
        const existingItem = prevItems.find(
          (cartItem) => cartItem.item.id === selectedItem.id
        );
        if (existingItem) {
          return prevItems.map((cartItem) =>
            cartItem.item.id === selectedItem.id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          );
        }
        return [...prevItems, { item: selectedItem, quantity: 1 }];
      });
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 3000);
      setSelectedItem(null);
    }
  };

  // Incremento de cantidad
  const incrementQuantity = (id: number) => {
    setCartItems((prevItems) =>
      prevItems.map((cartItem) =>
        cartItem.item.id === id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      )
    );
  };

  // Decremento de cantidad
  const decrementQuantity = (id: number) => {
    setCartItems((prevItems) =>
      prevItems
        .map((cartItem) =>
          cartItem.item.id === id
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
        .filter((cartItem) => cartItem.quantity > 0)
    );
  };

  // Eliminación de tratamiento
  const removeItem = (id: number) => {
    setCartItems((prevItems) =>
      prevItems.filter((cartItem) => cartItem.item.id !== id)
    );
  };

  // Cálculo del total con descuentos
  const calculateTotal = () => {
    const subtotal = cartItems.reduce(
      (sum, cartItem) => sum + cartItem.item.price * cartItem.quantity,
      0
    );

    let discount = 0;
    if (subtotal >= 300) discount = 0.2;
    else if (subtotal >= 200) discount = 0.15;
    else if (subtotal >= 100) discount = 0.1;

    const discountAmount = subtotal * discount;
    const totalWithDiscount = subtotal - discountAmount;
    return { subtotal, totalWithDiscount, discount, discountAmount };
  };

  // Mostrar progreso hacia el siguiente descuento
  const { subtotal, totalWithDiscount, discount, discountAmount } =
    calculateTotal();
  const nextDiscountThreshold =
    subtotal < 100 ? 100 : subtotal < 200 ? 200 : subtotal < 300 ? 300 : null;
  const amountToNextDiscount = nextDiscountThreshold
    ? nextDiscountThreshold - subtotal
    : 0;

  const [modalVisible, setModalVisible] = useState(false);

  const handleCloseModal = () => {
    setModalVisible(false);
    setCartItems([]); //Vaciamos el carrito cuando se cierre el modal de reserva
    setAlertVisible(true); // Mostrar la alerta de "Tratamientos reservados con éxito"
    setTimeout(() => setAlertVisible(false), 3000); // Desaparecer la alerta después de 3 segundos
  };

  return (
    <>
      <header className="bg-teal-400 py-5">
        <h1 className="text-center text-6xl text-teal-50">Serenitea</h1>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
        {/* Tratamientos */}
        <div className="col-span-1">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-semibold tracking-tight text-gray-500 sm:text-4xl">
              Nuestros Tratamientos
            </h3>
          </div>

          <div className="bg-white">
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 xl:gap-x-4 xl:gap-4">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="group w-full border-2 border-teal-400 rounded-lg hover:bg-teal-200 hover:shadow-lg"
                >
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
                    <img
                      src={item.img}
                      alt={item.description}
                      className="h-100 w-full object-cover object-center group-hover:opacity-75"
                    />
                  </div>
                  <h3 className="mt-2 text-sm text-gray-700">{item.name}</h3>
                  <p className="my-1 text-md font-medium text-teal-500">
                    {item.price}€
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reserva */}
        <div className="col-span-1">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-semibold tracking-tight text-gray-500 sm:text-4xl">
              Reserva
            </h3>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            {cartItems.length === 0 ? (
              <p className="text-center text-lg text-gray-500">
                Añade tus tratamientos hoy y gástalos sin límite de tiempo.
                Además, consigue descuentos increíbles.
              </p>
            ) : (
              cartItems.map((cartItem) => (
                <div key={cartItem.item.id} className="mb-4 border-b pb-4">
                  <h4 className="text-teal-500 text-lg font-semibold">
                    {cartItem.item.name}
                  </h4>

                  <p className="text-gray-700 text-lg ">
                    Precio total: {cartItem.item.price * cartItem.quantity}€
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => decrementQuantity(cartItem.item.id)}
                      className="px-3 py-1 bg-teal-400 text-white rounded-lg"
                    >
                      -
                    </button>

                    <p className="text-gray-700 text-lg font-semibold">
                      {cartItem.quantity}
                    </p>

                    <button
                      onClick={() => incrementQuantity(cartItem.item.id)}
                      className="px-3 py-1 bg-teal-400 text-white rounded-lg"
                    >
                      +
                    </button>

                    <button
                      onClick={() => removeItem(cartItem.item.id)}
                      className="px-3 py-1 bg-red-400 text-white rounded-lg"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}

            {/* Total y descuento */}
            {cartItems.length > 0 && (
              <div className="mt-4">
                <p className="text-base font-bold text-gray-500">
                  Total sin descuento:{" "}
                  <p className="line-through">{subtotal}€</p>
                </p>
                {discount > 0 && (
                  <p className="text-2xl font-bold text-green-400">
                    Descuento: -{(discount * 100).toFixed(0)}%
                  </p>
                )}
                <p className="text-2xl font-bold text-gray-500">
                  Total con descuento:{" "}
                  <p className="text-green-400">
                    {totalWithDiscount.toFixed(2)}€
                  </p>
                </p>
                {amountToNextDiscount > 0 && (
                  <p className="text-lg bg-orange-200 mt-5 text-center text-red-500 font-bold border-dashed border-4 border-red-500 py-3 rounded-lg">
                    Te faltan {amountToNextDiscount.toFixed(2)}€ para el
                    siguiente descuento
                  </p>
                )}
              </div>
            )}

            <button
              onClick={() => setModalVisible(true)} // Mostramos el modal al hacer clic
              className="mt-6 w-full bg-teal-400 text-white font-semibold py-2 rounded-lg hover:bg-teal-500"
            >
              Reservar tratamiento
            </button>
          </div>
        </div>

        {/* Modal de Tratamiento Seleccionado */}
        {selectedItem && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white max-w-lg p-6 rounded-lg relative">
              <button
                onClick={() => setSelectedItem(null)}
                className="bg-white p-3 rounded-xl absolute top-3 right-3 text-gray-600 z-10"
              >
                Cerrar
              </button>
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 mb-4">
                <img
                  src={selectedItem.img}
                  alt={selectedItem.description}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">
                {selectedItem.name}
              </h3>
              <p className="text-gray-700 mt-2">{selectedItem.description}</p>
              <p className="text-gray-500 mt-1">
                Duración: {selectedItem.duration}
              </p>
              <p className="text-lg font-medium text-gray-900 mt-4">
                {selectedItem.price}€
              </p>
              <button
                onClick={handleAddToCart}
                className="mt-6 w-full bg-teal-400 text-white font-semibold py-2 rounded-lg hover:bg-teal-500"
              >
                Añadir tratamiento
              </button>
            </div>
          </div>
        )}

        {/* Modal de confirmación */}
        {modalVisible && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white max-w-lg p-6 rounded-lg relative">
              <h3 className="text-center text-2xl font-semibold text-gray-900 mb-4">
                ¡Tratamientos reservados con éxito!
              </h3>
              <p className="text-base font-bold text-gray-500">
                Total sin descuento: {subtotal}€
              </p>

              <p className="my-3 text-base font-bold text-green-400">
                Cantidad descontada: {discountAmount.toFixed(2)}
              </p>

              <p className="text-xl font-medium text-gray-900 mb-4 my-3">
                Total pagado:{" "}
                <span className="text-green-400">
                  {totalWithDiscount.toFixed(2)}€
                </span>
              </p>

              <p className="text-lg text-gray-500 mb-4">
                Recuerda que puedes gastar tus tratamientos sin límite de
                tiempo, no olvides agendar tu cita cuando la necesites. Gracias
                por su confianza.
              </p>
              <button
                onClick={handleCloseModal}
                className="mt-6 w-full bg-teal-400 text-white font-semibold py-2 rounded-lg hover:bg-teal-500"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* Alerta de éxito */}
        {alertVisible && (
          <div className="fixed bottom-5 right-5 bg-teal-400 text-white py-2 px-6 rounded-lg shadow-lg">
            <p>Tratamientos reservados con éxito</p>
          </div>
        )}

        {/* Sección de liderazgo */}
        <div className=" max-w-7xl mx-auto grid grid-cols-1 bg-white by-24 sm:py-32">
          <h2 className="text-pretty text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl text-center">
            Conoce Nuestro Equipo
          </h2>
          <div className="max-w-7xl mx-auto grid grid-cols-1 bg-white pb-10">
            <p className="mt-6 text-lg/8 text-gray-600 text-center">
              Nuestro equipo está dedicado a ofrecer los mejores resultados para
              nuestros clientes. Cada miembro de nuestro equipo se compromete a
              brindar una experiencia única, adaptada a las necesidades de cada
              persona, utilizando las mejores técnicas y productos de calidad.
            </p>
          </div>

          <div className="mx-auto grid max-w-7xl ">
            <ul
              role="list"
              className="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2"
            >
              <li>
                <div className="flex items-center gap-x-6">
                  <img
                    className="h-16 w-16 rounded-full"
                    src="../img/4.webp"
                    alt=""
                  />
                  <div>
                    <h3 className="text-base/7 font-semibold tracking-tight text-gray-900">
                      Francisco Garcia
                    </h3>
                    <p className="text-sm/6 font-semibold text-indigo-600">
                    Fisioterapeuta. Terapia Miosfacial.
                    </p>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-center gap-x-6">
                  <img
                    className="h-16 w-16 rounded-full"
                    src="../img/3.webp"
                    alt=""
                  />
                  <div>
                    <h3 className="text-base/7 font-semibold tracking-tight text-gray-900">
                      Pilar Ledesma
                    </h3>
                    <p className="text-sm/6 font-semibold text-indigo-600">
                    Terapeuta en Drenaje Linfático y terapias corporal
                    </p>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-center gap-x-6">
                  <img
                    className="h-16 w-16 rounded-full"
                    src="../img/6.webp"
                    alt="imagen del personal de Serenitea"
                  />
                  <div>
                    <h3 className="text-base/7 font-semibold tracking-tight text-gray-900">
                      Cristina Huerta
                    </h3>
                    <p className="text-sm/6 font-semibold text-indigo-600">
                      Especialista en el Cuidado Facial y Exfoliaciones
                    </p>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-center gap-x-6">
                  <img
                    className="h-16 w-16 rounded-full"
                    src="../img/1.webp"
                    alt="imagen del personal de Serenitea"
                  />
                  <div>
                    <h3 className="text-base/7 font-semibold tracking-tight text-gray-900">
                      Sandra Garcia
                    </h3>
                    <p className="text-sm/6 font-semibold text-indigo-600">
                      Especialista en reflexología Podal
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <section className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] opacity-20"></div>
          <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center"></div>
          <div className="mx-auto max-w-2xl lg:max-w-4xl">
            <img
              className="mx-auto h-12"
              src="/img/logo.png"
              alt="logo de la revista Nature"
            />
            <figure className="mt-10">
              <blockquote className="text-center text-xl/8 font-semibold text-gray-900 sm:text-2xl/9">
                <p>
                  “Las instalaciones de Serenitea ofrecen un ambiente de
                  relajación incomparable. Cada tratamiento es cuidadosamente
                  personalizado para ofrecer una experiencia única. La atención
                  de su personal, garantiza un confort continuo en todo momento.
                  Una opción excepcional para quienes buscan un refugio de
                  tranquilidad y cuidado integral.”
                </p>
              </blockquote>
              <figcaption className="mt-10">
                <img
                  className="mx-auto h-20 w-20 rounded-full"
                  src="../img/5.webp"
                  alt="imagen del creador de lar eview Oscar Torinos"
                />
                <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                  <div className="text-base font-semibold text-indigo-600">
                    Oscar Torinos
                  </div>
                  <svg
                    viewBox="0 0 2 2"
                    width="3"
                    height="3"
                    aria-hidden="true"
                    className="fill-gray-900"
                  >
                    <circle cx="1" cy="1" r="1" />
                  </svg>
                  <div className="text-gray-600">Blog : Nature</div>
                </div>
              </figcaption>
            </figure>
          </div>
        </section>
      </main>
    </>
  );
}

export default App;
