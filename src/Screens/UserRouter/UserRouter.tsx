import { Outlet } from "react-router-dom";

const UserRouter = () => {
  return (
    <div>
      {/* You can include common layout or styling for auth screens here */}
      <Outlet /> {/* This renders the child routes */}
    </div>
  );
};

export default UserRouter;
