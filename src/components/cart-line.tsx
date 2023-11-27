import { useCartUpdateLines } from "@/shopify-api/useCart";
import { useQueryClient } from "@tanstack/react-query";
import { FC, useCallback, useEffect, useState } from "react";
import debounce from "lodash/debounce";
import { CartLineFragment } from "@/graphql/_generated/operations";
import formatCurrency from "@/utils/currency";
import clsx from "clsx";

interface CartLineProps {
  line: CartLineFragment;
  removeItem: () => void;
  pagesRouter?: boolean;
}

export const CartLine: FC<CartLineProps> = ({
  line,
  removeItem,
  pagesRouter = false,
}) => {
  const [quantity, setQuantity] = useState(line.quantity);
  const [hint, setHint] = useState("");
  const queryClient = useQueryClient();
  const image = line.merchandise.image;
  const availableQuantity = line.merchandise.quantityAvailable ?? undefined;
  const updateLines = useCartUpdateLines(pagesRouter);

  const pending = updateLines.isPending;

  const handleQuantityChange = useCallback(
    (nextQuantity: number) => {
      if (isNaN(nextQuantity)) {
        return;
      }

      if (nextQuantity < 1) {
        setHint("Minimum quantity is 1");
        return;
      }

      if (availableQuantity && nextQuantity > availableQuantity) {
        setHint(`Available quantity is ${availableQuantity}`);
        return;
      }

      setHint("");
      setQuantity(nextQuantity);
    },
    [availableQuantity]
  );

  useEffect(() => {
    const debouncedUpdate = debounce(
      () => {
        if (quantity !== line.quantity && !updateLines.isPending) {
          updateLines.mutate(
            {
              lines: [{ id: line.id, quantity }],
            },
            {
              onError: () => {
                setQuantity(line.quantity);
              },
            }
          );
        }
      },
      500,
      { leading: false }
    );

    debouncedUpdate();

    return () => {
      debouncedUpdate.cancel();
    };
  }, [line.id, line.quantity, quantity, queryClient, updateLines]);

  return (
    <div className="flex gap-4 bg-white p-2 text-neutral-900" key={line.id}>
      <div className="relative my-auto aspect-square h-16 w-16">
        {image ? (
          <img
            src={image.url}
            alt={image?.altText ?? ""}
            className="absolute inset-0 w-full h-full"
          />
        ) : null}
      </div>
      <div className="flex w-full flex-auto flex-col gap-4">
        <h3 className="body-16 w-full font-semibold">
          {line.merchandise.product.title}
        </h3>

        <div className="flex flex-wrap items-center justify-between">
          <span className={clsx("body-14", { "animate-pulse": pending })}>
            {formatCurrency(
              line.cost.subtotalAmount.amount,
              line.cost.subtotalAmount.currencyCode
            )}
          </span>
          <label>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  handleQuantityChange(quantity - 1);
                }}
              >
                -<span className="sr-only">Decrease Quantity</span>
              </button>
              <input
                type="number"
                className="w-6 appearance-none text-center outline-none"
                value={quantity}
                min={1}
                onChange={(e) => {
                  const nextQuantity = parseInt(e.target.value);
                  handleQuantityChange(nextQuantity);
                }}
              />
              <button
                onClick={() => {
                  handleQuantityChange(quantity + 1);
                }}
              >
                +<span className="sr-only">Increase Quantity</span>
              </button>
            </div>
            {hint ? <span className="body-12 text-red-500">{hint}</span> : null}
          </label>
        </div>
      </div>
      <button
        onClick={removeItem}
        className="ml-2 h-9 w-[42px] shrink-0 !p-0 bg-red-600 text-white"
      >
        X<span className="sr-only">Remove</span>
      </button>
    </div>
  );
};
