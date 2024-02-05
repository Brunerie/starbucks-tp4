"use client";
import { FC, memo, useEffect, useState } from "react";
import { ProductFilters } from "./product-filters";
import { ProductsCategoryData } from "tp-kit/types";
import { ProductCardLayout, ProductGridLayout } from "tp-kit/components";
import { ProductFiltersResult } from "../types";
import Link from "next/link";
import { AddToCartButton } from "./add-to-cart-button";
import { Loader } from '@mantine/core';

type Props = {
  categories: ProductsCategoryData[];
  showFilters?: boolean
};

const ProductList: FC<Props> = memo(function ({ categories, showFilters = false }) {
  const [filters, setFilters] = useState<ProductFiltersResult | undefined>();
  const [filteredCategories, setFilteredCategories] = useState<ProductsCategoryData[]>(categories);
  const [isLoading, setLoading] = useState<boolean>(false);

  /**
   * Triggered on each filters change
   */
  useEffect(() => {
    // If no filters, just set initial categories
    if (!filters) {
      setFilteredCategories(categories);
      return;
    }

    setLoading(true);

    // Build URL query
    const query = new URLSearchParams();
    if (filters?.search) query.set('search', filters.search);
    filters?.categoriesSlugs.forEach(slug => query.append('cat', slug));

    // Call the filter API and applies the result
    fetch(`/api/product-filters?${query}`)
      .then(res => res.json())
      .then(res => {
        setFilteredCategories(res.categories);
        setLoading(false);
      });
  }, [filters, categories]);

  return (
    <div className="flex flex-row gap-8">
      {/* Filters */}
      {showFilters && <div className="w-full max-w-[270px]">
        <ProductFilters categories={categories} onChange={setFilters} />
      </div>}

      {/* Grille Produit */}
      <div className="flex-1 space-y-24 relative">
        {/* Loader */}
        {isLoading && <div className="bg-coffee-50/90 absolute inset-0 z-10">
          <div className="sticky top-0 flex justify-center items-center h-screen">
            <Loader className="stroke-brand" />
          </div>
        </div>}

        {/* Categories */}
        {filteredCategories.map((cat) => (
          <section key={cat.id}>
            <h2 className="text-lg font-semibold mb-8 tracking-tight">
              <Link href={`/${cat.slug}`} className="link">{cat.name} ({cat.products.length})</Link>
            </h2>

            <ProductGridLayout products={cat.products}>
              {(product) => (
                <ProductCardLayout
                  product={product}
                  button={<AddToCartButton product={product} />}
                />
              )}
            </ProductGridLayout>
          </section>
        ))}
      </div>
    </div>
  );
});

ProductList.displayName = "ProductList";
export { ProductList };
