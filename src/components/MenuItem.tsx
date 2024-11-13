import type { MenuItems } from "../types";

type MenuItemProps = {
  item: MenuItems;
};

export default function MenuItem({ item }: MenuItemProps) {
  return (
    <button className="group w-full border-2 border-teal-400 rounded-lg hover:bg-teal-200 hover:shadow-lg">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
        <img
          src="https://tailwindui.com/plus/img/ecommerce-images/category-page-04-image-card-01.jpg"
          alt={item.description}
          className="h-full w-full object-cover object-center group-hover:opacity-55"
        />
      </div>
      <h3 className="mt-4 text-sm text-gray-700">{item.name}</h3>
      <p className="mt-1 text-lg font-medium text-gray-900">${item.price}</p>
    </button>
  );
}
