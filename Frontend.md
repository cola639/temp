{
  path: "/view/dashboard",
  element: <Dashboard />,
  loader: async () => {
    console.log("Simple loader running");
    await new Promise(res => setTimeout(res, 500));
    return { message: "ok" };
  },
}


import { useLoaderData } from "react-router-dom";

export default function Dashboard() {
  const data = useLoaderData();
  console.log("Dashboard rendered", data);
  return <div>Dashboard loaded with data: {data.message}</div>;
}
