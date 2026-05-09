import axios from "axios";
import Canvas from "../../_components/Canvas";
const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;
import { cookies } from "next/headers";
const Page = async ({
  params,
}: {
  params: {
    slug: string;
  };
}) => {
  console.log(backend_url);
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  let data;

  const slug = (await params).slug;
  let roomId;
  let shapes = [];
  try {
    const res = await axios.get(`${backend_url}/shapes/${slug}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    data = res.data;
    console.log("data: ", data);
    const messages = data.messages;
    roomId = data.roomId;
    shapes = messages.map((message: any) => {
      return JSON.parse(message.message);
    });
    console.log("shapes ", shapes);
    console.log("roomId ", roomId);
  } catch (e: any) {
    console.log(e.response?.data);

    return <div>{e.response?.data?.message || "Something went wrong"}</div>;
  }
  if (!token) return;
  return (
    <div className="w-screen h-screen relative">
      <Canvas roomId={roomId} shapes={shapes} slug={slug} token={token} />
    </div>
  );
};

export default Page;
