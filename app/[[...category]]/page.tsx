import { getCategories } from "./get-data";
import { CategoryContent } from "./CategoryContent";
import NextLink from "next/link";
import { Device } from "./Device";
import { CategoriesList } from "./CategoriesList";

type CategoryParam =
  | []
  | [string]
  | [string, string]
  | [string, string, string];

export async function generateStaticParams(): Promise<
  { category: CategoryParam }[]
> {
  const categories = await getCategories();

  const categoryParams = categories.flatMap((category) => {
    const base = [category.id] satisfies CategoryParam;

    const subCategories = category.subCategories.flatMap((subCategory) => {
      const subBase = [...base, subCategory.name] satisfies CategoryParam;

      const links = subCategory.links.map(
        (link) => [...subBase, link.name] satisfies CategoryParam
      );

      return [subBase, ...links];
    });

    return [base, ...subCategories];
  });

  const params = [[] satisfies CategoryParam, ...categoryParams].map(
    (category) => ({
      category,
    })
  );

  return params;
}

type CategoryParams = Awaited<
  ReturnType<typeof generateStaticParams>
>[number]["category"];

export default async function Category({
  params,
}: {
  params: { category?: CategoryParams };
}) {
  const data = await getCategories();

  const [categoryId, subCategoryId, linkId] = params.category || [];
  const pageCategory = categoryId
    ? data.find((category) => category.id === categoryId)
    : null;

  return (
    <div className="desktop-grid">
      <CategoriesList categories={data} categoryId={categoryId} />
      {pageCategory && (
        <div className="desktop-content hidden sm:block">
          <CategoryContent
            subCategories={pageCategory.subCategories}
            categoryName={pageCategory.displayName}
          />
        </div>
      )}
    </div>
  );
}
