/* eslint-disable no-unused-vars */
// https://uibakery.io/regex-library/phone-number
import { useState } from "react";
import { Form, redirect, useActionData, useNavigation } from "react-router-dom";
import { createOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import EmptyCart from "../cart/EmptyCart";
import { formatCurrency } from "../../utilities/helpers";
import store from "..//../store";
import { clearCart } from "../cart/cartSlice";
import { fetchAdress } from "../user/userSlice";
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(str);

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false);
  const {
    username,
    status: adressStatus,
    position,
    address,
    error: errorAddress,
  } = useSelector((state) => state.user);
  const isLoadingAdress = adressStatus === "loading";
  const { cart } = useSelector((state) => state.cart);
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const formErrors = useActionData();
  const totalCartPrice = useSelector((state) =>
    state.cart.cart.reduce((acc, item) => acc + item.totalPrice, 0)
  );
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0;
  const dispatch = useDispatch();
  const totalPrice = priorityPrice + totalCartPrice;
  if (!cart.length) return <EmptyCart />;
  return (
    <div className="px-4 py-6">
      <h2 className="mb-8 text-xl font-semibold">Ready to order? Let&apos;s go!</h2>

      <Form method="POST">
        <div className="sm: mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className=" sm:basis-40">First Name</label>
          <input
            type="text"
            name="customer"
            required
            className="input grow"
            defaultValue={username}
          />
        </div>

        <div className="sm: mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className=" sm:basis-40">Phone number</label>
          <div className="grow">
            <input type="tel" name="phone" required className="input w-full" />
            {formErrors?.phone && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">
                {formErrors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="sm: relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className=" sm:basis-40">Address</label>
          <div className="flex grow flex-col">
            <input
              type="text"
              name="address"
              required
              className="input w-full"
              disabled={isLoadingAdress}
              defaultValue={address}
            />
            {adressStatus === "error" && (
              <p className="mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700">{errorAddress}</p>
            )}
          </div>

          {!position.latitude && !position.longitude && (
            <span className="absolute right-[3px] top-[3px] z-50  md:right-[5px] md:top-[5px]">
              <Button
                disabled={isLoadingAdress}
                type="small"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(fetchAdress());
                }}
              >
                Get position
              </Button>
            </span>
          )}
        </div>

        <div className="mb-12 flex items-center gap-5">
          <input
            type="checkbox"
            name="priority"
            id="priority"
            className="h-6 w-6 accent-yellow-400 focus:ring focus:ring-yellow-400 focus:ring-offset-2"
            value={withPriority}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor="priority" className="font-medium">
            Want to yo give your order priority?
          </label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <input
            type="hidden"
            name="position"
            value={
              position.longitude && position.latitude
                ? `${position.latitude},${position.longitude}`
                : ""
            }
          />
          <Button disabled={isSubmitting || isLoadingAdress} type="primary">
            {isSubmitting ? "Placing Order..." : `Order now from ${formatCurrency(totalPrice)}!`}
          </Button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "true",
  };

  const errors = {};

  if (!isValidPhone(order.phone))
    errors.phone = "Please give us your correct phone number.We might need it to contact you";
  if (Object.keys(errors).length > 0) return errors;
  //If everything is ok,create new order and redirect
  const newOrder = await createOrder(order);
  store.dispatch(clearCart());
  return redirect(`/order/${newOrder.id}`);
}

export default CreateOrder;
