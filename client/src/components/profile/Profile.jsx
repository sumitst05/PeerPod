import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { EditProfile } from "./EditProfile";
import { getUser } from "../../utils/user";
import { useAuth } from "../../hooks/useAuth";

export const Profile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localUser, setLocalUser] = useState({});
  const location = useLocation();
  const { user, logout } = useAuth();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const links = [
    { name: "Github", url: "github.com" },
    { name: "Linkedin", url: "lnikedin.com" },
    { name: "Twitter", url: "x.com" },
  ];

  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  useEffect(() => {
    getUser(id).then((u) => {
      if (!u) {
        console.log("user undefined");
        window.location.replace("/chat");
        return;
      }
      setLocalUser(u);
    });
  }, [id]);

  return (
    <div className="mx-2 my-2 grid text-black">
      <div className="flex flex-col md:flex-row rounded-lg border border-gray-400/20 bg-white shadow-md p-6">
        <div className="relative">
          <img
            width={120}
            className="object-cover"
            src={localUser.profilePicture}
            alt="User"
          />
        </div>

        <div className="flex flex-col md:px-6 md:w-3/4">
          <div className="flex h-8 flex-row">
            <a href="https://github.com/EgoistDeveloper/" target="_blank">
              <h2 className="text-xl font-semibold">{localUser.username}</h2>
            </a>
          </div>

          <div className="mt-2 flex flex-wrap md:flex-row md:items-center gap-2">
            {links.map((link, index) => (
              <Social key={index} name={link.name} url={link.url} />
            ))}
          </div>
          {id === user._id ? (
            <div className="flex gap-2 mt-4">
              <button
                onClick={openModal}
                className="flex w-fit gap-2 items-center justify-end rounded-lg bg-blue-500 text-sm p-2 text-white transition-all duration-150 ease-in-out hover:bg-blue-600"
              >
                <img width={20} src="edit.svg" alt="edit" />
              </button>
              <button
                onClick={logout}
                className="flex w-fit gap-2 items-center justify-end rounded-lg bg-red-500 text-sm p-2 text-white transition-all duration-150 ease-in-out hover:bg-red-600"
              >
                <img width={20} src="logout.svg" alt="edit" />
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-3 max-h-screen rounded-md p-5 bg-gray-100 border border-black border-dashed">
        <h1 className="text-xl font-bold mb-2">Description</h1>
        <p className="text-justify">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sit ipsum
          magnam autem laboriosam pariatur dolorem aliquam ex inventore tempora
          consequatur itaque laudantium, nemo labore iure asperiores et hic ipsa
          sed quae cum quos! Explicabo, sed velit accusamus autem voluptatibus
          possimus tempore aliquid sunt vel, nihil similique commodi, quisquam
          aperiam dignissimos?
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde ea
          veritatis, sapiente a aspernatur accusamus odit error non! Maiores
          dolor eligendi maxime a corrupti deleniti?
        </p>
      </div>

      {isModalOpen && <EditProfile closeModal={closeModal} user={user} />}
    </div>
  );
};

const Social = ({ name, url }) => {
  return (
    <>
      <Link to={url}>
        <button className="bg-black text-xs px-3 py-1.5 font-semibold text-white inline-flex items-center space-x-2 rounded-full">
          <img width={20} src="github.svg" alt="github" />
          <span>{name}</span>
        </button>
      </Link>
    </>
  );
};
