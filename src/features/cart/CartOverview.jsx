import { useSelector } from "react-redux";
import { formatCurrency } from "../../utilities/helpers";
import { Link } from "react-router-dom";
import { getTotalCartPrice, getTotalCartQuantity } from "./cartSlice";
function CartOverview() {
  const totalCartQuantity = useSelector(getTotalCartQuantity);
  const totalCartPrice = useSelector(getTotalCartPrice);
  if (!totalCartQuantity) return;
  return (
    <div className="flex items-center justify-between bg-stone-800 px-4 py-4 uppercase text-stone-200 sm:px-6 md:text-base">
      <p className=" space-x-4 text-stone-300">
        <span className="font-semibold">{totalCartQuantity} pizzas</span>
        <span>${formatCurrency(totalCartPrice)}</span>
      </p>
      <Link to="/cart">Open cart &rarr;</Link>
    </div>
  );
}

export default CartOverview;
