import { Outlet, useLoaderData, useParams } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { useMediaQuery } from "react-responsive";
import { prisma } from "~/db.server";
import { imageHost } from "../images";

export const loader: LoaderFunction = async ({ params }) => {
  const args = {
    where: {
      AND: [
        {
          id: {
            equals: params.img,
          },
        },
      ],
    },
    select: {
      id: true,
      createdAt: false,
      updatedAt: false,
      attributes: true,
      submission: false,
    },
  };
  const resp = await prisma.dataset.findFirst({ ...args });
  console.log({ resp });
  return {
    ...resp,
  };
};

const Image = () => {
  const data = useLoaderData<{
    id: string;
    attributes: {
      isPrivate: boolean;
      filename: string;
    };
  }>();
  const { attributes } = data;
  const { isPrivate, filename } = attributes;

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  return (
    <>
      <div className={`${!isTabletOrMobile && "mr-10"}`}>
        <img
          src={`${imageHost}/${isPrivate ? "private" : "public"}/${filename}`}
          alt="eval"
          className="mx-auto w-[500px] rounded-xl object-contain shadow-xl"
        />
      </div>
      <div className={`${!isTabletOrMobile && "prose max-w-lg"}`}>
        <Outlet />
      </div>
    </>
  );
};

export default Image;
