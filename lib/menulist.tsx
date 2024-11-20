import {
  Settings,
  SquarePen,
  LayoutGrid,
  LucideIcon,
  UsersRound,
  Book,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "Home",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          active: pathname.includes("/dashboard"),
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Contents",
      menus: [
        {
          href: "a",
          label: "Products",
          active: pathname.includes("a"),
          icon: SquarePen,
          submenus: [
            {
              href: "/dashboard/products",
              label: "All Products",
              active: pathname.includes("/dashboard/products"),
            },
            {
              href: "/dashboard/products/add",
              label: "Add New Product",
              active: pathname.includes("/dashboard/products/add"),
            },
            {
              href: "/dashboard/categories",
              label: "Categories",
              active: pathname.includes("/dashboard/categories"),
            },
            {
              href: "/dashboard/brands",
              label: "Brands",
              active: pathname.includes("/dashboard/brands"),
            },
          ],
        },
        {
          href: "/dashboard/orders",
          label: "Orders",
          active: pathname.includes("/orders"),
          icon: UsersRound,
          submenus: [],
        },
        {
          href: "/dashboard/customers",
          label: "Customers",
          active: pathname.includes("/customers"),
          icon: UsersRound,
          submenus: [],
        },

        {
          href: "/dashboard/promo",
          label: "Promotions",
          active: pathname.includes("/promo"),
          icon: UsersRound,
          submenus: [],
        },

        {
          href: "/dashboard/reviews",
          label: "Reviews",
          active: pathname.includes("/reviews"),
          icon: UsersRound,
          submenus: [],
        },

        {
          href: "c",
          label: "Staff",
          active: pathname.includes("c"),
          icon: Book,
          submenus: [
            {
              href: "/dashboard/staff",
              label: "All Staff",
              active: pathname === "/dashboard/staff",
            },
            {
              href: "/dashboard/staff/add",
              label: "Add Staff",
              active: pathname === "/dashboard/staff/add",
            },
          ],
        },

        {
          href: "/dashboard/blog",
          label: "Blog",
          active: pathname.includes("/dashboard/blog"),
          icon: Book,
          submenus: [
            {
              href: "/dashboard/blog/posts",
              label: "All Posts",
              active: pathname === "/dashboard/blog/posts",
            },
            {
              href: "/dashboard/blog/posts/new",
              label: "New Post",
              active: pathname === "/dashboard/blog/posts/new",
            },
          ],
        },
      ],
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: "/account",
          label: "Account",
          active: pathname.includes("/account"),
          icon: Settings,
          submenus: [],
        },
      ],
    },
  ];
}
