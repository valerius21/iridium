import type { Submission } from "@prisma/client";
import { useLoaderData, Outlet } from "@remix-run/react";
import type { Session, LoaderFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { atom, useRecoilState } from "recoil";
import invariant from "tiny-invariant";
import { getImage, getSubmissionCount } from "~/images.server";
import type { ImageAttribute } from "~/utils/imageHelper.server";
import { getMingleLinks } from "~/utils/register";
import {
  badRequest,
  getUser,
  getUserId,
  getUserSession,
} from "~/utils/session.server";

// TODO: #12 remove for release
export const imageHost = "https://c102-251.cloud.gwdg.de";

type LoaderType = {
  uid: string;
  count: number;
  session: Session;
  image: {
    url: string;
    attributes: ImageAttribute;
    submission: Submission[];
    id: string;
  };
};

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderType | Response> => {
  // count
  const uid = await getUserId(request);

  if (!uid) {
    return badRequest("user not found/logged in");
  }

  try {
    invariant(imageHost, "IMAGE_SERVER env variable should be defined");
  } catch (e) {
    console.error(e);
  }

  const count = await getSubmissionCount(uid);

  // redirect
  const user = await getUser(uid);
  invariant(user, "[/images.tsx] user not found");
  const { currentPrivateSubmissions, currentPublicSubmissions } = user;
  if (currentPrivateSubmissions + currentPublicSubmissions >= 60) {
    const {
      mingleLinks: { done },
    } = await getMingleLinks();
    return redirect(done + user.ticket);
  }

  // set session in state
  const session = await getUserSession(request);

  const image = await getImage(uid);

  return {
    count,
    session,
    image: {
      ...image,
      url: `${imageHost}/${image.attributes.isPrivate ? "private" : "public"}/${
        image.attributes.filename
      }`,
    },
    uid,
  };
};

export const UserAtom = atom<string>({
  default: "",
  key: "uid",
});

const Images = () => {
  const data = useLoaderData<LoaderType>();
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const [_uid, setUid] = useRecoilState(UserAtom);

  useEffect(() => {
    setUid(data.uid);
  }, [data.uid, setUid]);

  const headlines = (
    <>
      <h1 className="text-3xl font-bold">Image Evaluation</h1>
      <progress
        className="progress progress-success w-64"
        value={data.count + 1}
        max={60}
      ></progress>
      <h4 className="font-bold">{data.count + 1} / 60</h4>
    </>
  );

  return (
    <div className={`${isTabletOrMobile && "container prose"} mx-auto`}>
      {!isTabletOrMobile ? (
        <div className="mb-10 text-center">{headlines}</div>
      ) : (
        <> {headlines}</>
      )}
      <div className={`${!isTabletOrMobile && "flex justify-center"}`}>
        <Outlet />
      </div>
    </div>
  );
};

export default Images;
